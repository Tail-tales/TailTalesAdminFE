<template>
  <div>
    <Breadcrumb breadcrumb="category" />
    <h2 class="text-xl font-semibold leading-tight text-gray-700">카테고리 관리</h2>
    <div class="mt-5">
      <div v-if="categoryStore.isFetchingCategories">
        <SpinnerLoader />
      </div>

      <ul class="mt-4">
        <CategoryItem
          v-for="element in categoryStore.categories"
          :key="element.id"
          :category="element"
          :isRoot="true"
          @add="handleCategoryAdd"
          @update="handleCategoryUpdate"
          @delete="handleCategoryDelete"
        />
      </ul>
      <div class="flex justify-end py-2">
        <button
          class="px-4 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
          @click="handleCategoryAdd(0)" :disabled="categoryStore.isLoading"
        >
          카테고리 추가
        </button>
        <button
          class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 flex"
          @click="handleSaveChanges"
          :disabled="categoryStore.isSavingChanges || categoryStore.categoryChanges.length === 0"
          style="min-width: 162px;"
          >
         <div v-show="categoryStore.isSavingChanges">
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-5 h-5 rounded-full border-4 border-gray-200 border-b-4 border-b-indigo-500 animate-spin relative"
              ></div>
            </div>
         </div>
         <div v-show="!categoryStore.isSavingChanges">변경사항 저장 ({{ categoryStore.categoryChanges.length }})</div>
        </button>
      </div>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Breadcrumb from '../../components/AppBreadcrumb.vue';
import CategoryItem from '../../components/boards/CategoryItem.vue';
import ToastAlert from "@/components/ToastAlert.vue";
import { useCategoryStore } from '@/stores/category';
import SpinnerLoader from '@/components/LoadingSpinner';

const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);
const categoryStore = useCategoryStore();

watch(() => categoryStore.error, (newError) => {
  if (newError) {
    toastAlert.value?.show(newError, 'error');
    categoryStore.error = null; // 에러 메시지 한 번 표시 후 초기화
  }
});

onMounted(() => {
  categoryStore.fetchAndProcessCategories().catch(() => {
    toastAlert.value?.show(categoryStore.error || '카테고리 로딩 중 알 수 없는 오류 발생', 'error');
  });
});

const handleCategoryAdd = (parentId: number | null) => {
  categoryStore.addCategory(parentId);
  if (categoryStore.error) {
    toastAlert.value?.show(categoryStore.error, 'warning');
    categoryStore.error = null;
  }
};

const handleCategoryUpdate = (id: number, newName: string) => {
  categoryStore.updateCategory(id, newName);
};

const handleCategoryDelete = (id: number) => {
    categoryStore.deleteCategory(id);
};

const handleSaveChanges = async () => {
  try {
    await categoryStore.saveChanges();
    toastAlert.value?.show('카테고리 변경사항이 성공적으로 저장되었습니다.', 'success');
  } catch (error) {
    toastAlert.value?.show(categoryStore.error || '카테고리 저장 중 알 수 없는 오류 발생', 'error');
  }
};
</script>

<style scoped>
/* 기존 스타일 유지 */
</style>