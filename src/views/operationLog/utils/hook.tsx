import { message } from "@/utils/message";
// import editForm from "../form.vue";
import type { PaginationProps } from "@pureadmin/table";
// import { addDialog } from "@/components/ReDialog";
import { t } from "@/plugins/i18n";
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
      label: t("序号"),
      prop: "operationLogId",
      minWidth: 150,
      fixed: true
    },
    {
      label: t("操作账号"),
      prop: "operationAccount",
      minWidth: 150,
      fixed: true
    },
    {
      label: t("资源名称"),
      prop: "resourceName",
      minWidth: 150
    },
    {
      label: t("操作时间"),
      prop: "operationDateTime",
      minWidth: 250,
      formatter: ({ operationDateTime }) =>
        `${dayjs(operationDateTime).format("YYYY-MM-DD HH:mm:ss")}`
    },
    {
      label: t("是否成功"),
      prop: "successOrNot",
      minWidth: 150
    },
    {
      label: t("操作类型"),
      prop: "operationType",
      minWidth: 150
    },
    {
      label: t("唯一ID"),
      prop: "uniqueId",
      minWidth: 150
    },
    {
      label: t("赛事ID"),
      prop: "leagueId",
      minWidth: 150
    },
    {
      label: t("操作之前"),
      prop: "beforeOperation",
      minWidth: 350
    },
    {
      label: t("操作之后"),
      prop: "afterOperation",
      minWidth: 350
    },
    {
      label: t("备注"),
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
