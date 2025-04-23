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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import Breadcrumb from '../../partials/AppBreadcrumb.vue'
import CategoryItem from '../../components/boards/CategoryItem.vue'

interface Category {
  id: number
  name: string
  children: Category[]
}

let idCounter = 1000

const categories = ref<Category[]>([
  { id: 1, name: '공지사항', children: [] },
  { id: 2, name: '이벤트', children: [] },
])

function addCategory(parentId: number | null) {
  const newCategory: Category = {
    id: ++idCounter,
    name: '새 카테고리',
    children: [],
  }

  if (parentId === null) {
    categories.value.push(newCategory)
  } else {
    const parent = findCategoryById(categories.value, parentId)
    parent?.children.push(newCategory)
  }
}

function updateCategory(id: number, newName: string) {
  console.log('updateCategory 호출:', id, newName);
  const foundCategory = findCategoryById(categories.value, id);
  console.log('찾은 카테고리:', foundCategory);
  const update = (list: Category[]): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.id === id) {
        list[i] = { ...item, name: newName }
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
  categories.value = removeCategoryById(categories.value, id)
}

function saveChanges() {
  console.log('변경사항 저장:', JSON.stringify(categories.value, null, 2))
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
