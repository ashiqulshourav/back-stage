import { $t } from "@/plugins/i18n";

export default {
  path: "/metadata",
  meta: {
    title: $t('menus.metadata'),
    icon: 'crown',
    rank: 1
  },
  children: [
    {
      path: "/metadata/league",
      name: "League",
      component: () => import("@/views/metadata/league/index.vue"),
      meta: {
        title: $t('menus.league'),
        showParent: true,
      }
    },
    {
      path: "/metadata/team",
      name: "team",
      component: () => import("@/views/metadata/team/index.vue"),
      meta: {
        title: $t('menus.team'),
        showParent: true,
      }
    },
    {
      path: "/metadata/player",
      name: "player",
      component: () => import("@/views/metadata/player/index.vue"),
      meta: {
        title: $t('menus.player'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
