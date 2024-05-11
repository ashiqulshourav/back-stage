import editForm from '../form.vue';
import manualMatchModal from '../manualMatchModal.vue';
import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, h } from 'vue';
import { editSearchFormType, searchFormType } from './types';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import dayjs from "dayjs";
export function matchCombineHook() {
  const dataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const matchInfoDataList = reactive<MatchCombineAPI.matchSourceDetail[]>([]);
  const matchInfo = reactive<MatchCombineAPI.matchSourceDetail>({} as MatchCombineAPI.matchSourceDetail);
  const loading = ref(true);
  const alreadyMatch = ref<Boolean>(false);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
  });
  const editPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
  });
  const form = reactive<searchFormType>({
    dataSourceCode: '',
    category: 0,
    sportId: '',
    matchId: '',
    leagueNameCn: '',
    leagueNameEn: '',
    homeTeamNameCn: '',
    homeTeamNameEn: '',
    awayTeamNameCn: '',
    awayTeamNameEn: '',
    pairingType: 0,
    startTime: '',
    endTime: '',
    pairingUser: '',
  });

  const editFrom =reactive<editSearchFormType>({
    category: 0,
    sportId: null,
    matchId188bet: null,
    startTime: null,
    endTime: null,
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleModalTableWidthChange(val: number) {
    editPagination.pageSize = val;
    onModalSearch();
  }

  function handleModalCurrentChange(val: number) {
    editPagination.currentPage = val;
    onModalSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;

      if (form.startTime) {
        form.startTime = dayjs(form.startTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        form.startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      if (form.endTime) {
        form.endTime = dayjs(form.endTime).format('YYYY-MM-DD HH:mm:ss')
      } else {
        form.endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await API.getMatchPairingList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      dataList.length = 0
      if (res.data.list) {
        dataList.push(...res.data.list)
        pagination.total = res.data.total;
        pagination.pageSize = res.data.pageSize;
        pagination.currentPage = res.data.pageNum;
      }
    } catch (error) {
      loading.value = false;
    }
  }

  async function onModalSearch(type?: string) {
    console.log('###inside onModalSearch')
    if (type === 'reload') editPagination.currentPage = 1;
    try {
      loading.value = true;
      console.log('###editFrom', editFrom);
      const res = await API.getMatchDataSourceList({
        ...removeEmptyStringKeys(editFrom),
        pageSize: editPagination.pageSize,
        pageNum: editPagination.currentPage
      });
      loading.value = false;
      matchInfoDataList.length = 0;
      if (res.data.list) {
        alreadyMatch.value = res.data.list.filter(item => item.pairingStatus === 1).length > 0;
        matchInfoDataList.push(...res.data.list)
        editPagination.total = res.data.total;
        editPagination.pageSize = res.data.pageSize;
        editPagination.currentPage = res.data.pageNum;
      }else {
        editPagination.total = 0;
        editPagination.pageSize = 1;
        editPagination.currentPage = 1;
      }
    } catch (error) {
      loading.value = false;
      matchInfoDataList.length = 0;
    }
  }

  async function openDialog(title: string, row?: MatchCombineAPI.matchSourceDetail) {
    addDialog({
      title,
      width: '95%',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          rowData: row,
          matchInfoDataList: matchInfoDataList,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            params && onSearch();
          }
        })
    });
  }

  async function openManualMatchDialog(title: string, rowData: MatchCombineAPI.matchPairingDetail, row: MatchCombineAPI.matchSourceDetail) {
    addDialog({
      title,
      width: 'auto',
      alignCenter: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(manualMatchModal, {
          matchSource: rowData,
          matchSourcePair: row,
          onCloseDialog: (params: string) => {
            closeDialog(options, index);
            // 匹配后更新列表数据状态；
            alreadyMatch.value= params.pairingStatus===1
            matchInfoDataList.map((item)=>{
              if(item.matchId===params.matchId){
                item.pairingStatus=params.pairingStatus
              }
            })

          }
        })
    });
  }

  return {
    loading,
    dataList,
    pagination,
    onSearch,
    openDialog,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    form,
    onModalSearch,
    editFrom,
    openManualMatchDialog,
    matchInfo,
    matchInfoDataList,
    alreadyMatch,
    handleModalTableWidthChange,
    handleModalCurrentChange,
    editPagination,
  };
}
