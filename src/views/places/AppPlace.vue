<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="place" />
    <div class="mt-4 mb-3">
      <FilterForm
        :filters="[
          { key: 'category', label: '카테고리', options: ['전체', '양서류', '조류', '파충류' ] },
          { key: 'type', label: '타입', options: ['전체', '의료', '분양', '먹이', '용품'] },
          { key: 'sort', label: '정렬', options: ['최신순', '오래된순', '조회수순', '댓글순', '즐겨찾기순'] },
        ]"
        @update:filters="handleFiltersUpdate"
        @update:searchTerm="handleSearchTermUpdate"
      />
      <div class="flex flex-wrap gap-4">
        <div
          v-for="u in placeTableData"
          :key="u.id"
          class="max-w-sm mt-6 overflow-hidden bg-white rounded shadow-lg">
          <img
            class="w-full"
            src="https://picsum.photos/id/1016/384/234"
            alt="Sunset in the mountains"
          />
          <div class="px-6 py-4">
              <div class="mb-2 text-xl font-bold text-gray-900">
                {{ u.placeName }}
              </div>
            <div class="text-base text-gray-700">
              <div class="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="w-1/12" aria-hidden="true">
                  <path d="M9,1C5.4,1,2.5,3.7,2.5,7.1c0,1.2,0.4,2.3,1,3.3l5.1,6.1c0.2,0.2,0.6,0.2,0.8,0l5.1-6.1c0.7-1,1-2.1,1-3.3C15.5,3.7,12.6,1,9,1z M9,9C8.2,9,7.5,8.3,7.5,7.5C7.5,6.7,8.2,6,9,6s1.5,0.7,1.5,1.5C10.5,8.3,9.8,9,9,9z" fill="gray"></path>
                </svg>
                {{ u.address }}
              </div>
              <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="w-1/12" aria-hidden="true">
                  <path d="M9,1.5C4.9,1.5,1.5,4.9,1.5,9c0,4.1,3.4,7.5,7.5,7.5c4.1,0,7.5-3.4,7.5-7.5C16.5,4.9,13.1,1.5,9,1.5zM11.7,11.5c-0.2,0.3-0.6,0.3-0.9,0.1L8.4,9.9V5.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v3.4l1.9,1.4C11.8,10.8,11.9,11.2,11.7,11.5z" fill="gray"></path>
                </svg>
                <div>
                  <p v-for="(hour, index) in u.hours" :key="index">
                    {{ getFormattedHours(hour) }}<br v-if="index < u.hours.length - 1" />
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="w-1/12" aria-hidden="true">
                  <path d="M13.8,15.6c-0.2,0.2-0.6,0.3-0.9,0.3C7.6,14.6,3.4,10.4,2.1,5.1C2,4.8,2.1,4.5,2.4,4.2l1.5-1.5c0.4-0.4,1-0.4,1.4,0l0,0l2.5,2.5c0.4,0.4,0.4,1,0,1.4L7.8,6.7L7.1,7.5C6.7,7.8,6.7,8.3,6.9,8.7c0.8,1.2,1.9,2.2,3.1,2.9c0,0,0.8-0.7,1.3-1.3c0.4-0.4,1-0.4,1.4,0l2.5,2.5l0,0c0.4,0.4,0.4,1,0,1.4L13.8,15.6z" fill="gray"></path>
                </svg>
                {{ u.contact }}
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <div class="px-6 pt-4 pb-2">
              <span
                class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                >{{ u.category }}</span
              >
              <span
                class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                >별점 {{ u.score }}</span
              >
              <span
                class="inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                >{{ u.type }}</span
              >
            </div>
            <div class="mx-4">
              <button class="mr-4 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button class="rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-red-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Breadcrumb from '../../components/AppBreadcrumb.vue'
import { useTableData } from '../../hooks/useTableData'
import { ref } from 'vue';
import FilterForm from '@/components/FilterForm.vue';

const { placeTableData } = useTableData()

const filterConditions = ref({});
const searchTerm = ref('');


const handleFiltersUpdate = (filters: { [key: string]: string }) => {
  filterConditions.value = filters;
  console.log('선택된 필터:', filters);
};

const handleSearchTermUpdate = (term: string) => {
  searchTerm.value = term;
  console.log('검색어:', term);
};

interface Hour {
  day: string;
  start: string;
  end: string;
}

const getFormattedHours = (hour: Hour): string => {
  const dayMap: { [key: string]: string } = {
    monday: '월',
    tuesday: '화',
    wednesday: '수',
    thursday: '목',
    friday: '금',
    saturday: '토',
    sunday: '일',
  };
  return `${dayMap[hour.day]}: ${hour.start}-${hour.end}`;
};
</script>
