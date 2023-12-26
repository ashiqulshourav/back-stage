import { $t } from "@/plugins/i18n";

export default {
  path: "/virtual",
  meta: {
    title: $t('menus.virtual'),
    icon: 'files',
    rank: 3
  },
  children: [
    {
      path: "/virtual/match",
      name: "vMatch",
      component: () => import("@/views/virtual/match/index.vue"),
      meta: {
        title: $t('menus.matchData'),
        showParent: true,
      }
    },
    {
      path: "/virtual/teams",
      name: "vTeams",
      component: () => import("@/views/virtual/teams/index.vue"),
      meta: {
        title: $t('menus.teamData'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
