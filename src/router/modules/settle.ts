
import { t } from "@/plugins/i18n";

export default {
  path: "/settle",
  meta: {
    title: t('结算后台'),
    icon: 'folderFill',
    rank: 5
  },
  children: [
    {
      path: "/settle/settle_admin",
      name: "settle_admin",
      component: () => import("@/views/settle/settle_admin/index.vue"),
      meta: {
        title: t('结算管理'),
        showParent: true,
      }
    },
  ]
} as RouteConfigsTable;
