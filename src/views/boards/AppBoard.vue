<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Boards" />

    <div class="mt-5">
      <FilterForm
        :filters="[
          { key: 'category', label: '카테고리', options:categoryStore.flatCategoryNames },
          { key: 'sort', label: '정렬', options: ['최신순', '오래된순', '조회수순', '댓글순', '즐겨찾기순'] },
        ]"
        @update:filters="handleFiltersUpdate"
        @update:searchTerm="handleSearchTermUpdate"
      />

      <div class="flex flex-col mt-6">
        <div
          class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div
            class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
          >
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Category
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Title
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    view
                  </th>
                  <!-- <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Comments
                  </th> -->
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200"
                  >
                    Created at
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-100 border-b border-gray-200"
                  ></th>
                </tr>
              </thead>

              <tbody class="bg-white" v-if="boards && boards.dtoList.length > 0">
                <tr
                  v-for="u in boards?.dtoList"
                  :key="u.bno"
                  class="cursor-pointer hover:bg-gray-100"
                  @click="goToDetail(u.bno)"
                >

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    {{ formatCategories(u.categories) }}
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                      <div
                        class="text-sm font-medium leading-5 text-gray-900"
                      >
                        {{ u.title }}
                      </div>
                  </td>

                  <td
                    class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      {{ u.name }}
                    </div>
                  </td>

                  <td
                    class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                  >
                    {{ u.viewCnt }}
                  </td>

                  <!-- <td
                    class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                  >
                    {{ u.comments }}
                  </td> -->

                  <td
                    class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                  >
                    {{ u.createdAt.slice(0,10) }}
                  </td>

                  <td
                    class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                  >
                    <div class="flex justify-around">
                      <span class="text-yellow-500 flex justify-center">
                        <button @click.stop="goToEdit(u.bno)" class="mx-2 px-2 rounded-md"
                          ><svg
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
                        <button @click.stop="deleteBoard(u.bno)" class="mx-2 px-2 rounded-md">
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
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    작성된 게시글이 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-center mt-4">
            <PaginationItem
              :total-items="boards?.totalCount || 0"
              :items-per-page="boards?.pageRequestDto.size || 10"
              :max-visible-pages="5"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script setup lang="ts">
import { useTableData } from '../../hooks/useTableData'
const { wideTableData } = useTableData()
import Breadcrumb from '../../components/AppBreadcrumb.vue'
import { useRouter } from 'vue-router';
import PaginationItem from '@/components/boards/PaginationItem.vue';
import FilterForm from '@/components/FilterForm.vue';
import { onMounted, ref } from 'vue';
import ToastAlert from '@/components/ToastAlert.vue';
import axios from 'axios';
import { BOARD_URL, BOARD_CTG_URL } from '@/constants/api';
import { sortCode } from '@/constants/sortCode';
import { useCategoryStore } from '@/stores/category'

const router = useRouter();
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);
const categoryStore = useCategoryStore();

interface BoardDto {
  bno: number;
  title: string;
  name: string;
  viewCnt: number;
  createdAt: string;
  categories: number[];
}

interface PagingDto {
  page: number;
  size: number;
}

interface BoardsDto {
  dtoList: BoardDto[];
  pageRequestDto: PagingDto;
  totalCount: number;
  pageNumList: number[];
  prev: boolean;
  next: boolean;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}

const boards = ref<BoardsDto | null>(null);
const currentPage = ref(1);
const sort = ref<string>('')
const selectedCategoryIds = ref<number[]>([]);

const fetchBoardList = async () => {
  try{

    if (categoryStore.flatDisplayedCategories.length === 0 && !categoryStore.isFetchingCategories) {
      await categoryStore.fetchAndProcessCategories();
    }
    console.log(`${BOARD_CTG_URL}?categoryIds=${selectedCategoryIds.value}&page=${currentPage.value}&sort=${sort.value}`)
    const response = await axios.get<BoardsDto>(
      `${BOARD_CTG_URL}?categoryIds=${selectedCategoryIds.value}&page=${currentPage.value}&sort=${sort.value}`, {
      _verifyToken: true,
    },);

    boards.value = response.data;
  }catch(error: AxiosError){
    toastAlert.value?.show(error.response.data.message, 'error');
  }
}

onMounted(()=>{
  fetchBoardList();
})

const formatCategories = (categoryIds: number[]) => {
  if (!categoryIds || categoryIds.length === 0) return "";

  const categoryNames = categoryIds.map(id => {
    const category = categoryStore.getCategoryById(id);
    return category ? category.name : `알 수 없는 카테고리 (${id})`;
  }).filter(name => name !== null);

  return categoryNames.join("〉")
}

const filterConditions = ref({});
const searchTerm = ref('');

const goToDetail = (id: number) => {
  router.push(`/boards/${id}`);
}

const goToEdit = (id: number) => {
  router.push(`/boards/write/${id}`)
}

const deleteBoard = async (id: number) => {
  try{
    const response = await axios.delete(`${BOARD_URL}/${id}`,{
      _verifyToken: true,
    })

    if( response.status === 200 ){
      toastAlert.value?.show(response.data,'success');
    }
    fetchBoardList();
  }catch (error: AxiosError) {
    toastAlert.value?.show(error.response.data.message, 'error')
  }
}

const handleFiltersUpdate = (filters: { [key: string]: string }) => {
  filterConditions.value = filters;
  console.log('선택된 필터:', filters);

  if ( filters.sort !== undefined){
    sort.value = sortCode[filters.sort] || '';
  }

  if (filters.category !== undefined) {
    const selectedDisplayName = filters.category;
    if (selectedDisplayName === '전체') {
      selectedCategoryIds.value = [];
    } else {
      const foundCategory = categoryStore.flatDisplayedCategories.find(
        cat => cat.name === selectedDisplayName
      );
      if (foundCategory) {
        selectedCategoryIds.value = [foundCategory.id];
      } else {
        selectedCategoryIds.value = [];
      }
    }
  } else {
    selectedCategoryIds.value = []; // 카테고리 필터가 설정되지 않았으면 비움
  }

  currentPage.value = 1;
  fetchBoardList();
};

const handleSearchTermUpdate = (term: string) => {
  searchTerm.value = term;
  console.log('검색어:', term);
  currentPage.value = 1;
  fetchBoardList();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchBoardList();
}
</script>
