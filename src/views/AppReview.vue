<template>
  <Breadcrumb breadcrumb="review" />
  <div class="mt-5">
    <FilterForm
        :filters="[
          { key: 'category', label: '카테고리', options: ['전체', '양서류', '조류', '파충류' ] },
          { key: 'type', label: '타입', options: ['전체', '의료', '분양', '먹이', '용품'] },
          { key: 'sort', label: '정렬', options: ['최신순', '오래된순', '좋아요순'] },
        ]"
        @update:filters="handleFiltersUpdate"
        @update:searchTerm="handleSearchTermUpdate"
      />
    <div v-for="u in post" :key="u.id" class="mt-5 bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-10 h-10">
            <img
              class="w-full h-full rounded-full"
              src="@/assets/logo.png"
              alt="profile pic"
            />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium leading-5 text-gray-900">
              {{ u.user }}
              <LevelBadge :level="`${u.level}`" :levelColor="`${ u.levelColor }`" />
            </div>
            <div class="text-sm leading-5 text-gray-500">
              <StarRate :initial-rating="u.score" :readonly="true" />
              {{ u.createdAt }}
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <button>
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
      <h2 class="text-xl font-semibold mb-2">{{ u.title }}</h2>
      <p>{{ u.content }}</p>

      <div v-if="u.files && u.files.length > 0" class="mt-4">
        <div class="flex space-x-2">
          <template v-for="(file, index) in filterImageFiles(u.files)" :key="index">
            <img
              v-if="file.url"
              :src="file.url"
              alt="첨부 이미지"
              class="w-32 h-32 object-cover rounded-md"
            />
          </template>
          <template v-for="(file, index) in filterOtherFiles(u.files)" :key="`file-${index}`">
            <a
              v-if="file.url"
              :href="file.url"
              target="_blank"
              class="text-blue-500 hover:underline"
              >{{ file.name }}</a
            >
          </template>
        </div>
      </div>
      <div class="flex justify-end text-gray-500">
        좋아요
        <span class="ml-1 text-sm">{{ u.favoriteCount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '../partials/AppBreadcrumb.vue';
import { ref } from 'vue';
import LevelBadge from '../components/users/LevelBadge.vue';
import StarRate from "../partials/AppStarRate.vue";
import FilterForm from '@/components/FilterForm.vue';

interface FileInfo {
  name: string;
  url: string;
}

// 예시 데이터 (실제로는 API 호출 등을 통해 가져와야 합니다.)
const post = ref([{
  id: 1,
  place: 2,
  user: '코코코',
  level: 'Bear 🐻‍❄️',
  levelColor: 'indigo',
  title: '여기 진짜 미침',
  content: '개구리 좋아하시는 분들 블라블라',
  createdAt: '2025-04-15 14:17:00',
  favoriteCount: 10,
  score: 3,
  files: [
    { name: 'image1.png', url: 'https://placehold.co/150' },
    { name: 'image2.jpg', url: 'https://placehold.co/100' },
  ] as FileInfo[],
},{
  id: 2,
  place: 3,
  user: '햅삐삐',
  level: 'Dog 🐶',
  levelColor: 'green',
  title: '또 와야지',
  content: '나 원래 동물 별로 안 좋아하는데 여기 너무 좋음',
  createdAt: '2025-04-18 14:50:00',
  favoriteCount: 2,
  score: 4,
  files: [
    { name: 'image1.png', url: 'https://placehold.co/150' },
    { name: 'image2.jpg', url: 'https://placehold.co/100' },
  ] as FileInfo[],
}
]);

const filterImageFiles = (files: FileInfo[] | undefined): FileInfo[] => {
  return files?.filter(file => isImage(file.name)) || [];
};

const filterOtherFiles = (files: FileInfo[] | undefined): FileInfo[] => {
  return files?.filter(file => !isImage(file.name)) || [];
};

const isImage = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
};

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

</script>