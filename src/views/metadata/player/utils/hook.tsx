import editForm from "../form.vue";
import { message } from "@/utils/message";
// import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
// import { usePublicHooks } from "@/hooks";
import { removeEmptyStringKeys } from "@/utils/utilFn";
import { $t, transformI18n } from "@/plugins/i18n";

export function useLeague() {
  const form = reactive({
    teamId: '',
    countryId: '',
    isCountryPlayer: '',
    height: '',
    gender: '',
    birthday: '',
    picture: '',
    nickName: '',
    playerNameCn: '',
    createdAt: '',
    updatedAt: '',
  });
  const formRef = ref();
  const dataList = reactive<MetadataAPI.PlayerList[]>([]);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: transformI18n($t("player.playerId")),
      prop: "playerId",
    },
    {
      label: transformI18n($t('player.picture')),
      prop: "picture",
      slot: "picture",
      minWidth: 120
    },
    {
      label: transformI18n($t('metadata.teamId')),
      prop: "teamId",
    },
    {
      label: transformI18n($t('player.countryId')),
      prop: "countryId",
    },
    {
      label: transformI18n($t('player.isCountryPlayer')),
      prop: "isCountryPlayer",
    },
    {
      label: transformI18n($t('metadata.height')),
      prop: "height",
    },
    {
      label: transformI18n($t('player.gender')),
      prop: "gender",
      minWidth: 150
    },
    {
      label: transformI18n($t('player.birthday')),
      prop: "birthday",
      minWidth: 150
    },
    {
      label: transformI18n($t('player.nickName')),
      prop: "nickName",
      minWidth: 150
    },
    {
      label: transformI18n($t('player.playerNameCn')),
      prop: "teamNameEn",
    },
    {
      label: transformI18n($t('player.createdAt')),
      prop: "createdAt",
      minWidth: 150
    },
    {
      label: transformI18n($t('player.updatedAt')),
      prop: "updatedAt",
      minWidth: 150
    },
    {
      label: transformI18n($t('metadata.operation')),
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch()
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch()
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const data = removeEmptyStringKeys(form);
    const res: MetadataAPI.PlayerListRes = await API.getPlayerList({
      ...data,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
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
        function chores() {
          console.log('hook.tsx文件 167==============行打印=', options)
          // message(`您${title}了角色名称为${curData.name}的这条数据`, {
          //   type: "success"
          // });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
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
