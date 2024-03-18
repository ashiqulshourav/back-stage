import { t } from "@/plugins/i18n";
import { handleTableWidth } from "@/utils/getTableWidth";

export const columns: TableColumnList = [
  {
    label: t("序号"),
    slot: 'index',
    fixed:true,
  },
  {
    label: t("用户信息"),
    slot: 'userMessage',
    minWidth: 80,
  },
  {
    label: t("赛事信息"),
    slot: 'matchMessage',
    minWidth: 80,
  },
  {
    label: t("注单详情"),
    slot: 'betDetail',
    minWidth: 80,
  },
  {
    label: t("注单号"),
    prop: 'id',
    minWidth: 80,
  },
  {
    label: t('过关类型'),
    prop: 'seriesType',
    minWidth: 50,
    formatter: ({ seriesType }) =>{
      return  seriesType===1?'单关':'串关'
    },
  },
  {
    label: t("投注金额"),
    prop: "productAmountTotal",
    minWidth: 50,
    formatter: ({ productAmountTotal }) => (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },

  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 50,
    headerRenderer: d => handleTableWidth(d, t('操作'), 'auto'),
  }
]
