import { t } from "@/plugins/i18n";
import { HOME } from "../const_rank";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/metadata/league",
  meta: {
    icon: "homeFilled",
    title: "主页",
    rank: HOME,
  },
  children: [
    {
      path: "/welcome",
      name: "WELCOME",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: t("Home"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
