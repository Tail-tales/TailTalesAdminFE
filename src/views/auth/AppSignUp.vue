<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img class="w-7 h-7 mr-2" src="@/assets/logo.png" alt="logo">
        <span class="text-2xl font-semibold text-gray-700">TailTales</span>
      </div>

      <form class="mt-4" @submit.prevent="handleSignup">
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
            :class="{ 'border-red-500': errors.name }"
            placeholder="Name"
            v-model="name"
          />
          <p class="mt-1 text-sm text-red-500" v-if="errors.name">{{ errors.name }}</p>
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700 font-bold">ID</span>
          <div class="flex">
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
              :class="{ 'border-red-500': errors.id && errors.id !== '사용 가능한 아이디입니다.' ,  'border-green-500': errors.id === '사용 가능한 아이디입니다.'}"
              placeholder="ID"
              v-model="id"
            />
            <button
              type="button"
              class="
                w-24
                px-2
                py-2
                text-sm text-center text-white
                bg-indigo-600
                rounded-md
                focus:outline-none
                hover:bg-indigo-500
              "
              @click="checkIdDuplication"
              >
              check ID
            </button>
          </div>
          <p
          class="mt-1 text-sm" 
          :class="{'text-red-500': errors.id !== '사용 가능한 아이디입니다.', 'text-green-500': errors.id === '사용 가능한 아이디입니다.'}"
          v-if="errors.id"
          >{{ errors.id }}
        </p>
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
            :class="{ 'border-red-500': errors.password }"
            placeholder="Password"
            v-model="password"
          />
          <p class="mt-1 text-sm text-red-500" v-if="errors.password">{{ errors.password }}</p>
        </label>

        <label class="block mt-3">
            <span class="text-sm text-gray-700 font-bold">Email</span>
            <div class="flex">
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
              :class="{ 'border-red-500': errors.email && errors.email !== '사용 가능한 이메일입니다.' ,  'border-green-500': errors.email === '사용 가능한 이메일입니다.'}"
              placeholder="Email"
              v-model="email"
            />
            <button
              type="button"
              class="
                w-32
                px-2
                py-2
                text-sm text-center text-white
                bg-indigo-600
                rounded-md
                focus:outline-none
                hover:bg-indigo-500
              "
              @click="checkEmailDuplication"
              >
              check email
            </button>
          </div>
          <p
          class="mt-1 text-sm" 
          :class="{'text-red-500': errors.email !== '사용 가능한 이메일입니다.', 'text-green-500': errors.email === '사용 가능한 이메일입니다.'}"
          v-if="errors.email"
          >{{ errors.email }}
        </p>
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
            :class="{ 'border-red-500': errors.phoneNumber }"
            placeholder="Phone Number"
            v-model="phoneNumber"
          />
          <p class="mt-1 text-sm text-red-500" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</p>
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
          <div class="mt-2">
            <router-link
              class="block text-sm text-indigo-700 fontme hover:underline text-center"
              to="/"
            >Have an account?</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
  <ToastAlert ref="toastAlert"/>
</template>
  
<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import ToastAlert from "@/components/ToastAlert.vue";
  import { signup, idCheck, emailCheck } from "@/services/authService";
import { AxiosError } from "axios";

  const router = useRouter();
  const toastAlert = ref<InstanceType<typeof ToastAlert> | null >(null);

  const name = ref("");
  const id = ref("");
  const password = ref("");
  const email = ref("");
  const phoneNumber = ref("");

  const errors = ref({
    name: "",
    id: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  const idCheckResult = ref(false);
  const emailCheckResult = ref(false);

  type ErrorKeys = keyof typeof errors.value;

  const rules = {
    name: [(v: string) => !!v || "이름을 입력해주세요."],
    id: [
    (v: string) => !!v || "아이디를 입력해주세요.",
    () => !idCheckResult.value || true,
    (v: string) => !v || idCheckResult.value || "중복 확인을 해주세요.",
  ],
    password: [
      (v: string) => !!v || "비밀번호를 입력해주세요.",
      (v: string) => v.length >= 8 || "비밀번호는 최소 8자 이상이어야 합니다.",
      (v: string) => /(?=.*\d)/.test(v) || '숫자를 포함해야합니다',
      (v: string) => /([!@$%])/.test(v) || '특수문자를 포함해야합니다 [!,@,#,$,d%]'
    ],
    email: [
      (v: string) => !!v || "이메일을 입력해주세요.",
      (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "올바른 이메일 형식을 입력해주세요.",
    ],
    phoneNumber: [(v: string) => !!v || "전화번호를 입력해주세요.",
    (v: string) => /^[0-9]+$/.test(v) || "숫자만 입력해주세요.",
    (v: string) => v.replace(/-/g, '').length >= 10 || "전화번호는 최소 10자리 이상이어야 합니다.",]
  };

  type RuleKeys = keyof typeof rules;
  const refs = {
    name,
    id,
    password,
    email,
    phoneNumber,
  };

  // 유효성 검사 함수
  const validateField = (key: RuleKeys, value: string) => {
    const currentRules = rules[key];
    for (const rule of currentRules) {
      const errorMessage = rule(value);
      if (errorMessage !== true) {
        errors.value[key as ErrorKeys] = errorMessage;
        return;
      }
    }
    errors.value[key as ErrorKeys] = ""; // 유효성 검사 통과 시 에러 메시지 초기화
  };

  const checkIdDuplication = async () => {
    if (!id.value) {
      errors.value.id = "아이디를 입력해주세요.";
      idCheckResult.value = false;
      return;
    }

    try{
      const responseData = await idCheck(id.value)

      if ( responseData ) {
        errors.value.id = "이미 사용 중인 아이디입니다.";
        idCheckResult.value = false; 
      } else{
        errors.value.id = "사용 가능한 아이디입니다.";
        idCheckResult.value = true; 
      }
    }catch(error: AxiosError){
      toastAlert.value?.show(error.response.data.message, 'error');
    }
  };

  const checkEmailDuplication = async () => {
    if (!email.value) {
      errors.value.email = "아이디를 입력해주세요.";
      emailCheckResult.value = false;
      return;
    }
    
    try{
      const responseData = await emailCheck(email.value)

      if ( responseData ) {
        errors.value.email = "이미 사용 중인 이메일입니다.";
        emailCheckResult.value = false; 
      } else{
        errors.value.email = "사용 가능한 이메일입니다.";
        emailCheckResult.value = true; 
      }
    }catch(error: AxiosError){
      toastAlert.value?.show(error.response.data.message, 'error');
    }
  };

  // 각 필드의 값이 변경될 때 유효성 검사 실행
  watch(name, (newValue) => validateField('name', newValue));
  watch(id, (newValue) => {
  idCheckResult.value = false;
  validateField('id', newValue);
});
  watch(password, (newValue) => validateField('password', newValue));
  watch(email, (newValue) => validateField('email', newValue));
  watch(phoneNumber, (newValue) => validateField('phoneNumber', newValue));

  async function handleSignup() {
    // 폼 제출 시 최종 유효성 검사
    for (const key in rules) {
      validateField(key as RuleKeys, refs[key as RuleKeys].value);
    }

    const hasErrors = Object.values(errors.value).some(error => error);

    if (!hasErrors && idCheckResult.value) {
      try {
        const responseData = await signup({
          name : name.value,
          id : id.value,
          password: password.value,
          contact: phoneNumber.value,
          email : email.value
        })

        toastAlert.value?.show(responseData, 'success');
        setTimeout(()=>{
          router.push("/")
        }, 3000)
        
      } catch (error: AxiosError) {
        toastAlert.value?.show(error.response.data.message, 'error');
      }
  } else if (!idCheckResult.value && id.value && errors.value.id !== "아이디를 입력해주세요.") {
    errors.value.id = "중복 확인을 해주세요.";
  }
  }
</script>
  