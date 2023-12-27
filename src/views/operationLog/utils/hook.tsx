import { message } from "@/utils/message";
// import editForm from "../form.vue";
import type { PaginationProps } from "@pureadmin/table";
// import { addDialog } from "@/components/ReDialog";
import { $t, transformI18n } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";
import dayjs from "dayjs";

export function useOperationLog() {
  const dataList = reactive<OperationLogDataAPI.OperationLog[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  // const formRef = ref();
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: transformI18n($t("operationLog.operationLogId")),
      prop: "operationLogId",
      minWidth: 150,
      fixed: true
    },
    {
      label: transformI18n($t("operationLog.operationAccount")),
      prop: "operationAccount",
      minWidth: 150,
      fixed: true
    },
    {
      label: transformI18n($t("operationLog.resourceName")),
      prop: "resourceName",
      minWidth: 150
    },
    {
      label: transformI18n($t("operationLog.operationDateTime")),
      prop: "operationDateTime",
      minWidth: 250,
      formatter: ({ operationDateTime }) =>
        `${dayjs(operationDateTime).format("YYYY-MM-DD HH:mm:ss")}`
    },
    {
      label: transformI18n($t("operationLog.successOrNot")),
      prop: "successOrNot",
      minWidth: 150
    },
    {
      label: transformI18n($t("operationLog.operationType")),
      prop: "operationType",
      minWidth: 150
    },
    {
      label: transformI18n($t("operationLog.uniqueId")),
      prop: "uniqueId",
      minWidth: 150
    },
    {
      label: transformI18n($t("operationLog.leagueId")),
      prop: "leagueId",
      minWidth: 150
    },
    {
      label: transformI18n($t("operationLog.beforeOperation")),
      prop: "beforeOperation",
      minWidth: 350
    },
    {
      label: transformI18n($t("operationLog.afterOperation")),
      prop: "afterOperation",
      minWidth: 350
    },
    {
      label: transformI18n($t("operationLog.extra")),
      prop: "extra",
      minWidth: 150
    }
  ];

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  async function onSearch(type?: string) {
    if (type === "reload") pagination.currentPage = 1;
    loading.value = true;
    // const data = removeEmptyStringKeys(form);
    const res: OperationLogDataAPI.OperationLogListRes =
      await API.getOperationLogList({
        // ...data,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
    if (res.code) return message(res.msg, { type: "error" });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    setTimeout(() => (loading.value = false), 500);
  }

  onMounted(() => {
    onSearch();
  });
  return {
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    handleSizeChange,
    switchLoadMap,
    handleCurrentChange,
    switchStyle
  };
}
