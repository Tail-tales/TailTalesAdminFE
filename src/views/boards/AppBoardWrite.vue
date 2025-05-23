<template>
  <Breadcrumb breadcrumb="boards" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">글 작성</h2>

  <div class="mt-5">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <CategorySelect 
          v-model="formData.categories"
          :categories="categories"
          placeholder="카테고리 선택"
        />
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
  <ToastAlert ref="toastAlert"/>
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill';
import Breadcrumb from '../../partials/AppBreadcrumb.vue';
import { ref, onMounted } from 'vue';
import toolbarOptions from '@/hooks/toolbarOptions';
import ToastAlert from "@/components/ToastAlert.vue";
import axios from 'axios';
import { CATEGORY_LIST_URL, BOARD_URL } from '@/constants/api';
import CategorySelect from '@/components/boards/CategorySelect.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);

interface Category {
  bcno: number
  name: string
  parentBcno: number
  depth: number;
}

const categories = ref<Category[]>([])

const formData = ref({
  categories: null as number[] | null,
  title: '',
  content: '',
});

const quillEditorRef = ref<InstanceType<typeof QuillEditor> | null>(null);
const quillInstance = ref<any | null>(null);

const fetchCategoryList = async () => {
  try{
    const response = await axios.get<Category[]>(CATEGORY_LIST_URL,{
        _verifyToken: true,
      });
    categories.value = response.data;
  }catch(error){
    toastAlert.value?.show('카테고리 조회 중 오류가 발생했습니다.', 'error');
  }
}

onMounted(() => {
  fetchCategoryList();
  if (quillEditorRef.value) {
    quillInstance.value = quillEditorRef.value.getQuill();
    console.log('Quill Instance:', quillInstance.value);
  }
});

const getEditorHTML = () => {
  if (quillInstance.value) {
    formData.value.content = quillInstance.value.root.innerHTML;
    console.log('HTML Content:', formData.value.content);
  }
};

const submitForm = async () => {
  getEditorHTML();
  try {
    const response = await axios.post(BOARD_URL,{
      title: formData.value.title,
      content: formData.value.content,
      categories: formData.value.categories
      },
    { 
      _verifyToken: true
    });
    toastAlert.value?.show('게시글이 성공적으로 작성되었습니다.', 'success');
    setTimeout(()=>{
      formData.value.title = '';
      formData.value.content = '';
      formData.value.categories = null; // 초기화
      router.push(`/boards/${response.data}`)
    }, 2000)
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);
    toastAlert.value?.show('게시글 작성 중 오류가 발생했습니다.', 'error');
  }
};
</script>