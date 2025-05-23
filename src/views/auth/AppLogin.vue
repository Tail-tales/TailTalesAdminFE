<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img class="w-7 h-7 mr-2" src="@/assets/logo.png" alt="logo">
        <span class="text-2xl font-semibold text-gray-700">TailTales</span>
      </div>

      <form class="mt-4" @submit.prevent="handleLogin">
        <label class="block">
          <input
            type="text"
            class="
              block
              w-full
              mt-1
              border-gray-200
              rounded-md
              focus:border-indigo-600
              focus:ring
              focus:ring-opacity-40
              focus:ring-indigo-500
            "
            v-model="id"
            placeholder="ID"
          />
        </label>

        <label class="block mt-3">
          <input
            type="password"
            class="
              block
              w-full
              mt-1
              border-gray-200
              rounded-md
              focus:border-indigo-600
              focus:ring
              focus:ring-opacity-40
              focus:ring-indigo-500
            "
            v-model="password"
            placeholder="Password"
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
            "
          >
            Sign in
          </button>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div>
              <router-link
                class="block text-sm text-indigo-700 fontme hover:underline text-center"
                to="/signup"
                >Don't have an account?</router-link
              >
          </div>
          <p class="text-indigo-700">/</p>
          <div>
              <router-link
                class="block text-sm text-indigo-700 fontme hover:underline text-center"
                to="/recover-password"
                >Forgot your password?</router-link
              >
            </div>
        </div>
      </form>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import ToastAlert from "@/components/ToastAlert.vue";
import { login } from "@/services/authService";
import { AxiosError } from "axios";

const router = useRouter();
const id = ref("");
const password = ref("");
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);

async function handleLogin() {
  try {
    const responseData = await login({
      id: id.value,
      password: password.value
    });

    const accessToken = responseData.accessToken;
    const adminId = responseData.id;
    useAuthStore().loginSuccess(accessToken, adminId);
    router.push("/dashboard");
      
  } catch (error: AxiosError) {
    toastAlert.value?.show(error.response.data.message, 'error');
  }
}

</script>
