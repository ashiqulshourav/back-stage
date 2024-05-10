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
    dataSourceCode:'',
    category: 0,
    sportId:'',
    matchId:'',
    leagueNameCn:'',
    leagueNameEn:'',
    homeTeamNameCn:'',
    homeTeamNameEn:'',
    awayTeamNameCn: '',
    awayTeamNameEn: '',
    pairingType: 0,
    startTime:'',
    endTime:'',
    pairingUser:'',
  });

  const editFrom =reactive<editSearchFormType>({
      category: 0,
      sportId:null,
      matchId188bet:null,
      startTime:null,
      endTime:null,
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;

      if(form.startTime){
        form.startTime= dayjs(form.startTime).format('YYYY-MM-DD HH:mm:ss')
      }else {
        form.startTime= dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      if(form.endTime){
        form.endTime= dayjs(form.endTime).format('YYYY-MM-DD HH:mm:ss')
      }else {
        form.endTime= dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await API.getMatchPairingList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      dataList.length=0
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
    if (type === 'reload') editPagination.currentPage = 1;
    try {
      loading.value = true;
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
      }
    } catch (error) {
      loading.value = false;
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
  async function openManualMatchDialog(title: string, rowData:MatchCombineAPI.matchPairingDetail,row: MatchCombineAPI.matchSourceDetail) {
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
            params && onSearch();
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
  };
}
