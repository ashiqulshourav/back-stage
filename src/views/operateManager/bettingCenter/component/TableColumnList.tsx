import { t } from "@/plugins/i18n";
import { handleTableWidth } from "@/utils/getTableWidth";
import dayjs from "dayjs";

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
    label: t("状态"),
    slot: "billStatus",
    minWidth: 50,
    align:'left',
  },
  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 50,
    align:'left',
  },
  {
    label: t("投注额"),
    prop: "productAmountTotal",
    minWidth: 50,
    formatter: ({ productAmountTotal }) => (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },
  {
    label: t("用户输赢"),
    slot: "profitAmount",
    minWidth: 50,
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 50,
    align:'left',
    headerRenderer: d => handleTableWidth(d, t('操作'), 'auto'),
  }
]
