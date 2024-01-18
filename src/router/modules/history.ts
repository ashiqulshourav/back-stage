import { t } from "@/plugins/i18n";
import { HISTORY } from "../const_rank";

export default {
  path: "/history",
  name: "history",
  component: () => import("@/views/history/index.vue"),
  meta: {
    title: t("赛程历史"),
    icon: "history",
    rank: HISTORY
  }
} as RouteConfigsTable;
