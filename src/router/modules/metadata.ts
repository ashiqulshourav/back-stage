import { t } from "@/plugins/i18n";

export default {
  path: "/metadata",
  meta: {
    title: t('赛程管理'),
    icon: 'crown',
    rank: 1
  },
  children: [
    {
      path: "/metadata/league",
      name: "League",
      component: () => import("@/views/metadata/league/index.vue"),
      meta: {
        title: t('联赛管理'),
        showParent: true,
      }
    },
    {
      path: "/metadata/team",
      name: "team",
      component: () => import("@/views/metadata/team/index.vue"),
      meta: {
        title: t('球队管理'),
        showParent: true,
      }
    },
    /* {
      path: "/metadata/player",
      name: "player",
      component: () => import("@/views/metadata/player/index.vue"),
      meta: {
        title: t('球员管理'),
        showParent: true,
      }
    } */
  ]
} as RouteConfigsTable;
