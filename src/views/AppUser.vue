<template>
    <div>
      <!-- Breadcrumb -->
      <Breadcrumb breadcrumb="User" />
        <div class="mt-5">
          <h2 class="text-xl font-semibold leading-tight text-gray-700">Users</h2>
  
          <FilterForm
          :filters="[
            { key: 'role', label: '역할', options: ['전체', '일반', '펫시터'] },
            { key: 'level', label: '등급', options: ['전체', 'Bear', 'Otter', 'Dog', 'Parrot', 'Lizard'] },
          ]"
          @update:filters="handleFiltersUpdate"
          @update:searchTerm="handleSearchTermUpdate"
          />
  
          <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
            <div
              class="inline-block min-w-full overflow-hidden rounded-lg shadow"
            >
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      User
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Contact
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Role
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Created at
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Level
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Settings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in paginatedTableData" :key="index">
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img
                            class="w-full h-full rounded-full"
                            :src="u.picture"
                            alt="profile pic"
                          />
                        </div>
  
                        <div class="ml-4">
                        <div
                          class="text-sm font-medium leading-5 text-gray-900"
                        >
                          {{ u.name }}
                        </div>
                        <div class="text-sm leading-5 text-gray-500">
                          {{ u.email }}
                        </div>
                      </div>
                      </div>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <p class="text-gray-900 whitespace-nowrap">{{ u.contact }}</p>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <p class="text-gray-900 whitespace-nowrap">{{ u.role }}</p>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ u.created }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                    <LevelBadge :level="u.level" :levelColor="u.levelColor" />
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <div class="flex start">
                        <span class="text-yellow-500 flex justify-center">
                          <router-link :to="`/user/${u.id}`" class="mx-2 px-2 py-1 rounded-md"
                            ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.15 1.25H13.875C14.775 1.25 15.525 1.975 15.525 2.875V10.325C15.525 11.225 14.8 11.95 13.875 11.95H12.15V14.75L9.525 11.95H2.15C1.25 11.95 0.5 11.225 0.5 10.325V2.875C0.5 1.975 1.225 1.25 2.15 1.25Z" fill="#4FD1D9"/>
                            <path d="M12 7.64999C12.5799 7.64999 13.05 7.17989 13.05 6.59999C13.05 6.02009 12.5799 5.54999 12 5.54999C11.4201 5.54999 10.95 6.02009 10.95 6.59999C10.95 7.17989 11.4201 7.64999 12 7.64999Z" fill="white"/>
                            <path d="M7.99995 7.64999C8.57985 7.64999 9.04995 7.17989 9.04995 6.59999C9.04995 6.02009 8.57985 5.54999 7.99995 5.54999C7.42005 5.54999 6.94995 6.02009 6.94995 6.59999C6.94995 7.17989 7.42005 7.64999 7.99995 7.64999Z" fill="white"/>
                            <path d="M3.99995 7.64999C4.57985 7.64999 5.04995 7.17989 5.04995 6.59999C5.04995 6.02009 4.57985 5.54999 3.99995 5.54999C3.42005 5.54999 2.94995 6.02009 2.94995 6.59999C2.94995 7.17989 3.42005 7.64999 3.99995 7.64999Z" fill="white"/>
                            </svg>
                          </router-link>
                          <form method="POST">
                            <button class="mx-2 px-2 rounded-md">
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
                          </form>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
              >
                <span class="text-xs text-gray-900 xs:text-sm"
                  >Showing 1 to 4 of 50 Entries</span
                >
  
                <div class="inline-flex mt-2 xs:mt-0">
                  <button
                    class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400"
                  >
                    Prev
                  </button>
                  <button
                    class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  
<script setup lang="ts">
import { useTableData } from '../hooks/useTableData'
const { paginatedTableData } = useTableData()
import Breadcrumb from '../partials/AppBreadcrumb.vue'
import LevelBadge from '../components/users/LevelBadge.vue'
import FilterForm from '../components/FilterForm.vue'
import { ref } from 'vue';

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
  