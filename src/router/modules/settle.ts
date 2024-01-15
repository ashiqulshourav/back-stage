
import { t } from "@/plugins/i18n";

export default {
  path: "/settle",
  meta: {
    title: t('结算平台'),
    icon: 'folderFill',
    rank: 5,
    redirect: '/settle/settle_admin'
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
    {
      path: "/settle/settle_history",
      name: "settle_history",
      component: () => import("@/views/settle/settle_history/index.vue"),
      meta: {
        title: t('结算历史'),
        showParent: true,
      }
    },
  ]
} as RouteConfigsTable;
