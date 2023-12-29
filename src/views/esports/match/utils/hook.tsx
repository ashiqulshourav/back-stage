import { message } from "@/utils/message";
import editForm from "../form.vue";
import type { PaginationProps } from "@pureadmin/table";
import { addDialog } from "@/components/ReDialog";
import { t } from "@/plugins/i18n";
import { usePublicHooks } from "@/hooks";

export function useLeague() {
  const dataList = reactive<ESportsAPI.League[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const formRef = ref();
  const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: t("联赛ID"),
      prop: "leagueId",
    },
    {
      label: t('中文简体'),
      prop: "leagueNameCn",
      minWidth: 200
    },
    {
      label: t('英文名称'),
      prop: "leagueNameEn",
      minWidth: 200
    },
    {
      label: t('简称'),
      prop: "leagueName",
      minWidth: 200
    },
    {
      label: t('英文名（数据商）'),
      prop: "dataSource",
      minWidth: 150
    },
    {
      label: t('数据商'),
      prop: "dataSourceName",
      minWidth: 100
    },
    {
      label: t('联赛排序'),
      prop: "sort",
      minWidth: 80
    },
    {
      label: t('操作'),
      width: 240,
      slot: "operation",
      align: 'right'
    }
  ];

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch()
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch()
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    // const data = removeEmptyStringKeys(form);
    const res: ESportsAPI.LeagueListRes = await API.getELeagueList({
      // ...data,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    console.log(res)
    if (res.code) return message(res.msg, { type: "error" });
    dataList.length = 0;
    dataList.push(...res.data.list);
    pagination.total = res.data.total;
    pagination.pageSize = res.data.pageSize;
    pagination.currentPage = res.data.pageNum;
    setTimeout(() => loading.value = false, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title: string, row?: ESportsAPI.League) {
    addDialog({
      title,
      props: {
        formInline: {
          leagueId: row?.leagueId ?? "",
          leagueNameCn: row?.leagueNameCn ?? "",
          leagueNameEn: row?.leagueNameEn ?? "",
          leagueName: row?.leagueName ?? "",
          dataSource: row?.dataSource ?? "",
          dataSourceName: row?.dataSourceName ?? "",
          sort: row?.sort
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as ESportsAPI.League;
        function chores() {
          done();
          onSearch();
        }
        FormRef.validate(async (valid) => {
          if (valid) {
            console.log("curData", curData);

            if (title === "新增") {
              await API.createEMatch(curData);
              chores();
            } else {
              await API.updateEMatch(curData);
              chores();
            }
          }
        });
      }
    });
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
    resetForm,
    handleTableWidthChange,
    switchLoadMap,
    handleCurrentChange,
    openDialog,
    switchStyle
  };
}
