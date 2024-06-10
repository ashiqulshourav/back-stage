import dayjs from "dayjs"
import {addThousandSeparator} from "@/utils/formatNumber";

export const accountChangeTypeCodeList = [
  { label: t("系统自动结算"), value: 30 },
  { label: t("结算返还（加钱）"), value: 31 },
  { label: t("手动结算（加钱）"), value: 91 },
  { label: t("手动结算（扣钱）"), value: 90 },
  { label: t("投注"), value: 20 },
  { label: t("转入"), value: 11 },
  { label: t("转出"), value: 10 },
  { label: t("二次结算（扣钱）"), value: 40 },
  { label: t("二次结算（加钱）"), value: 41 },
  { label: t("取消注单"), value: 21 }
]

export const columns: TableColumnList = [
  {
    label: t("序号"),
    type: "index",
    minWidth: 55
  },
  {
    label: t("注单号"),
    prop: "identifier",
    minWidth: 200,
    formatter: ({ identifier }) =>{
     if(identifier.indexOf('_')>0&&identifier?.split('_')?.length){
       return  identifier?.split('_')[0]
     }
    return '-'
    }
  },
  {
    label: t("流水ID"),
    prop: "id",
    minWidth: 100,
    formatter: ({ id }) =>{
      return 'zb'+id
    }
  },
  {
    label: t("账变类型"),
    minWidth: 180,
    prop: "type",
    formatter: ({ type }) =>
      accountChangeTypeCodeList.filter(item => type === item.value)[0].label
  },
  {
    label: t("交易类型"),
    prop: "type",
    formatter: ({ type }) => (type % 10 == 0 ? "扣款" : "加钱")
  },
  {
    label: t("账变金额"),
    prop: "transAmount",
    minWidth: 150,
    formatter: ({ transAmount }) => (transAmount ? addThousandSeparator(transAmount.toFixed(2)) : "-")
  },
  {
    label: t("账变前金额"),
    prop: "prevBalance",
    minWidth: 150,
    formatter: ({ prevBalance }) => (prevBalance ? addThousandSeparator(prevBalance.toFixed(2)) : "-")
  },
  {
    label: t("账变后金额"),
    prop: "balance",
    minWidth: 150,
    formatter: ({ balance }) => (balance ? addThousandSeparator(balance.toFixed(2)) : "-")
  },
  {
    label: t("账变时间"),
    prop: "createTime",
    minWidth: 200,
    formatter: ({ updatedAt }) => dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss")
  },
  {
    label: t("备注"),
    minWidth: 100,
    prop: "remark",
  },
]
