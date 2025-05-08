<template>
    <div class="flex mr-4 rounded">
        <a
            href="#"
            @click.prevent="goToPreviousPage"
            class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white"
            ><span>Previous</span></a
        >
        <a  
            v-for="page in visiblePages"
            :key="page"
            @click.prevent="goToPage(page)"
            href="#"
            class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
            ><span>{{ page }}</span></a
        >
        <a
            @click.prevent="goToNextPage"
            href="#"
            class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white"
            ><span>Next</span></a
        >
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';


interface Props{
    totalItems: number;
    itemsPerPage?: number;
    maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(),{
    itemsPerPage: 10,
    maxVisiblePages: 5,
});

const emit = defineEmits(['page-change']);

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const visiblePages = computed(() => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage.value - Math.floor(props.maxVisiblePages / 2));
    const endPage = Math.min(totalPages.value, startPage + props.maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    emit('page-change', page);
  }
};

const goToPreviousPage = () => {
  goToPage(currentPage.value - 1);
};

const goToNextPage = () => {
  goToPage(currentPage.value + 1);
};
</script>