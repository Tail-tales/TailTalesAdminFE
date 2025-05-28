<template>
  <div class="relative w-full">
    <div
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer flex justify-between items-center bg-white"
      @click="toggleDropdown"
    >
      {{ categoryStore.selectedCategoryDisplayName || placeholder }}
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
      <div v-if="categoryStore.isFetchingCategories" class="py-4">
        <SpinnerLoader />
      </div>
      <ul v-else>
        <li
          v-for="option in categoryStore.flatDisplayedCategories"
          :key="option.id"
          class="py-2 px-3 hover:bg-indigo-100 cursor-pointer"
          :class="{ 'font-bold': option.depth === 0 }"
          @click="selectCategory(option.id)"
        >
          {{ option.displayName }}
        </li>
        <li v-if="categoryStore.flatDisplayedCategories.length === 0 && !categoryStore.isLoading" class="py-2 px-3 text-gray-500">
          카테고리 없음
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, PropType } from 'vue';
import { useCategoryStore, Category } from '@/stores/category'; // Pinia 스토어 및 Category 인터페이스 임포트
import SpinnerLoader from '@/components/LoadingSpinner';

const props = defineProps({
  modelValue: {
    type: Array as PropType<number[] | null>,
    default: null,
  },
  placeholder: {
    type: String,
    default: '카테고리 선택',
  },
});

const emit = defineEmits(['update:modelValue']);

const categoryStore = useCategoryStore();

const isOpen = ref(false);

watch(() => props.modelValue, (newVal) => {
  categoryStore.setInitialSelectedCategoryIds(newVal);
}, { immediate: true, deep: true });

watch(() => categoryStore.selectedCategoryIds, (newVal) => {
  emit('update:modelValue', newVal);
});

watch(() => categoryStore.error, (newError) => {
  if (newError) {
    toastAlert.value?.show(newError, 'error');
    categoryStore.error = null
  }
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && categoryStore.flatDisplayedCategories.length === 0 && !categoryStore.isLoading) {
    categoryStore.fetchAndProcessCategories();
  }
};

const selectCategory = (categoryId: number) => {
  categoryStore.selectCategoryForDropdown(categoryId);
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
  if (categoryStore.flatDisplayedCategories.length === 0 && !categoryStore.isLoading) {
    categoryStore.fetchAndProcessCategories();
  }
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