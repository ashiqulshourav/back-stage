import { t } from "@/plugins/i18n";

export default {
  path: "/history",
  name: "history",
  component: () => import("@/views/history/index.vue"),
  meta: {
    title: t("赛程历史"),
    icon: "history",
    rank: 5
  }
} as RouteConfigsTable;
