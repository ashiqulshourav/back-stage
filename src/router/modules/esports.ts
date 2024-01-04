import { t } from "@/plugins/i18n";

export default {
  path: "/esports",
  meta: {
    title: t('电子竞技'),
    icon: 'monitor',
    rank: 4
  },
  children: [
    {
      path: "/esports/match",
      name: "eMatch",
      component: () => import("@/views/esports/match/index.vue"),
      meta: {
        title: t('联赛库'),
        showParent: true,
      }
    },
    {
      path: "/esports/team",
      name: "eTeam",
      component: () => import("@/views/esports/team/index.vue"),
      meta: {
        title: t('球队库'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
