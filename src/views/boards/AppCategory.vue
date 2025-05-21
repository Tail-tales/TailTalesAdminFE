<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="category" />
    <h2 class="text-xl font-semibold leading-tight text-gray-700">카테고리 관리</h2>
    <div class="mt-5">
      <ul class="mt-4">
        <draggable
          :list="categories"
          item-key="id"
          group="categories"
          @update="onDrag(null)"
        >
          <template #item="{ element }">
            <CategoryItem
              :category="element"
              :isRoot="true"
              @add="addCategory"
              @update="updateCategory"
              @delete="deleteCategory"
              @reorder="onDrag"
            />
          </template>
        </draggable>
      </ul>
      <div class="flex justify-end py-2">
        <button class="px-4 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500" @click="addCategory(null)">카테고리 추가</button>
        <button class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500" @click="saveChanges">변경사항 저장</button>
      </div>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import draggable from 'vuedraggable'
import Breadcrumb from '../../partials/AppBreadcrumb.vue'
import CategoryItem from '../../components/boards/CategoryItem.vue'
import axios from 'axios'
import ToastAlert from "@/components/ToastAlert.vue";
import { CATEGORY_LIST_URL, CATEGORY_UPDATE_URL } from '@/constants/api'
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);

interface CategoryRes {
  bcno: number
  name: string
  parentBcno: number
  depth: number
}

interface Category {
  id: number
  name: string
  parentBcno: number
  children: Category[]
  isNew?: boolean
}

interface CategoryOperation {
  operationType: 'CREATE' | 'UPDATE' | 'DELETE';
  bcno?: number;
  name?: string;
  parentBcno?: number | null;
}

let idCounter = -1 // 음수 ID는 새로운 카테고리리

const categories = ref<Category[]>([])
const categoryChanges = ref<CategoryOperation[]>([])

const fetchCategoryList = async () => {
  try{
    const response = await axios.get<CategoryRes[]>(CATEGORY_LIST_URL,{
        _verifyToken: true,
      });
    categoryChanges.value = [];
    categories.value = [];

    const categoryMap: Map<number, Category> = new Map();

    response.data.forEach(i => {
      const newCategory: Category = {
        id: i.bcno,
        name: i.name,
        children: [],
        parentBcno: i.parentBcno
      }
      categoryMap.set(i.bcno, newCategory);
    });

    // 부모-자식 관계 설정
    response.data.forEach(i => {
      const currentCategory = categoryMap.get(i.bcno);
      if (currentCategory) {
        if (i.parentBcno === 0) {
          categories.value.push(currentCategory);
        } else {
          const parent = categoryMap.get(i.parentBcno);
          parent?.children.push(currentCategory);
        }
      }
    });

  }catch(error){
    toastAlert.value?.show('카테고리 조회 중 오류가 발생했습니다.', 'error');
  }
}

onMounted(()=>{
  fetchCategoryList();
})

const recordChange = (change: CategoryOperation) => {
  // CREATE 작업의 경우, 새 ID가 겹치지 않는 한 추가
  if (change.operationType === 'CREATE') {
    categoryChanges.value.push(change);
    return;
  }

  // 기존 변경사항 중에 동일한 bcno를 가진 작업이 있는지 확인 없으면 -1 반환
  const existingIndex = categoryChanges.value.findIndex(
      op => op.bcno === change.bcno
  );

  if (existingIndex !== -1) {
    const existingChange = categoryChanges.value[existingIndex];

    // DELETE 작업의 경우
    if (change.operationType === 'DELETE') {
      // 기존에 CREATE 작업이 있었다면 해당 CREATE 작업은 무시 (생성 후 바로 삭제)
      if (existingChange.operationType === 'CREATE') {
        categoryChanges.value.splice(existingIndex, 1); // CREATE 작업 제거
      } else {
        // 기존 작업이 UPDATE 였다면 DELETE로 덮어쓰기
        categoryChanges.value[existingIndex] = change;
      }
    }
    // UPDATE 작업의 경우
    else if (change.operationType === 'UPDATE') {
      // 기존에 CREATE 작업이 있었다면, CREATE 작업에 name 또는 parentBcno 업데이트
      if (existingChange.operationType === 'CREATE') {
        categoryChanges.value[existingIndex] = {
          ...existingChange,
          ...change,
          operationType: 'CREATE'
        };
      } else {
        // 기존 작업이 UPDATE였다면, 가장 최근 UPDATE로 덮어쓰기
        // 단, DELETE는 다른 모든 작업을 무시하고 삭제가 최종 작업이 되어야 함
        if (existingChange.operationType !== 'DELETE') {
          categoryChanges.value[existingIndex] = { ...existingChange, ...change };
        }
      }
    }
  } else {
    // 기존에 없으면 새로운 변경사항으로 추가
    categoryChanges.value.push(change);
  }
};

function addCategory(parentId: number) {
  const newCategory: Category = {
    id: idCounter--, // 임시 ID는 음수로 설정
    name: '새 카테고리',
    parentBcno: parentId,
    children: [],
    isNew: true
  }

  if (parentId === null) {
    categories.value.push(newCategory)
  } else {
    const parent = findCategoryById(categories.value, parentId)
    parent?.children.push(newCategory)
  }

  recordChange({
    operationType: 'CREATE',
    bcno: newCategory.id, // 임시 ID
    name: newCategory.name,
    parentBcno: parentId
  })
}

function updateCategory(id: number, newName: string) {
  const update = (list: Category[]): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.id === id) {
        list[i] = { ...item, name: newName }
        recordChange({
          operationType: 'UPDATE',
          bcno: id,
          name: newName
        })
        return true
      }
      if (update(item.children)) {
        return true
      }
    }
    return false
  }

  update(categories.value)
}

function deleteCategory(id: number) {
  // 삭제될 카테고리의 모든 자식 카테고리도 함께 삭제 목록에 추가
  const categoriesToDelete: number[] = [];

  const collectChildrenIds = (category: Category) => {
    categoriesToDelete.push(category.id);
    category.children.forEach(child => collectChildrenIds(child));
  };

  const categoryToDelete = findCategoryById(categories.value, id);
  if (categoryToDelete) {
    collectChildrenIds(categoryToDelete);
  }

  // 실제로 카테고리를 목록에서 제거
  categories.value = removeCategoryById(categories.value, id);

  // DELETE 작업 기록 (삭제된 모든 카테고리에 대해)
  categoriesToDelete.forEach(deletedId => {
    recordChange({
      operationType: 'DELETE',
      bcno: deletedId
    });
  });
}

async function saveChanges() {
  // API 요청 바디 생성
  const requestBody = categoryChanges.value.map(change => {
    const { operationType, bcno, name, parentBcno } = change;
    const body: any = { operationType };

    if (bcno !== undefined) {
      body.bcno = bcno;
    }
    if (name !== undefined) {
      body.name = name;
    }
    // 부모 카테고리가 없는 경우 0으로 설정
    if (parentBcno !== undefined) {
      body.parentBcno = parentBcno === null ? 0 : parentBcno;
    }

    // CREATE 작업의 경우 임시 bcno는 전송하지 않음
    if (operationType === 'CREATE') {
      delete body.bcno;
    }
    return body;
  })

  console.log('API 요청 바디:', JSON.stringify(requestBody, null, 2));

  // try {
  //   const response = await axios.post(CATEGORY_UPDATE_URL, requestBody, {
  //       _verifyToken: true,
  //     });
  //   console.log('API 응답:', response.data);
  //   toastAlert.value?.show('카테고리 변경사항이 성공적으로 저장되었습니다.', 'success');

  //   // 성공적으로 저장되면 변경사항 추적 목록을 비우고 카테고리 목록을 다시 불러옴
  //   categoryChanges.value = [];
  //   await fetchCategoryList();
  // } catch (error) {
  //   console.error('카테고리 변경사항 저장 중 오류 발생:', error);
  //   toastAlert.value?.show('카테고리 변경사항 저장 중 오류가 발생했습니다.', 'error');
  // }
}

// drag-and-drop에서 children도 reorder 가능하도록
function onDrag(parentId: number | null) {
  return () => {
    console.log('Reordered under parent:', parentId)
  }
}

// 유틸 함수
function findCategoryById(list: Category[], id: number): Category | null {
  for (const item of list) {
    if (item.id === id) return item
    const found = findCategoryById(item.children, id)
    if (found) return found
  }
  return null
}

function removeCategoryById(list: Category[], id: number): Category[] {
  return list
    .map(item => ({
      ...item,
      children: removeCategoryById(item.children, id),
    }))
    .filter(item => item.id !== id)
}
</script>
