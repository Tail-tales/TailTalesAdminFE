<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="User" />
    <div class="mt-5">
      <h4 class="text-gray-700 font-bold">작성한 글</h4>
      <div class="w-full max-w-sm mt-6 lg:max-w-full lg:flex">
        <div
          class="flex-none h-48 overflow-hidden text-center bg-cover rounded-t lg:h-auto lg:w-48 lg:rounded-t-none lg:rounded-l"
          style="background-image: url('https://picsum.photos/id/0/192/213')"
          title="Woman holding a mug"
        ></div>
        <div
          class="flex flex-col justify-between p-4 leading-normal bg-white border-b border-l border-r border-gray-200 rounded-b lg:border-l-0 lg:border-t lg:border-gray-200 lg:rounded-b-none lg:rounded-r"
        >
          <div class="mb-8">
            <p class="flex items-center text-sm text-gray-600">
              <svg class="mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17 3C15.9391 3 14.9217 3.42143 14.1716 4.17157C13.4214 4.92172 13 5.93913 13 7C13 8.06087 13.4214 9.07828 14.1716 9.82843C14.9217 10.5786 15.9391 11 17 11C18.0609 11 19.0783 10.5786 19.8284 9.82843C20.5786 9.07828 21 8.06087 21 7C21 5.93913 20.5786 4.92172 19.8284 4.17157C19.0783 3.42143 18.0609 3 17 3ZM3 17C3 15.9391 3.42143 14.9217 4.17157 14.1716C4.92172 13.4214 5.93913 13 7 13C8.06087 13 9.07828 13.4214 9.82843 14.1716C10.5786 14.9217 11 15.9391 11 17C11 18.0609 10.5786 19.0783 9.82843 19.8284C9.07828 20.5786 8.06087 21 7 21C5.93913 21 4.92172 20.5786 4.17157 19.8284C3.42143 19.0783 3 18.0609 3 17ZM13 14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13H20C20.2652 13 20.5196 13.1054 20.7071 13.2929C20.8946 13.4804 21 13.7348 21 14V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15C14.4696 21 13.9609 20.7893 13.5858 20.4142C13.2107 20.0391 13 19.5304 13 19V14ZM3 4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H10C10.2652 3 10.5196 3.10536 10.7071 3.29289C10.8946 3.48043 11 3.73478 11 4V9C11 9.53043 10.7893 10.0391 10.4142 10.4142C10.0391 10.7893 9.53043 11 9 11H5C4.46957 11 3.96086 10.7893 3.58579 10.4142C3.21071 10.0391 3 9.53043 3 9V4Z" fill="#909090"/>
              </svg>
              자유게시판
            </p>
            <div class="mb-2 text-xl font-bold text-gray-900">
              Can coffee make you a better developer?
            </div>
            <p class="text-base text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div class="flex items-center">
            
            <div class="text-sm">
              <p class="leading-none text-gray-900">댓글 0</p>
              <p class="text-gray-600">Aug 18</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5">
      <h4 class="text-gray-700 font-bold">작성한 댓글</h4>

      <div class="mt-6">
        <div class="my-6 overflow-hidden bg-white rounded-md shadow">
          <table class="w-full text-left border-collapse">
            <thead class="border-b">
              <tr>
                <th
                  class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                >
                  Title
                </th>
                <th
                  class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                >
                  Comment
                </th>
                <th
                  class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800"
                >
                  Setting
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i, index) in simpleTableData"
                :key="index"
                class="hover:bg-gray-200"
              >
                <td class="px-6 py-4 text-lg text-gray-700 border-b">
                  {{ i.title }}
                </td>
                <td class="px-6 py-4 text-gray-500 border-b">
                  {{ i.comment }}
                </td>
                <td class="px-6 py-4 text-lg text-gray-700 border-b">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { useTableData } from '../hooks/useTableData'
const { simpleTableData } = useTableData()
import Breadcrumb from '../components/AppBreadcrumb.vue'
</script>
