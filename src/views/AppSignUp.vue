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
  
        <form class="mt-4" @submit.prevent="signup">
          <label class="block">
            <span class="text-sm text-gray-700 font-bold">Name</span>
            <input
              type="text"
              class="
                block
                w-full
                mt-1
                border-b
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="Name"
              v-model="name"
            />
          </label>

          <label class="block mt-3">
            <span class="text-sm text-gray-700 font-bold">ID</span>
            <input
              type="text"
              class="
                block
                w-full
                mt-1
                border-b
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="ID"
              v-model="id"
            />
          </label>
  
          <label class="block mt-3">
            <span class="text-sm text-gray-700 font-bold">Password</span>
            <input
              type="password"
              class="
                block
                w-full
                mt-1
                border-b
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="Password"
              v-model="password"
            />
          </label>

          <label class="block mt-3">
            <span class="text-sm text-gray-700 font-bold">Email</span>
            <input
              type="email"
              class="
                block
                w-full
                mt-1
                border-b
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="Email"
              v-model="email"
            />
          </label>
          <label class="block mt-3">
            <span class="text-sm text-gray-700 font-bold">Phone Number</span>
            <input
              type="tel"
              class="
                block
                w-full
                mt-1
                border-b
                border-gray-200
                rounded-md
                focus:border-indigo-600
                focus:ring
                focus:ring-opacity-40
                focus:ring-indigo-500
              "
              placeholder="Phone Number"
              v-model="phoneNumber"
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
              Sign up
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

const name = ref("");
const id = ref("");
const password = ref("");
const email = ref("");
const phoneNumber = ref("");

async function signup() {
  // 간단한 유효성 검사
  if (!name.value || !id.value || !password.value || !email.value || !phoneNumber.value) {
    alert("모든 필드를 입력해주세요.");
    return;
  }

  // 이메일 형식 검사
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  // 비밀번호 길이 검사
  if (password.value.length < 6) {
    alert("비밀번호는 최소 6자 이상이어야 합니다.");
    return;
  }

  router.push("/")

  // try {
  //   // (가정) 서버로 회원가입 요청 보내기
  //   const response = await fetch("/api/signup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: name.value,
  //       id: id.value,
  //       password: password.value,
  //       email: email.value,
  //       phoneNumber: phoneNumber.value,
  //     }),
  //   });

  //   const data = await response.json();

  //   if (response.ok) {
  //     alert("회원가입에 성공했습니다!");
  //     router.push("/");
  //   } else {
  //     alert(`회원가입에 실패했습니다: ${data.message || "알 수 없는 오류"}`);
  //   }
  // } catch (error) {
  //   console.error("회원가입 요청 중 오류 발생:", error);
  //   alert("회원가입 요청 중 오류가 발생했습니다.");
  // }
}
</script>
  