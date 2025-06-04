<template>
  <Breadcrumb breadcrumb="boards" />

  <div v-if="boardDetail" class="mt-5">
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
            {{ boardDetail.name }}
            <LevelBadge level="Bear 🐻‍❄️" levelColor="indigo" />
          </div>
          <div class="text-sm leading-5 text-gray-500">
            {{ boardDetail.createdAt.slice(0,10) }}
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="toggleFavorite"
          class="flex items-center text-gray-500 hover:text-indigo-500 focus:outline-none"
        >
          <svg :class="{ 'text-indigo-500': isFavorite }"
          class="h-5 w-5" fill="currentColor" height="18px" width="18px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
          <path d="M432.9,0H107.1C94.3,0,83.8,10.4,83.8,23.3V512L270,325.8L456.2,512V23.3C456.2,10.4,445.8,0,432.9,0z M386.4,186.2h-93.1
            v93.1h-46.5v-93.1h-93.1v-46.5h93.1V46.5h46.5v93.1h93.1V186.2z"/>
          </svg>
          <span class="ml-1 text-sm">{{ favoriteCount }}</span>
        </button>
        <div class="flex items-center text-gray-500">
          조회
          <span class="ml-1 text-sm">{{ boardDetail.viewCnt }}</span>
        </div>
        <div v-if="boardDetail.name == authStore.currentAdminId" class="relative inline-block text-center mt-2">
          <button @click.stop="toggleDropdown()">
            <svg fill="#6b7280" version="1.1" id="Layer_1" xmlns:x="&amp;ns_extend;" xmlns:i="&amp;ns_ai;" xmlns:graph="&amp;ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve" transform="rotate(90)">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <metadata> <sfw> <slices> </slices> <slicesourcebounds width="505" height="984" bottomleftorigin="true" x="0" y="-120"> </slicesourcebounds> </sfw> </metadata> <g> <g> <g> <path d="M12,24C5.4,24,0,18.6,0,12S5.4,0,12,0s12,5.4,12,12S18.6,24,12,24z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10 S17.5,2,12,2z"/> </g> </g> <g> <g> <circle cx="7" cy="12" r="2"/> </g> </g> <g> <g> <circle cx="12" cy="12" r="2"/> </g> </g> <g> <g> <circle cx="17" cy="12" r="2"/> </g> </g> </g> </g>
            </svg>
          </button>
          <div
              v-if="isDropdownOpen"
              class="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="board-detail-menu-button"
              tabindex="-1"
              @click.stop
            >
              <div class="py-1" role="none">
                <a
                  href="#"
                  @click.prevent="goToEdit(boardDetail.bno); closeDropdown();"
                  class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  id="board-detail-item-0"
                  >수정</a
                >
                <a
                  href="#"
                  @click.prevent="deleteBoard(boardDetail.bno); closeDropdown();"
                  class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  id="board-detail-item-2"
                  >삭제</a
                >
              </div>
            </div>
        </div>
      </div>
    </div>

    <div
      class="mt-5 bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      v-if="boardDetail"
    >
      <h2 class="text-xl font-semibold mb-2">{{ boardDetail.title }}</h2>
      <p class="ql-editor" v-html="boardDetail.content"></p>

    </div>

    <div class="mt-8">
      <div class="flex items-start">
        <div class="flex-shrink-0 w-10 h-10">
          <img
            class="w-full h-full rounded-full"
            src="@/assets/logo.png"
            alt="current user profile pic"
          />
        </div>
        <div class="ml-4 w-full">
          <textarea
            v-model="newComment"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="댓글을 작성하세요..."
          ></textarea>
          <div class="mt-2 flex items-center justify-between">
            <label for="comment-image" class="cursor-pointer text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="file"
                id="comment-image"
                class="hidden"
                @change="handleCommentImageChange"
                accept="image/*"
              />
            </label>
            <button
              class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
              @click="addCommentToList"
            >
              댓글 작성
            </button>
          </div>
          <div v-if="commentImagePreview" class="mt-2">
            <img
              :src="commentImagePreview"
              alt="댓글 이미지 미리보기"
              class="w-32 h-32 object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <ul v-if="comments.length > 0" class="space-y-4">
        <li v-for="(comment, index) in comments" :key="index" class="flex items-start">
          <div class="flex-shrink-0 w-10 h-10">
            <img
              class="w-full h-full rounded-full"
              src="@/assets/logo.png"
              alt="commenter profile pic"
            />
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium leading-5 text-gray-900">
              익명 사용자
            </div>
            <div class="text-sm leading-5 text-gray-500">
              방금
            </div>
            <p class="text-gray-700">{{ comment.text }}</p>
            <img
              v-if="comment.imagePreview"
              :src="comment.imagePreview"
              alt="댓글 이미지"
              class="mt-2 w-48 rounded-md"
            />
          </div>
        </li>
      </ul>
      <p v-else class="text-gray-500">아직 댓글이 없어요 가장 먼저 댓글을 남겨보세요!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '../../components/AppBreadcrumb.vue';
import { ref, onMounted } from 'vue';
import LevelBadge from '../../components/users/LevelBadge.vue';
import axios from 'axios';
import { BOARD_URL } from '@/constants/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})

interface Comment {
  text: string;
  imagePreview: string | null;
}

interface boardInfo {
  bno: number;
  title: string;
  name: string;
  content: string;
  viewCnt: number;
  createdAt: string;
  updatedAt: string | null;
  categories: string[]; // 왜 얘는 string이지..?
}

const boardDetail = ref<boardInfo | null>(null)
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const goToEdit = (id: number) => {
  router.push(`/boards/write/${id}`);
};

const deleteBoard = async (id: number) => {
    try {
      await axios.delete(`${BOARD_URL}/${id}`, {
        _verifyToken: true,
      });
      router.push('/boards');
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
    }
};

const fetchBoardDetail = async (id: number) => {
  try {
    const response = await axios.get(`${BOARD_URL}/${id}`, {
      _verifyToken: true,
    });
    boardDetail.value = response.data;
    console.log('게시글 상세 데이터:', boardDetail.value);
  } catch (error) {
    console.error(`게시글 ${id} 조회 중 오류 발생:`, error);
  }
};

onMounted(() => {
  fetchBoardDetail(props.id);
});

const newComment = ref('');
const commentImage = ref<File | null>(null);
const commentImagePreview = ref<string | null>(null);
const comments = ref<Comment[]>([]);
const isFavorite = ref(false);
const favoriteCount = ref(2); // 초기 즐겨찾기 수

const handleCommentImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    commentImage.value = file;
    commentImagePreview.value = URL.createObjectURL(file);
  } else {
    commentImage.value = null;
    commentImagePreview.value = null;
  }
};

const addCommentToList = () => {
  if (newComment.value || commentImagePreview.value) {
    const newCommentObject: Comment = {
      text: newComment.value,
      imagePreview: commentImagePreview.value,
    };
    comments.value.push(newCommentObject);
    newComment.value = '';
    commentImage.value = null;
    commentImagePreview.value = null;
  } else {
    alert('댓글 내용을 입력하거나 이미지를 첨부해주세요.');
  }
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  if (isFavorite.value) {
    favoriteCount.value++;
    // 실제 백엔드 연동 시 즐겨찾기 추가 API 호출
  } else {
    favoriteCount.value--;
    // 실제 백엔드 연동 시 즐겨찾기 제거 API 호출
  }
};
</script>