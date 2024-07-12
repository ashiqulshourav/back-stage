import { t } from "@/plugins/i18n";
import {addThousandSeparator} from '@/utils/formatNumber'

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
    minWidth: 200,
    align:'left',
    className: 'getParent',
  },
  {
    label: t("注单详情"),
    slot: 'betDetail',
    minWidth: 100,
    align:'left',
    className: 'getParent',
  },

  {
    label: t("状态"),
    slot: "status",
    minWidth: 50,
    align:'center',
  },
  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 50,
    align:'center',
    className: 'getParent',
  },
  {
    label: t("投注额"),
    prop: "productAmountTotal",
    minWidth: 50,
    align:'center',
    formatter: ({ productAmountTotal }) => addThousandSeparator(productAmountTotal.toFixed(2))  // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },
  {
    label: t("用户输赢"),
    slot: "profitAmount",
    minWidth: 50,
    align:'center',
    formatter: ({ profitAmount }) => addThousandSeparator(profitAmount.toFixed(2))
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 50,
    align:'center',
  },
  {
    label: t('备注'),
    slot: 'operationRemark',
    align:'center',
    minWidth: 50,
  }
]
