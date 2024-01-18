import { t } from "@/plugins/i18n";
import { VIRTUAL } from "../const_rank";

export default {
  path: "/virtual",
  meta: {
    title: t('虚拟体育'),
    icon: 'files',
    rank: VIRTUAL
  },
  children: [
    {
      path: "/virtual/match",
      name: "vMatch",
      component: () => import("@/views/virtual/match/index.vue"),
      meta: {
        title: t('联赛库'),
        showParent: true,
      }
    },
    {
      path: "/virtual/teams",
      name: "vTeams",
      component: () => import("@/views/virtual/teams/index.vue"),
      meta: {
        title: t('球队库'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
