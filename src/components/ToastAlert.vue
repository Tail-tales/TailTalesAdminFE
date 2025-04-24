<template>
    <div
      v-if="isVisible"
      class="fixed bottom-6 right-6 transition-opacity duration-300"
      :class="[
        { 'opacity-100': isVisible, 'opacity-0': !isVisible }]"
    >
      <div class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-center w-12" :class="getBackgroundColorClass(type)">
          <svg
            class="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="getIconPath(type)" />
          </svg>
        </div>
    
        <div class="px-4 py-2 -mx-3">
          <div class="mx-3">
            <span class="font-semibold" :class="getTextColorClass(type)">{{ getTitle(type) }}</span>
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const isVisible = ref(false);
  const message = ref('');
  const type = ref<'success' | 'error' | 'info' | 'warning'>('info');
  const duration = 3000;
  let timeoutId: number | null = null;
  
  const emit = defineEmits(['close']);
  
  function showToast(newMessage: string, newType: 'success' | 'error' | 'info' | 'warning' = 'info') {
    message.value = newMessage;
    type.value = newType;
    isVisible.value = true;
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    timeoutId = setTimeout(() => {
      isVisible.value = false;
      message.value = '';
      emit('close'); // 필요하다면 닫힘 이벤트 발생
    }, duration);
  }
  
  defineExpose({
    show: showToast,
  });
  
  // Helper functions to determine styles and icons based on type
  const getBackgroundColorClass = computed(() => (toastType: 'success' | 'error' | 'info' | 'warning') => {
    switch (toastType) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  });
  
  const getTextColorClass = computed(() => (toastType: 'success' | 'error' | 'info' | 'warning') => {
    switch (toastType) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-gray-700';
    }
  });
  
  const getTitle = computed(() => (toastType: 'success' | 'error' | 'info' | 'warning') => {
    switch (toastType) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
        return 'Info';
      case 'warning':
        return 'Warning';
      default:
        return 'Notification';
    }
  });
  
  const getIconPath = computed(() => (toastType: 'success' | 'error' | 'info' | 'warning') => {
    switch (toastType) {
      case 'success':
        return 'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z';
      case 'error':
        return 'M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z';
      case 'info':
        return 'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z';
      case 'warning':
        return 'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z';
      default:
        return '';
    }
  });
  </script>
  
  <style scoped>
  /* 필요하다면 컴포넌트 스코프 스타일 추가 */
  </style>