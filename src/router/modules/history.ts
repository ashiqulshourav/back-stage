import { $t } from "@/plugins/i18n";

export default {
  path: "/history",
  name: "history",
  component: () => import("@/views/history/index.vue"),
  meta: {
    title: $t("menus.history"),
    icon: "history",
    rank: 5
  }
} as RouteConfigsTable;
