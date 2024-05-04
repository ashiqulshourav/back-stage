import { t } from "@/plugins/i18n"
import { handleTableWidth } from "@/utils/getTableWidth"
export const columns: TableColumnList = [
  {
    label: t("角色等级"),
    prop: "level",
    align: "left",
    headerRenderer: d => handleTableWidth(d, t("角色等级"), "auto")
  },
  {
    label: t("角色名称"),
    prop: "name",
    headerRenderer: d => handleTableWidth(d, t("角色名称"), "auto")
  },
  {
    label: t("所属一级部门"),
    prop: "deptName",
    headerRenderer: d => handleTableWidth(d, t("所属一级部门"), "auto")
  },
  {
    label: t("创建时间"),
    prop: "createdAt",
    formatter: ({ createdAt }) => createdAt ?? "-",
    headerRenderer: d => handleTableWidth(d, t("创建时间"), "auto")
  },
  {
    label: t("创建人"),
    prop: "createdBy",
    formatter: ({ createdBy }) => createdBy ?? "-",
    headerRenderer: d => handleTableWidth(d, t("创建人"), "auto")
  },
  {
    label: t("使用人数"),
    formatter: ({ userCount }) => userCount ?? "-",
    headerRenderer: d => handleTableWidth(d, t("使用人数"), "auto")
  },
  {
    label: t("状态"),
    slot: "status",
    headerRenderer: d => handleTableWidth(d, t("状态"), "auto")
  },
  {
    label: t("备注"),
    prop: "comment",
    formatter: ({ comment }) => comment ?? "-",
    headerRenderer: d => handleTableWidth(d, t("备注"), "auto")
  },
  {
    label: t("操作"),
    slot: "operation",
    headerRenderer: d => handleTableWidth(d, t("操作"), "auto")
  }
]
