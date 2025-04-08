<template>
    <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
      <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-center">
          <svg
            class="w-8 h-8 ml-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            ></path>
          </svg>
          <span class="text-2xl font-semibold text-gray-700">TailTales</span>
        </div>
  
        <form class="mt-4" @submit.prevent="findpw">
          <label class="block">
            <span class="text-xl font-semibold text-gray-700">Forgot your password?</span>
            <p class="text-base mt-4 leading-5">
              If you've forgotten your password, don't worry. Simply enter your email address below, and we'll send you an email
              with a temporary password. Restoring access to your account has never been easier.
            </p>
            <input
              type="email"
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
              placeholder="Enter your Email"
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
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isLoading = ref(false);
  
  async function findpw() {
    isLoading.value = true;

    await new Promise ((resolve)=> setTimeout(resolve, 3000)); // 임시 딜레이
    isLoading.value = false;
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
  