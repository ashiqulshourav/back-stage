
import { $t } from "@/plugins/i18n";

export default {
  path: "/settle",
  meta: {
    title: $t('settle.settlementBackend'),
    icon: 'folderFill',
    rank: 5
  },
  children: [
    {
      path: "/settle/settle_admin",
      name: "settle_admin",
      component: () => import("@/views/settle/settle_admin/index.vue"),
      meta: {
        title: $t('settle.settlementManagement'),
        showParent: true,
      }
    },
  ]
} as RouteConfigsTable;
