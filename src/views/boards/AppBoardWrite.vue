<template>
  <Breadcrumb breadcrumb="board" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">글 작성</h2>

  <div class="mt-5">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <select id="category" v-model="formData.category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="" disabled selected>카테고리</option>
          <option v-for="option in allCategories" :key="option.id" :value="option.id">
            {{ option.name }}
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

const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);

interface CategoryRes {
  bcno: number
  name: string
  parentBcno: number
  depth: number
}

interface Category {
  id: number
  name: string
  parentBcno: number
  children: Category[]
  depth: number;
}

const categories = ref<Category[]>([])
const allCategories = ref<Category[]>([])

const formData = ref({
  category: '',
  title: '',
  content: '',
});

const quillEditorRef = ref<InstanceType<typeof QuillEditor> | null>(null);
const quillInstance = ref<any | null>(null);

const flattenCategories = (categoryList: Category[]) => {
  categoryList.forEach(cat => {
    const prefix = '└'+'─'.repeat(cat.depth)+' '; // depth * 2 칸씩 들여쓰기
    allCategories.value.push({
      ...cat,
      name: `${prefix}${cat.name}`, // 들여쓰기된 이름으로 저장
    });
    // 자식 카테고리에 대해 재귀 호출 (flattenCategories는 depth를 내부적으로 관리할 필요 없음)
    if (cat.children && cat.children.length > 0) {
      // 자식들은 이미 자신들의 정확한 depth를 가지고 있으므로,
      // 다시 flattenCategories를 호출할 때 depth 매개변수를 전달할 필요 없음.
      flattenCategories(cat.children);
    }
  });
};

const fetchCategoryList = async () => {
  try{
    const response = await axios.get<CategoryRes[]>(CATEGORY_LIST_URL,{
        _verifyToken: true,
      });
    categories.value = [];
    allCategories.value = [];

    const categoryMap: Map<number, Category> = new Map();

    response.data.forEach(i => {
      const newCategory: Category = {
        id: i.bcno,
        name: i.name,
        children: [],
        parentBcno: i.parentBcno,
        depth: i.depth
      }
      categoryMap.set(i.bcno, newCategory);
    });

    response.data.sort((a, b) => a.depth - b.depth || a.bcno - b.bcno);

    // 부모-자식 관계 설정
    response.data.forEach(i => {
      const currentCategory = categoryMap.get(i.bcno);
      if (currentCategory) {
        if (i.parentBcno === 0) {
          categories.value.push(currentCategory);
        } else {
          const parent = categoryMap.get(i.parentBcno);
          parent?.children.push(currentCategory);
        }
      }
    });

    flattenCategories(categories.value);

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
  const newPost = {
    title: formData.value.title,
    content: formData.value.content,
    categories: [formData.value.category]
  }
  console.log(newPost);
  // const response = await axios.post(BOARD_URL,{ newPost },{ _verifyToken: true })
  // formData.value.title = '';
  // formData.value.content = '';
};
</script>