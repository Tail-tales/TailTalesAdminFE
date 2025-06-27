<template>
  <Breadcrumb breadcrumb="boards" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">글 작성</h2>

  <div class="mt-5">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <CategorySelect 
          v-model="formData.categories"
          placeholder="카테고리 선택"
        />
      </div>
      <div>
        <input type="text" id="title" v-model="formData.title" placeholder="제목을 입력하세요" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="shadow appearance-none border rounded w-full 2xl:h-72 md:h-64 py-3 px-3 bg-white">
        <div class="md:h-4/6 2xl:h-5/6"><QuillEditor :options="quillOptions" v-model="formData.content" ref="quillEditorRef"/></div>
      </div>
      <div class="flex justify-end space-x-2">
        <button type="submit"
          class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
          :disabled="isLoading"
          style="min-width: 64.8px ; min-height: 40px;"
          >
          <div v-show="isLoading">
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-5 h-5 rounded-full border-4 border-gray-200 border-b-4 border-b-indigo-500 animate-spin relative"
              ></div>
            </div>
         </div>
          <div v-show="!isLoading">등록</div>
        </button>
      </div>
    </form>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill';
import Breadcrumb from '../../components/AppBreadcrumb.vue';
import { ref, onMounted } from 'vue';
import toolbarOptions from '@/constants/toolbarOptions';
import ToastAlert from "@/components/ToastAlert.vue";
import axios from 'axios';
import { BOARD_URL, IMAGE_URL } from '@/constants/api';
import CategorySelect from '@/components/boards/CategorySelect.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);
const isLoading = ref(false);

interface ImageInfo {
  imgName: string;
  thumbnailUrl: string;
  imgUrl: string;
  imgServiceId: string;
}

interface ImageRes {
  fileName: string;
  thumbnailUrl: string;
  fileUrl: string;
  serviceId: string;
}

const formData = ref({
  categories: null as number[] | null,
  title: '',
  content: '',
});

const quillEditorRef = ref<InstanceType<typeof QuillEditor> | null>(null);
const quillInstance = ref<any | null>(null);

const quillOptions = {
  modules: {
    imageActions: {}, 
    imageFormats: {}, 
    toolbar: {
    container: toolbarOptions.value,
    },
    },
    theme: 'snow',
    formats: [
    'width', 
    'height',
    'image',
  ],
}

onMounted(() => {
  if (quillEditorRef.value) {
    quillInstance.value = quillEditorRef.value.getQuill();
  }
});


const getEditorHTML = () => {
  if (quillInstance.value) {
    formData.value.content = quillInstance.value.root.innerHTML;
    console.log('HTML Content:', formData.value.content);
  }
};

const submitForm = async () => {
  isLoading.value = true;
  getEditorHTML();

  let processedHtmlContent = formData.value.content;
  let finalUploadedImageInfos: ImageInfo[] = [];

  try {
    const imageProcessResult = await processImagesInContent(formData.value.content);
    processedHtmlContent = imageProcessResult.processedHtml;
    finalUploadedImageInfos = imageProcessResult.uploadedImageInfos;
  } catch (error) {
    console.error('게시글 이미지 처리 중 오류 발생:', error);
    toastAlert.value?.show('게시글 이미지 처리 중 오류가 발생했습니다.', 'error');
    return;
  }

  try {
    const response = await axios.post(BOARD_URL, {
      title: formData.value.title,
      content: processedHtmlContent, 
      categories: formData.value.categories,
      images: finalUploadedImageInfos,
    }, {
      _verifyToken: true
    });
    toastAlert.value?.show('게시글이 성공적으로 작성되었습니다.', 'success');
    isLoading.value = false;
    setTimeout(() => {
      formData.value.title = '';
      formData.value.content = '';
      formData.value.categories = null;
      router.push(`/boards/${response.data}`);
    }, 2000);
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);
    toastAlert.value?.show('게시글 작성 중 오류가 발생했습니다.', 'error');
  }
};

async function processImagesInContent(htmlContent: string): Promise<{ processedHtml: string, uploadedImageInfos: ImageInfo[] }> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const imgTags = doc.querySelectorAll('img');

  const uploadImageData = new FormData();
  const base64ImageMap = new Map<string, string>();

  let imageCounter = 0;
  for (const img of Array.from(imgTags)) {
    const src = img.getAttribute('src');
    if (src && src.startsWith('data:image/')) {
      const filename = `image_${Date.now()}_${imageCounter++}.${src.substring(src.indexOf('/') + 1, src.indexOf(';'))}`;

      const blob = dataURLtoBlob(src);
      uploadImageData.append('files', blob, filename);
      base64ImageMap.set(src, filename);
    }
  }

  let uploadedImageRes: ImageRes[] = [];
  if (Array.from(uploadImageData.entries()).length > 0) { 
    try {
      const imageResponse = await axios.post(IMAGE_URL, uploadImageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        _verifyToken: true
      });
      uploadedImageRes = imageResponse.data as ImageRes[];
    } catch (imageUploadError) {
      console.error('이미지 업로드 중 오류 발생:', imageUploadError);
      throw new Error('Failed to upload images.');
    }
  }

  let processedHtml = htmlContent;
  const finalImageInfos: ImageInfo[] = [];

  for (const [base64Url, tempFilename] of base64ImageMap.entries()) {
    const correspondingUploadedImg = uploadedImageRes.find(res => res.fileName === tempFilename);

    if (correspondingUploadedImg) {
      processedHtml = processedHtml.replace(base64Url, correspondingUploadedImg.fileUrl);
      finalImageInfos.push({
        imgName: correspondingUploadedImg.fileName,
        thumbnailUrl: correspondingUploadedImg.thumbnailUrl,
        imgUrl: correspondingUploadedImg.fileUrl,
        imgServiceId: correspondingUploadedImg.serviceId,
      });
    }
  }

  return { processedHtml, uploadedImageInfos: finalImageInfos };
}

function dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
</script>