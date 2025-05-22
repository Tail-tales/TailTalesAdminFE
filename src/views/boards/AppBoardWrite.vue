<template>
  <Breadcrumb breadcrumb="board" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">글 작성</h2>

  <div class="mt-5">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
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
      <div class="shadow appearance-none border rounded w-full 2xl:h-72 md:h-64 py-3 px-3 bg-white">
        <div class="md:h-4/6 2xl:h-5/6"><QuillEditor :toolbar="toolbarOptions" theme="snow" v-model="formData.content" ref="quillEditorRef"/></div>
      </div>
      <div class="flex justify-end space-x-2">
        <button type="submit" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">완료</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill';
import Breadcrumb from '../../partials/AppBreadcrumb.vue';
import { ref, onMounted } from 'vue';
import toolbarOptions from '@/hooks/toolbarOptions';

const categoryOptions = ref([
  { value: 'notice', label: '공지' },
  { value: 'free', label: '자유게시판' },
  { value: 'question', label: '질문' },
]);

const formData = ref({
  category: '',
  title: '',
  content: '',
});

const quillEditorRef = ref<InstanceType<typeof QuillEditor> | null>(null);
const quillInstance = ref<any | null>(null);

onMounted(() => {
  if (quillEditorRef.value) {
    quillInstance.value = quillEditorRef.value.getQuill();
    console.log('Quill Instance:', quillInstance.value);
  }
});

const getEditorHTML = () => {
  if (quillInstance.value) {
    formData.value.content = quillInstance.value.root.innerHTML; // 여전히 root.innerHTML로 접근 가능한지 확인 필요
    console.log('HTML Content:', formData.value.content);
  }
};

const submitForm = () => {
  getEditorHTML();
  console.log(formData.value);
  alert('글이 작성되었습니다!');
  formData.value.title = '';
  formData.value.content = '';
};
</script>