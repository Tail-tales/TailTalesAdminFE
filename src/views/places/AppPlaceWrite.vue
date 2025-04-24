<template>
  <Breadcrumb breadcrumb="place" />

  <h2 class="text-xl font-semibold leading-tight text-gray-700">시설 등록</h2>

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
      <div class="flex items-center">
        <input type="text" id="placeName" v-model="formData.placeName" placeholder="시설명을 입력하세요" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="flex items-center">
        <input type="text" id="roadAddress" v-model="formData.roadAddress" placeholder="주소를 입력하세요" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <button type="button" @click="openPostcodePopup" class="w-36 ml-2 px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">주소 검색</button>
      </div>
      <div class="flex items-center">
        <input type="text" id="detailAddress" v-model="formData.detailAddress" placeholder="상세주소를 입력하세요" required class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <input type="text" id="postcode" v-model="formData.postcode" placeholder="우편번호" required class="ml-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <input type="text" id="contact" v-model="formData.contact" placeholder="연락처를 입력하세요" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
  <label class="block text-gray-700 text-sm font-bold mb-2">이용시간</label>
  <div v-for="(day, index) in dayOptions" :key="index" class="flex items-center space-x-2 mb-1 justify-center mr-6">
    <label :for="`startTime-${day.value}`" class="w-12 text-right text-gray-700 text-sm">{{ day.label }}</label>
    <select :id="`startTime-${day.value}`" v-model="formData.hours[day.value].start" class="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <option value="" disabled>시작 시간</option>
      <option v-for="time in timeOptions" :key="`start-${day.value}-${time}`" :value="time">{{ time }}</option>
    </select>
    <span class="text-gray-700">-</span>
    <select :id="`endTime-${day.value}`" v-model="formData.hours[day.value].end" class="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <option value="" disabled>종료 시간</option>
      <option v-for="time in timeOptions" :key="`end-${day.value}-${time}`" :value="time">{{ time }}</option>
    </select>
  </div>
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
        <button type="submit" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">등록</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '../../partials/AppBreadcrumb.vue';
import { ref, onMounted } from 'vue';

interface DaumPostcodeOptions {
  oncomplete?: (data: PostcodeData) => void;
}

declare global {
  interface Window {
    daum?: {
      Postcode?: new (options?: DaumPostcodeOptions) => {
        open: () => void;
      };
    };
  }
}

interface PostcodeData {
  roadAddress: string;
  zonecode: string;
}

interface UploadedFile {
  file: File;
  name: string;
  preview?: string;
}

interface FormData {
  category: string;
  placeName: string;
  postcode: string;
  roadAddress: string;
  detailAddress: string;
  contact: string;
  hours: {
    [key: string]: { // 인덱스 시그니처: 문자열 키를 가짐
      start: string;
      end: string;
    };
    monday: { start: string; end: string; };
    tuesday: { start: string; end: string; };
    wednesday: { start: string; end: string; };
    thursday: { start: string; end: string; };
    friday: { start: string; end: string; };
    saturday: { start: string; end: string; };
    sunday: { start: string; end: string; };
  };
  files: UploadedFile[];
}

const categoryOptions = ref([
  { value: 'reptiles', label: '파충류' },
  { value: 'amphibians', label: '양서류' },
  { value: 'birds', label: '조류' },
]);

const formData = ref<FormData>({
  category: '',
  placeName: '',
  postcode: '',
  roadAddress: '',
  detailAddress: '',
  contact: '',
  hours: {
    monday: { start: '', end: '' },
    tuesday: { start: '', end: '' },
    wednesday: { start: '', end: '' },
    thursday: { start: '', end: '' },
    friday: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  },
  files: [] as UploadedFile[],
});

const dayOptions = ref([
  { value: 'monday', label: '월' },
  { value: 'tuesday', label: '화' },
  { value: 'wednesday', label: '수' },
  { value: 'thursday', label: '목' },
  { value: 'friday', label: '금' },
  { value: 'saturday', label: '토' },
  { value: 'sunday', label: '일' },
]);
const timeOptions = ref(Array.from({ length: 25 }, (_, i) => i < 10 ? `0${i}:00` : `${i}:00`).slice(1));

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  files.forEach((file: File) => {
    const uploadedFile: UploadedFile = { file: file, name: file.name };
    formData.value.files.push(uploadedFile);
    if (file.type.startsWith('image/')) {
      uploadedFile.preview = URL.createObjectURL(file);
    }
  });
};

const removeFile = (index: number) => {
  formData.value.files.splice(index, 1);
};

//임시 작성 완료 함수
const submitForm = () => {
  console.log(formData.value);
  alert('글이 작성되었습니다!');
};

onMounted(() => {
  if (!window.daum?.Postcode) {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
      console.log('Daum Postcode API Loaded');
    };
    document.head.appendChild(script);
  }
});

const openPostcodePopup = () => {
  if (window.daum?.Postcode) {
    new window.daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        formData.value.roadAddress = data.roadAddress;
        formData.value.postcode = data.zonecode;
      },
    }).open();
  } else {
    alert('우편번호 서비스 로딩 중입니다. 잠시 후 다시 시도해주세요.');
  }
};
</script>