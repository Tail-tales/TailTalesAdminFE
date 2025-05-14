<template>
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
      <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-center">
          <img class="w-7 h-7 mr-2" src="@/assets/logo.png" alt="logo">
          <span class="text-2xl font-semibold text-gray-700">TailTales</span>
        </div>
  
        <form class="mt-4" @submit.prevent="findpw">
          <label class="block">
            <span class="text-xl font-semibold text-gray-700">Forgot your password?</span>
            <p class="text-base mt-4 leading-5">
              If you've forgotten your password, don't worry. Simply enter your id below, and we'll send you an email
              with a temporary password. Restoring access to your account has never been easier.
            </p>
            <input
              type="text"
              class="
                block
                w-full
                mt-4
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="Enter your ID"
              v-model="id"
            />
          </label>
  
          <div class="mt-6">
            <button
              type="submit"
              class="
                w-full
                px-4
                py-2
                text-sm text-center text-white
                bg-indigo-600
                rounded-md
                focus:outline-none
                hover:bg-indigo-500
                relative
                min-h-[36px]
              "
              :disabled="isLoading"
            >
            <span v-if="!isLoading">Send password</span>
              <div v-else class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c-4.42 0-8 3.58-8 8z"></path>
              </svg>
              </div>
            </button>
          </div>

          <div class="mt-2">
          <button
            type="button"
            class="
              w-full
              px-4
              py-2
              text-sm text-center text-indigo-600
              border border-indigo-600
              rounded-md
              focus:outline-none
              hover:bg-indigo-400 hover:text-white
            "
            @click="goBack"
          >
            Go back
          </button>
        </div>
        </form>
      </div>
    </div>
    <ToastAlert ref="toastAlert"/>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import ToastAlert from "@/components/ToastAlert.vue";
  import axios, { AxiosError } from "axios";
  import { FIND_PW_URL } from "@/constants/api";
  
  const router = useRouter();
  const isLoading = ref(false);
  const id = ref("");
  const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null)
  
  async function findpw() {
    isLoading.value = true;

    try {
      const response = await axios.post(FIND_PW_URL, null, {
      params: {
        id: id.value
      }});
      if( response.status === 200 ){
        toastAlert.value?.show(response.data, 'success');
        isLoading.value = false;
      }
    } catch (error: AxiosError) {
      if (error.response && error.response.status === 404) {
        toastAlert.value?.show("해당 아이디를 찾을 수 없습니다.", 'error');
      } else {
        toastAlert.value?.show('임시 비밀번호 전송 중 오류가 발생했습니다.', 'error');
      }
      isLoading.value = false;
    }
  }

  function goBack() {
    router.push("/");
  }
  </script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
  