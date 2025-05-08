<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Profile" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize">
          Account settings
        </h2>

          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label class="text-gray-700 font-bold" for="id"
                >ID</label
              >
              <input
                class="w-full mt-2 border-gray-200 rounded-md border-b border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="text"
                v-model="admin.id"
                disabled
              />
            </div>

            <div>
              <label class="text-gray-700 font-bold" for="name">Name</label>
              <input
                class="w-full mt-2 border-gray-200 rounded-md border-b border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="text"
                v-model="admin.name"
              />
            </div>

            <div>
              <label class="text-gray-700 font-bold" for="emailAddress"
                >Email Address</label
              >
              <div class="flex">
                <input
                  class="w-full mt-2 border-gray-200 rounded-md border-b border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="email"
                  v-model="admin.email"
                />
                <button
                class="w-fit px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 whitespace-nowrap focus:outline-none focus:bg-gray-700"
                @click="checkEmailDuplication"
                >
                  check Email
                </button>
              </div>
              <p
                class="mt-1 text-sm" 
                :class="{'text-red-500': errors.email !== '사용 가능한 이메일입니다.', 'text-green-500': errors.email === '사용 가능한 이메일입니다.'}"
                v-if="errors.email"
                >{{ errors.email }}
              </p>
            </div>

            <div>
              <label class="text-gray-700 font-bold" for="password">New Password</label>
              <input
                class="w-full mt-2 border-gray-200 rounded-md border-b border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="password"
                v-model="admin.password"
              />
            </div>

            <div>
              <label class="text-gray-700 font-bold" for="contact"
                >Contact</label
              >
              <input
                class="w-full mt-2 border-gray-200 rounded-md border-b border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="text"
                v-model="admin.contact"
              />
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="UpdateAdminProfile"
              class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              Save
            </button>
          </div>
      </div>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Breadcrumb from '../partials/AppBreadcrumb.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import ToastAlert from "@/components/ToastAlert.vue";

interface Admin {
  id: string
  name: string
  email: string
  password?: string
  contact: string
}

const admin = ref<Admin>({
  id: '',
  name: '',
  email: '',
  password: '',
  contact: '',
})

const errors = ref({
    email: "",
  });
const emailCheckResult = ref(true);
const initialEmail = ref('');
const authStore = useAuthStore();
const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);
const API_URL = 'http://localhost:8080/api/admins';

const fetchAdminProfile = async () => {
  if (authStore.isloggedIn) {
    try {
      const adminId = authStore.currentAdminId
      const response = await axios.get(`${API_URL}/${adminId}`);
      admin.value = {
        id: response.data.adminId,
        name: response.data.name,
        email: response.data.email,
        contact: response.data.contact,
      };
      initialEmail.value = response.data.email;
    } catch (error) {
      toastAlert.value?.show('관리자 정보를 가져올 수 없습니다.', 'error');
    }
  } else {
    console.log(authStore.accessToken, authStore.isloggedIn)
    toastAlert.value?.show('서버와 통신 중 오류가 발생했습니다.', 'error');
  }
};

onMounted(() => {
  fetchAdminProfile();
});

watch(() => admin.value.email, () => {
  errors.value.email = "";
  emailCheckResult.value = false;
})

const checkEmailDuplication = async () => {
    if(admin.value.email !== initialEmail.value) {
      try{
      const adminEmail = admin.value.email;
      const response = await axios.get(`${API_URL}/exists/email/${adminEmail}`)

      if ( response.data ) {
        errors.value.email = "이미 사용 중인 이메일입니다.";
        emailCheckResult.value = false; 
      } else{
        errors.value.email = "사용 가능한 이메일입니다.";
        emailCheckResult.value = true;
      }
    }catch(error){
      toastAlert.value?.show('이메일 중복검사 중 오류가 발생했습니다.', 'error');
    }
  }else{
    errors.value.email = "사용 가능한 이메일입니다.";
    emailCheckResult.value = true;
  }
  };

const UpdateAdminProfile = async () => {
  const {id, ...data} = JSON.parse(JSON.stringify(admin.value))
  if( emailCheckResult.value ){
    try{
      const response = await axios.put(`${API_URL}/me`, data)
      if(response.status === 200){
        toastAlert.value?.show(response.data,'success');
        initialEmail.value = admin.value.email;
      }
    }catch(error){
      toastAlert.value?.show('서버와 통신 중 오류가 발생했습니다.', 'error');
    }
  }else{
    toastAlert.value?.show('이메일 중복확인을 해주세요.', 'warning');
  }
  console.log('Registered: ', data)
}
</script>
