<template>
  <div class="relative w-full">
    <div
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer flex justify-between items-center bg-white"
      @click="toggleDropdown"
    >
      {{ selectedCategoryDisplay || placeholder }}
      <svg
        class="h-4 w-4 ml-2 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <ul>
        <li
          v-for="option in displayedCategories"
          :key="option.id"
          class="py-2 px-3 hover:bg-indigo-100 cursor-pointer"
          :class="{ 'font-bold': option.depth === 0 }"
          @click="selectCategory(option)"
        >
          {{ option.displayName }}
        </li>
        <li v-if="displayedCategories.length === 0" class="py-2 px-3 text-gray-500">
          카테고리 없음
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, PropType } from 'vue';

// CategoryRes는 백엔드에서 받은 원본 데이터의 인터페이스
interface CategoryRes {
  bcno: number;
  name: string;
  parentBcno: number;
  depth: number;
}

// Category는 내부적으로 사용할 계층 및 표시 이름이 추가된 인터페이스
interface Category {
  id: number;
  originalName: string; // 들여쓰기 없는 원래 이름 (실제 값)
  displayName: string;  // 들여쓰기된 표시 이름 (옵션 목록에 표시)
  parentBcno: number;
  children: Category[]; // 다시 children 추가 (트리 구조 빌드용)
  depth: number;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<number[] | null>,
    default: null,
  },
  categories: { // Prop 이름은 `categories` 그대로 사용
    type: Array as PropType<CategoryRes[]>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '카테고리 선택',
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectedCategory = ref<Category | null>(null);

const categories = ref<Category[]>([]);
const displayedCategories = ref<Category[]>([]);

const categoryMap = ref<Map<number, Category>>(new Map());


const selectedCategoryDisplay = computed(() => {
  return selectedCategory.value ? selectedCategory.value.originalName : '';
});

// 선택된 카테고리로부터 모든 상위 카테고리 ID를 포함하는 배열을 생성
const getParentCategoryIds = (categoryId: number | null): number[] => {
  const ids: number[] = [];
  let currentId = categoryId;

  while (currentId !== null && currentId !== 0) {
    const currentCategory = categoryMap.value.get(currentId);
    if (currentCategory) {
      ids.unshift(currentCategory.id);
      currentId = currentCategory.parentBcno;
    } else {
      break;
    }
  }
  return ids;
};

const processCategories = (rawList: CategoryRes[]) => {
  if (!rawList || rawList.length === 0) {
    categories.value = [];
    displayedCategories.value = [];
    categoryMap.value.clear();
    return;
  }
  categoryMap.value.clear();

  rawList.forEach(i => {
    const prefix = '└' + '─'.repeat(i.depth) + ' ';
    const newCategory: Category = {
      id: i.bcno,
      originalName: i.name,
      displayName: `${prefix}${i.name}`,
      children: [],
      parentBcno: i.parentBcno,
      depth: i.depth
    };
    categoryMap.value.set(i.bcno, newCategory);
  });

  // 트리 구조 생성
  rawList.forEach(i => {
    const currentCategory = categoryMap.value.get(i.bcno);
    if (currentCategory) {
      if (i.parentBcno === 0) {
        categories.value.push(currentCategory);
      } else {
        const parent = categoryMap.value.get(i.parentBcno);
        if (parent) {
          parent.children.push(currentCategory);
          // 자식들을 bcno 오름차순으로 정렬
          // parent.children.sort((a, b) => a.id - b.id);
        }
      }
    }
  });
  // 최상위 카테고리도 bcno 오름차순으로 정렬
  // categories.value.sort((a, b) => a.id - b.id);

  // 계층 구조를 평탄화
  const displayed: Category[] = [];
  const buildDisplayList = (categoryList: Category[]) => {
    categoryList.forEach(cat => {
      displayed.push({
        ...cat,
        children: [] // 평탄화된 목록에서는 children이 의미 없으므로 빈 배열로
      });
      if (cat.children && cat.children.length > 0) {
        buildDisplayList(cat.children);
      }
    });
  };
  buildDisplayList(categories.value);
  displayedCategories.value = displayed;
};


watch(() => props.categories, (newCategories) => {
  processCategories(newCategories);
}, { immediate: true, deep: true });

watch(() => props.modelValue, (newVal) => {
  if (newVal === null || newVal.length === 0) {
    selectedCategory.value = null;
  } else {
    const lastSelectedId = newVal[newVal.length - 1];
    if (displayedCategories.value.length > 0) {
      selectedCategory.value = displayedCategories.value.find(cat => cat.id === lastSelectedId) || null;
    } else {
      selectedCategory.value = null;
    }
  }
}, { deep: true });

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCategory = (category: Category) => {
  selectedCategory.value = category;
  const idsToEmit = getParentCategoryIds(category.id);
  emit('update:modelValue', idsToEmit);
  isOpen.value = false;
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative.w-full')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
