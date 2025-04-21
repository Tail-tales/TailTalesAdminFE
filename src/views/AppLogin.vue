<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img class="w-7 h-7 mr-2" src="@/assets/logo.png" alt="logo">
        <span class="text-2xl font-semibold text-gray-700">TailTales</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
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

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                class="
                  text-indigo-600
                  border-gray-200
                  rounded-md
                  focus:border-indigo-600
                  focus:ring
                  focus:ring-opacity-40
                  focus:ring-indigo-500
                "
              />
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <router-link
              class="block text-sm text-indigo-700 fontme hover:underline"
              to="/recover-password"
              >Forgot your password?</router-link
            >
          </div>
        </div>

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
        <div class="mt-2">
            <router-link
              class="block text-sm text-indigo-700 fontme hover:underline text-center"
              to="/signup"
              >Don't have an account?</router-link
            >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const id = ref("");
const password = ref("");
const API_URL = "http://localhost:8080/auth/login"
const errorMsg = ref("");

async function login() {
  errorMsg.value = "";
  try {
    const response = await axios.post(API_URL, {
      adminId : id.value,
      password : password.value
    })

    if (response.status === 200){
      const accessToken = response.data.accessToken;
      if (accessToken) {
        useAuthStore().loginSuccess(accessToken);
        router.push("/dashboard");
      } else{
        errorMsg.value = "Access Token이 존재하지 않습니다.";
      }
    } else if (response.status == 403){
      errorMsg.value = "아이디 또는 비밀번호가 일치하지 않습니다.";
    }
  } catch (error) {
    errorMsg.value = "로그인 요청 중 오류가 발생했습니다."
  }
}
</script>
