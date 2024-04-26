import { t } from "@/plugins/i18n";

export const columns: TableColumnList = [
  {
    label: t("序号"),
    prop: 'index',
    align:'left',

  },
  {
    label: t("用户信息"),
    slot: 'userMessage',
    minWidth: 100,
    align:'left',
  },
  {
    label: t("赛事信息"),
    slot: 'matchMessage',
    minWidth: 100,
    align:'left',
  },
  {
    label: t("注单详情"),
    slot: 'betDetail',
    minWidth: 100,
    align:'left',
  },
  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 100,
    align:'center',
  },
  {
    label: t("审核状态"),
    slot: "riskStatus",
    minWidth: 180,
  },

  {
    label: t("投注额"),
    prop: "productAmountTotal",
    minWidth: 50,
    align:'center',
    formatter: ({ productAmountTotal }) => (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },
  {
    label: t("用户输赢"),
    slot: "profitAmount",
    minWidth: 50,
    align:'center',
  },
  {
    label: t('通过'),
    slot: 'approve',
    align:'center',
    fixed:'right'
  },
  {
    label: t('划单'),
    slot: 'cancel',
    align:'center',
    fixed:'right'
  },
  {
    label: t('备注'),
    slot: 'operation',
    align:'center',
    fixed:'right',
    minWidth: 50,
  }
]
