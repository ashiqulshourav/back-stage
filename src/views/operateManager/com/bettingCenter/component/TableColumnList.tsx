import { t } from "@/plugins/i18n";
import {addThousandSeparator} from '@/utils/formatNumber';
import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: t("序号"),
    prop: 'index',
    align:'left',
    minWidth: 50,
  },
  {
    label: t("用户信息"),
    slot: 'userMessage',
    minWidth: 200,
    align:'left',
  },
  {
    label: t("赛事信息"),
    slot: 'matchMessage',
    minWidth: 200,
    align:'left',
  },
  {
    label: t("注单详情"),
    slot: 'betDetail',
    minWidth: 200,
    align:'left',
  },
  {
    label: t("风控状态"),
    slot: "riskStatus",
    minWidth: 100,
    align:'center',
    headerRenderer: d => handleTableWidth(d, t('风控状态'), 'auto')
  },
  {
    label: t("赔率"),
    slot: "odd",
    minWidth: 100,
    align:'center',
  },
  {
    label: t("结算状态"),
    slot: "settleStatus",
    minWidth: 100,
    align:'center',
    headerRenderer: d => handleTableWidth(d, t('结算状态'), 'auto')
  },
  {
    label: t("投注额"),
    prop: "productAmountTotal",
    minWidth: 100,
    align:'center',
    formatter: ({ productAmountTotal }) => addThousandSeparator(productAmountTotal.toFixed(2))  // (productAmountTotal ? productAmountTotal.toFixed(2) : 0)
  },
  {
    label: t("用户输赢"),
    slot: "profitAmount",
    minWidth: 100,
    align:'center',
    formatter: ({ profitAmount }) => addThousandSeparator(profitAmount.toFixed(2))
  },
  {
    label: t('操作'),
    slot: 'operation',
    minWidth: 120,
    align:'center',
  },
  {
    label: t('备注'),
    slot: 'operationRemark',
    align:'center',
    minWidth: 100,
  }
]
