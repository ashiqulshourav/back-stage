import { t } from "@/plugins/i18n";
import { addThousandSeparator } from '@/utils/formatNumber'
import {settleTypeMap} from '../util/map'
import dayjs from "dayjs";
import {BET_RESULT_TYPE_MAP} from "@/utils/formatMatch";

export const columns: TableColumnList = [
  {
    label: t("序号"),
    prop: 'index',
    align: 'left',
  },
  {
    label: t("用户信息"),
    slot: 'userMessage',
    minWidth: 200,
    align: 'left',
  },
  {
    label: t("注单信息"),
    slot: 'betMessage',
    minWidth: 100,
    align: 'left',
    className: 'getParent mw-250px',
  },
  {
    label: t("赛事信息"),
    slot: 'matchMessage',
    minWidth: 200,
    align: 'left',
    className: 'getParent',
  },

  {
    label: t("投注项"),
    slot: 'betItem',
    minWidth: 200,
    align: 'left',
    className: 'betItem getParent',
  },

  {
    label: t("状态"),
    slot: "orderStatusView",
    minWidth: 100,
    align: 'center',
    formatter: ({ betResult }) => BET_RESULT_TYPE_MAP[betResult as keyof typeof BET_RESULT_TYPE_MAP] || '' // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)

  },
  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 50,
    align: 'center',
    className: 'getParent',
  },
  {
    label: t("投注额"),
    prop: "productAmountTotal",
    minWidth: 50,
    align: 'center',
    formatter: ({ productAmountTotal }) => addThousandSeparator(productAmountTotal.toFixed(2))  // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },
  {
    label: t("用户输赢"),
    slot: "profitAmount",
    minWidth: 50,
    align: 'center',
    formatter: ({ profitAmount }) => addThousandSeparator(profitAmount.toFixed(2))
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 50,
    align: 'center',
  },
  {
    label: t('备注'),
    slot: 'operationRemark',
    align: 'center',
    minWidth: 50,
    fixed: 'right'
  }
]




export const settleHistoryColumns: TableColumnList = [
  {
    label: t("赛事信息"),
    slot: 'matchMessage',
    minWidth: 100,
    align: 'left',
    className: 'getParent',
  },
  {
    label: t("投注项"),
    slot: 'betItem',
    minWidth: 70,
    align: 'left',
    className: 'betItem getParent',
  },

  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 60,
    align: 'center',
  },
  {
    label: t("注单状态"),
    prop: "orderStatusView",
    minWidth: 50,
    align: 'center',
    className: 'getParent',
  },
  {
    label: t("结算时问"),
    prop: "settleTime",
    minWidth: 70,
    align: 'center',
    formatter: ({ settleTime }) => dayjs(settleTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t("用户输赢"),
    prop: "profitAmount",
    minWidth: 50,
    align: 'center',
    formatter: ({ profitAmount }) => profitAmount?addThousandSeparator(profitAmount.toFixed(2)):'-'
  },
  {
    label: t('帐变'),
    prop: 'accountChangeAmount',
    minWidth: 50,
    align: 'center',
    formatter: ({ accountChangeAmount }) => accountChangeAmount?addThousandSeparator(accountChangeAmount.toFixed(2)):'-'
  },
  {
    label: t('结算类型'),
    prop: 'settleType',
    align: 'center',
    minWidth: 50,
    formatter: ({ settleType }) => settleTypeMap.find((item:any) => item.value === settleType).label
  },
  {
    label: t('操作人'),
    prop: 'settlementOperator',
    align: 'center',
    minWidth: 50,
  }
]
