import { t } from "@/plugins/i18n";

export default {
  path: "/operationLog",
  name: "operationLog",
  component: () => import("@/views/operationLog/index.vue"),
  meta: {
    title: t("操作日志"),
    icon: "operationLog",
    rank: 7
  }
} as RouteConfigsTable;
