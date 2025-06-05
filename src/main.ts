import { createApp } from "vue";
import VueApexCharts from "vue3-apexcharts";
import DashboardLayout from "./components/DashboardLayout.vue";
import EmptyLayout from "./components/EmptyLayout.vue";
import "./assets/tailwind.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { QuillEditor } from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useAuthStore } from "./stores/auth";
import setupAxiosInterceptors from "./axiosInterceptor";
import { Quill } from "@vueup/vue-quill";
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";

Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const pinia = createPinia();
const app = createApp(App);

app.component("default-layout", DashboardLayout);
app.component("empty-layout", EmptyLayout);
app.component("QuilEditor", QuillEditor);

app.use(router).use(pinia).use(VueApexCharts);

setupAxiosInterceptors(router);

app.mount("#app");

const authStore = useAuthStore();
const storedToken = sessionStorage.getItem('accessToken')
const storedId = sessionStorage.getItem('id')

if (storedToken && storedId) {
    authStore.setAccessToken(storedToken);
    authStore.setAdminId(storedId);
}