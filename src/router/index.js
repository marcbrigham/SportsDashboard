import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NflScheduleDetail from "../views/NflScheduleDetail.vue"; // Adjust the path to your team detail component
import NhlScheduleDetail from "../views/NhlScheduleDetail.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/nfl/:teamId",
    name: "NflScheduleDetail",
    component: NflScheduleDetail,
  },
  {
    path: "/nhl/:teamId",
    name: "NhlScheduleDetail",
    component: NhlScheduleDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
