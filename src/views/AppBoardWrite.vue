<template>
  <Breadcrumb breadcrumb="board" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">글 작성</h2>

  <div class="mt-5">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2 sr-only">카테고리:</label>
        <select id="category" v-model="formData.category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="" disabled selected>카테고리</option>
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div>
        <input type="text" id="title" v-model="formData.title" placeholder="제목을 입력하세요" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <textarea id="content" v-model="formData.content" rows="10" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
      </div>
      <div class="bg-gray-100 p-2 rounded-md mb-4 flex items-center space-x-2">
        <label for="fileInput" class="flex items-center cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            첨부파일
        </label>
        <input type="file" id="fileInput" @change="handleFileChange" class="hidden" multiple>
        <div v-if="formData.files && formData.files.length > 0" class="mt-2">
          <div class="flex space-x-2">
            <div v-for="(file, index) in formData.files" :key="index" class="relative">
              <img v-if="file.preview" :src="file.preview" alt="미리보기" class="w-20 h-20 object-cover rounded border">
              <span v-else>{{ file.name }}</span>
              <button type="button" @click="removeFile(index)" class="absolute top-0 right-0 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button type="submit" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">완료</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '../partials/AppBreadcrumb.vue';
import { ref } from 'vue';

interface UploadedFile {
  file: File;
  name: string;
  preview?: string;
}

const categoryOptions = ref([
  { value: 'notice', label: '공지' },
  { value: 'free', label: '자유게시판' },
  { value: 'question', label: '질문' },
]);

const formData = ref({
  category: '',
  title: '',
  content: '',
  files: [] as UploadedFile[], // 변경: 여러 파일 저장을 위한 배열
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  formData.value.files = []; // 기존 파일 목록 초기화

  files.forEach((file: File) => {
    const uploadedFile: UploadedFile = { file: file, name: file.name }; // 파일 이름 저장
    formData.value.files.push(uploadedFile);
    if (file.type.startsWith('image/')) {
      uploadedFile.preview = URL.createObjectURL(file);
    }
  });
};

const removeFile = (index: number) => {
  formData.value.files.splice(index, 1);
};

const submitForm = () => {
  console.log(formData.value);
  alert('글이 작성되었습니다!');
  formData.value.title = '';
  formData.value.content = '';
  formData.value.files = [];
};
</script>