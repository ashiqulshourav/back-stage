import { $t } from "@/plugins/i18n";

export default {
  path: "/sale",
  meta: {
    title: $t('menus.sale'),
    icon: 'storeFill',
    rank: 2
  },
  children: [
    {
      path: "/sale/pre_sale",
      name: "pre_sale",
      component: () => import("@/views/sale/pre_sale/index.vue"),
      meta: {
        title: $t('menus.preSale'),
        showParent: true,
      }
    },
    {
      path: "/sale/early",
      name: "early",
      component: () => import("@/views/sale/early/index.vue"),
      meta: {
        title: $t('menus.early'),
        showParent: true,
      }
    },
    {
      path: "/sale/live",
      name: "live",
      component: () => import("@/views/sale/live/index.vue"),
      meta: {
        title: $t('menus.saleLive'),
        showParent: true,
      }
    }
  ]
} as RouteConfigsTable;
