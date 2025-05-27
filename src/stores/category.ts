import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import { ref, computed } from 'vue';
import { CATEGORY_LIST_URL, CATEGORY_UPDATE_URL } from '@/constants/api';


interface CategoryRes {
  bcno: number;
  name: string;
  parentBcno: number;
  depth: number;
}

export interface Category {
  id: number;
  name: string;
  originalName: string;
  displayName: string;
  parentBcno: number;
  children: Category[];
  depth: number;      
  isNew?: boolean;
}

interface CategoryOperation {
  operationType: 'CREATE' | 'UPDATE' | 'DELETE';
  bcno?: number;
  name?: string;
  parentBcno?: number | null;
}

export const useCategoryStore = defineStore('category', () => {

  const categories = ref<Category[]>([]);
  const flatDisplayedCategories = ref<Category[]>([]);
  
  // ID로 카테고리를 빠르게 찾기 위한 맵
  const categoryMap = ref<Map<number, Category>>(new Map());

  // 카테고리 변경사항 추적
  const categoryChanges = ref<CategoryOperation[]>([]);

  // 로딩 및 에러 상태
  const isFetchingCategories = ref(false); // 카테고리 목록 조회 중
  const isSavingChanges = ref(false);     // 변경사항 저장 중
  const error = ref<string | null>(null);


  const selectedCategoryIds = ref<number[] | null>(null);
  const _selectedCategory = ref<Category | null>(null);

  let idCounter = -1;

  const selectedCategoryDisplayName = computed(() => {
    return _selectedCategory.value ? _selectedCategory.value.originalName : '';
  });

  // 카테고리 ID로 Category 객체 찾기
  const getCategoryById = computed(() => (id: number) => {
    return categoryMap.value.get(id);
  });


  const fetchAndProcessCategories = async () => {
    isFetchingCategories.value = true;
    error.value = null;
    try {
      const response = await axios.get<CategoryRes[]>(CATEGORY_LIST_URL, {
        _verifyToken: true,
      });

      categoryChanges.value = [];
      categoryMap.value.clear();

      const tempCategories: Category[] = [];
      const tempFlatCategories: Category[] = [];

      response.data.forEach(i => {
        const prefix = '└' + '─'.repeat(i.depth) + ' ';
        const newCategory: Category = {
          id: i.bcno,
          name: i.name,
          originalName: i.name,
          displayName: `${prefix}${i.name}`,
          children: [],
          parentBcno: i.parentBcno,
          depth: i.depth
        };
        categoryMap.value.set(i.bcno, newCategory);
      });

      response.data.forEach(i => {
        const currentCategory = categoryMap.value.get(i.bcno);
        if (currentCategory) {
          if (i.parentBcno === 0) { // 최상위 카테고리
            tempCategories.push(currentCategory);
          } else {
            const parent = categoryMap.value.get(i.parentBcno);
            if (parent) {
              parent.children.push(currentCategory);
            }
          }
        }
      });

      const buildDisplayList = (categoryList: Category[]) => {
        categoryList.forEach(cat => {
          tempFlatCategories.push({ ...cat, children: [] }); // 평탄화된 목록에서는 children이 의미 없으므로 빈 배열로
          if (cat.children && cat.children.length > 0) {
            buildDisplayList(cat.children);
          }
        });
      };
      buildDisplayList(tempCategories);

      categories.value = tempCategories;
      flatDisplayedCategories.value = tempFlatCategories;

      if (selectedCategoryIds.value && selectedCategoryIds.value.length > 0) {
        const lastSelectedId = selectedCategoryIds.value[selectedCategoryIds.value.length - 1];
        _selectedCategory.value = flatDisplayedCategories.value.find(cat => cat.id === lastSelectedId) || null;
      }

    } catch (err: any) {
      console.error('카테고리 조회 API 통신 중 에러 발생:', err);
      error.value = '카테고리 조회 중 오류가 발생했습니다.';
      throw err;
    } finally {
      isFetchingCategories.value = false;
    }
  };

  const setInitialSelectedCategoryIds = (ids: number[] | null) => {
    selectedCategoryIds.value = ids;
    if (ids && ids.length > 0) {
      const lastSelectedId = ids[ids.length - 1];
      _selectedCategory.value = flatDisplayedCategories.value.find(cat => cat.id === lastSelectedId) || null;
    } else {
      _selectedCategory.value = null;
    }
  };

  const selectCategoryForDropdown = (categoryId: number) => {
    const ids: number[] = [];
    let currentId: number | null = categoryId;

    while (currentId !== null && currentId !== 0) {
      const currentCategory = categoryMap.value.get(currentId);
      if (currentCategory) {
        ids.unshift(currentCategory.id); // 부모부터 자식 순서로 정렬
        currentId = currentCategory.parentBcno;
      } else {
        break;
      }
    }
    selectedCategoryIds.value = ids;
    _selectedCategory.value = categoryMap.value.get(categoryId) || null;
  };


  const recordChange = (change: CategoryOperation) => {
    if (change.operationType === 'CREATE') {
      categoryChanges.value.push(change);
      return;
    }

    const existingIndex = categoryChanges.value.findIndex(op => op.bcno === change.bcno);

    if (existingIndex !== -1) {
      const existingChange = categoryChanges.value[existingIndex];

      if (change.operationType === 'DELETE') {
        if (existingChange.operationType === 'CREATE') {
          categoryChanges.value.splice(existingIndex, 1);
        } else {
          categoryChanges.value[existingIndex] = change;
        }
      } else if (change.operationType === 'UPDATE') {
        if (existingChange.operationType === 'CREATE') {
          categoryChanges.value[existingIndex] = {
            ...existingChange,
            ...change,
            operationType: 'CREATE'
          };
        } else if (existingChange.operationType !== 'DELETE') {
          categoryChanges.value[existingIndex] = { ...existingChange, ...change };
        }
      }
    } else {
      categoryChanges.value.push(change);
    }
  };

  const addCategory = (parentId: number | null) => {
    if (parentId !== null && parentId < 0) {
      error.value = '상위 카테고리를 먼저 저장해야 하위 카테고리를 추가할 수 있습니다.';
      return;
    }

    const newCategory: Category = {
      id: idCounter--,
      name: '새 카테고리',
      originalName: '새 카테고리',
      displayName: '',
      parentBcno: parentId !== null ? parentId : 0,
      children: [],
      depth: 0, // 임시값, 실제 깊이는 저장 후 다시 불러올 때 반영
      isNew: true
    };
    
    const prefix = '└' + '─'.repeat(newCategory.depth) + ' ';
    newCategory.displayName = `${prefix}${newCategory.name}`;

    if (parentId === null || parentId === 0) {
      categories.value.push(newCategory);
    } else {
      const parent = findCategoryByIdInTree(categories.value, parentId);
      if (parent) {
        parent.children.push(newCategory);
      }
    }
    categoryMap.value.set(newCategory.id, newCategory); 

    flatDisplayedCategories.value.push({ ...newCategory, children: [] });

    recordChange({
      operationType: 'CREATE',
      bcno: newCategory.id,
      name: newCategory.name,
      parentBcno: parentId
    });
    return newCategory.id;
  };

  const updateCategory = (id: number, newName: string) => {
    const category = findCategoryByIdInTree(categories.value, id);
    if (category) {
      category.name = newName;
      category.originalName = newName;
      const prefix = '└' + '─'.repeat(category.depth) + ' ';
      category.displayName = `${prefix}${newName}`;

      const flatCategory = categoryMap.value.get(id);
      if (flatCategory) {
        flatCategory.name = newName;
        flatCategory.originalName = newName;
        flatCategory.displayName = `${prefix}${newName}`;
      }

      recordChange({
        operationType: 'UPDATE',
        bcno: id,
        name: newName
      });
    }
  };


  const deleteCategory = (id: number) => {
    const categoriesToDelete: number[] = [];
    const categoryToDelete = findCategoryByIdInTree(categories.value, id);

    const collectChildrenIds = (category: Category) => {
      categoriesToDelete.push(category.id);
      category.children.forEach(child => collectChildrenIds(child));
    };

    if (categoryToDelete) {
      collectChildrenIds(categoryToDelete);
    }

    categories.value = removeCategoryByIdFromTree(categories.value, id);
    flatDisplayedCategories.value = flatDisplayedCategories.value.filter(cat => !categoriesToDelete.includes(cat.id));
    categoriesToDelete.forEach(deletedId => categoryMap.value.delete(deletedId));


    categoriesToDelete.forEach(deletedId => {
      recordChange({
        operationType: 'DELETE',
        bcno: deletedId
      });
    });
  };

  const saveChanges = async () => {
    isSavingChanges.value = true;
    error.value = null;
    try {
      const requestBody = categoryChanges.value.map(change => {
        const { operationType, bcno, name, parentBcno } = change;
        const body: any = { operationType };

        if (bcno !== undefined && bcno >= 0) { // 임시 ID는 전송하지 않음
          body.bcno = bcno;
        }
        if (name !== undefined) {
          body.name = name;
        }
        if (parentBcno !== undefined) {
          body.parentBcno = parentBcno === null ? 0 : parentBcno;
        }
        return body;
      }).filter(change => change.operationType !== 'CREATE' || change.name);

      if (requestBody.length === 0) {
        isSavingChanges.value = false;
        return;
      }

      const response = await axios.post(CATEGORY_UPDATE_URL, requestBody, {
        _verifyToken: true,
      });

      categoryChanges.value = [];
      await fetchAndProcessCategories();
      return response;
    } catch (err: any) {
      console.error('카테고리 변경사항 저장 중 오류 발생:', err);
      throw err;
    } finally {
      isSavingChanges.value = false;
    }
  };

  const findCategoryByIdInTree = (list: Category[], id: number): Category | null => {
    for (const item of list) {
      if (item.id === id) return item;
      const found = findCategoryByIdInTree(item.children, id);
      if (found) return found;
    }
    return null;
  };

  const removeCategoryByIdFromTree = (list: Category[], id: number): Category[] => {
    return list
      .map(item => ({
        ...item,
        children: removeCategoryByIdFromTree(item.children, id),
      }))
      .filter(item => item.id !== id);
  };


  return {
    // --- 상태 (State) ---
    categories,              // AppCategory용 트리 구조
    flatDisplayedCategories, // Dropdown용 평탄화된 목록
    categoryChanges,         
    isFetchingCategories,
    isSavingChanges,             
    error,                   
    selectedCategoryIds,     // Dropdown v-model용
    _selectedCategory,       // Dropdown 내부 선택 객체

    // --- 게터 (Getters) ---
    selectedCategoryDisplayName, // CategoryDropdown용
    getCategoryById,             // 공통 유틸리티 게터

    // --- 액션 (Actions) ---
    fetchAndProcessCategories, // 공통: 데이터 로드 및 가공
    setInitialSelectedCategoryIds, //
    selectCategoryForDropdown,     //

    addCategory,    // 카테고리 추가
    updateCategory, // 카테고리 수정
    deleteCategory, // 카테고리 삭제
    saveChanges,    // 카테고리 저장
  };
});