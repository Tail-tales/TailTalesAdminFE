import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Dashboard from "../views/AppDashboard.vue";
import Forms from "../views/AppForms.vue";
import Tables from "../views/AppTables.vue";
import UIElements from "../views/UIElements.vue";
import Login from "../views/auth/AppLogin.vue";
import Modal from "../views/AppModal.vue";
import Chart from "../views/ChartView.vue";
import Card from "../views/CardView.vue";
import Blank from "../views/BlankView.vue";
import NotFound from "../views/NotFound.vue";
import SignUp from "../views/auth/AppSignUp.vue";
import RecoverPw from "../views/auth/AppRecoverPassword.vue";
import User from "../views/AppUser.vue";
import UserActivity from "../views/AppUserActivity.vue";
import Board from "../views/boards/AppBoard.vue";
import Category from "../views/boards/AppCategory.vue";
import BoardWrite from "../views/boards/AppBoardWrite.vue";
import BoardDetail from "../views/boards/AppBoardDetail.vue";
import Places from "../views/places/AppPlace.vue";
import PlaceWrite from "../views/places/AppPlaceWrite.vue";
import Profile from "../views/AppProfile.vue";
import Review from "../views/AppReview.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: { layout: "empty" },
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: RecoverPw,
    meta: { layout: "empty" },
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/user/:id",
    name: "UserActivity",
    component: UserActivity,
    props: true,
  },
  {
    path: "/boards",
    name: "Board",
    component: Board,
  },
  {
    path: "/boards/:id",
    name: "BoardDetail",
    component: BoardDetail,
    props: true,
  },
  {
    path: "/boards/write",
    name: "BoardWrite",
    component: BoardWrite,
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
  },
  {
    path: "/places",
    name: "Places",
    component: Places,
  },
  {
    path: "/places/write",
    name: "PlaceWrite",
    component: PlaceWrite,
  },
  {
    path: "/reviews",
    name: "Review",
    component: Review,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/forms",
    name: "Forms",
    component: Forms,
  },
  {
    path: "/cards",
    name: "Cards",
    component: Card,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/ui-elements",
    name: "UIElements",
    component: UIElements,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/charts",
    name: "Chart",
    component: Chart,
  },
  {
    path: "/blank",
    name: "Blank",
    component: Blank,
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
