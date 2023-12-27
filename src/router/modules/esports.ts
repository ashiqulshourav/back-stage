import { $t } from "@/plugins/i18n";

export default {
  path: "/esports",
  meta: {
    title: $t('menus.esports'),
    icon: 'monitor',
    rank: 4
  },
  children: [
    {
      path: "/esports/match",
      name: "eMatch",
      component: () => import("@/views/esports/match/index.vue"),
      meta: {
        title: $t('menus.matchData'),
        showParent: true,
      }
    },
    {
      path: "/esports/teams",
      name: "eTeams",
      component: () => import("@/views/esports/teams/index.vue"),
      meta: {
        title: $t('menus.teamData'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
