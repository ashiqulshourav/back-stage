import editForm from "../form.vue";
import { message } from "@/utils/message";
import { FormItemProps } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { $t, transformI18n } from "@/plugins/i18n";
import { sportIdsMap } from "@/utils/maps/sports_map";


export function useLeague() {
  const form = reactive({
    leagueNameCn: "",
    leagueNameEn: "",
    level: "",
    countryId: "",
    leagueId: "",
    leagueId188Bet: "",
    sportId: "",
  });
  const formRef = ref();
  const dataList = reactive<MetadataAPI.LeagueList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: transformI18n($t("metadata.leagueID")),
      prop: "leagueId",
      minWidth: 100
    },
    {
      label: transformI18n($t('metadata.leagueLogo')),
      prop: "leagueLogo",
      slot: "leagueLogo",
      minWidth: 120
    },
    {
      label: transformI18n($t('metadata.countryId')),
      prop: "countryId",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.leagueId188Bet')),
      prop: "leagueId188Bet",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.leagueNameCn')),
      prop: "leagueNameCn",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.leagueNameEn')),
      prop: "leagueNameEn",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.level')),
      prop: "level",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.sportType')),
      prop: "sportId",
      formatter: ({ sportId }): string => sportIdsMap.find(_ => _.value === sportId).label,
      minWidth: 150
    },
    /* {
      label: transformI18n($t('metadata.operation')),
      fixed: "right",
      width: 240,
      slot: "operation"
    } */
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });


  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch()
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') {
      pagination.currentPage = 1;
    }
    loading.value = true;
    const data = removeEmptyStringKeys(form);
    const res: MetadataAPI.LeagueListRes = await API.getLeagueList({
      ...data,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    if (res.code) return;
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

  function openDialog(title: string, row?: MetadataAPI.LeagueList) {
    addDialog({
      title,
      props: {
        formInline: {
          leagueNameCn: row?.leagueNameCn ?? '',
          leagueNameEn: row?.leagueNameEn ?? '',
          leagueId188Bet: row?.leagueId188Bet ?? '',
          leagueLogo: row?.leagueLogo ?? '',
          level: row?.level ?? '',
          countryId: row?.countryId ?? '',
          leagueId: row?.leagueId ?? '',
          sportId: row?.sportId ?? '',
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          // message(`您${title}了角色名称为${curData.name}的这条数据`, {
          //   type: "success"
          // });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
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
    form,
    loading,
    columns,
    dataList,
    pagination,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
