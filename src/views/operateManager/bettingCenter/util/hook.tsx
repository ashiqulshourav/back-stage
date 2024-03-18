import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { searchFormType } from './types';
import { columns } from './exportTableColumnList';
import { utils, writeFile } from 'xlsx';
import { Detail, getBetTeamType, playMap,markeTypeMap } from "@/utils/formatMatch";
import dayjs from 'dayjs';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { ElMessageBox } from "element-plus";
import { useUserStore } from "@/store/user";
export function useLeague(settleStatus:number) {
  const userStore = useUserStore();
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const loading = ref(true);
  const totalInfo = reactive<BetOrderAPI.otherDataType>(
    {} as BetOrderAPI.otherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const form = reactive<searchFormType>({
    sportId: '',
    userIdOrName: '',
    createTimeStart: dayjs().startOf('month').valueOf(),
    createTimeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    agentId: 1,
    category: ' ',
    awayTeamNameCn: '',
    homeTeamNameCn: '',
    leagueNameEn: '',
    leagueNameCn: '',
    beginTimeStart: '',
    beginTimeEnd: '',
    settleTimeStart: '',
    settleTimeEnd: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
/*    try {
      loading.value = true;
      const res: BetOrderAPI.BetOrderResType = await API.getOrderList({
        ...removeEmptyStringKeys({ ...form,tenantId:userStore.userInfo.tenantId}),
        settleStatus,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.map((item:any,index:number)=>{
        item.index=index+1;
      })
      dataList.push(...res.data.pageData);
      pagination.total = res.data.count;
      pagination.pageSize = res.data.pageSize;
      pagination.currentPage = res.data.pageNum;
      Object.assign(totalInfo, res.data.otherData);
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }*/
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };



  //- 导出excel表格
  const exportFile = async () => {
    const res = await API.orderListDownLoad({
      ...removeEmptyStringKeys({ ...form,tenantId:userStore.userInfo.tenantId }),
      settleStatus: 0,
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });

    const r = res.data.map((item:any,i) => {

      const arr = [];
      const data={...item,...item?.combineOrderDetails[0]}
      columns.forEach((column:{prop:string}) => {
        let str =''
        switch (column.prop.toString()){
          case 'sportId':
            str = SPORT_ID_MAP.find(_ => +_.value === +data[column.prop as string]) ?.label ?? data.sportNameCn;
            break;
          case 'beginTime':
            str = dayjs(data[column.prop]).format('YYYY-MM-DD HH:mm:ss');
            break;
          case 'createTime':
            str = dayjs(data[column.prop]).format('YYYY-MM-DD HH:mm:ss');
            break;
          case 'index':
            str = (i+1).toString()
            break;
          case 'playType':
            str=`${playMap[data.kindsCode] ?? data.betItemName ?? '-'}`
            break;
          case 'seriesType':
            str = data.seriesType===1?'单关':'串关'
            break;
          case 'betName':
            str= getBetTeamType(data || {} as Detail)
            break;
          case 'teamName':
            str= `${data.homeTeamNameCn} vs ${data.awayTeamNameCn}`
            break;
          case 'marketType':
            str= markeTypeMap[data.marketType]
            break;
          default:
            str = data[column.prop as string]
        }
        arr.push(str);

      });
      return arr;
    });
    const titleList = [];
    columns.forEach(column => {
      titleList.push(column.label);
    });
    r.unshift(titleList);
    const workBook = utils.book_new();
    const workSheet = utils.aoa_to_sheet(r);
    workSheet['C1'].s = {
      wrapText: true
    };

    utils.book_append_sheet(workBook, workSheet, '数据报表');
    writeFile(workBook, '未结算注单.xlsx');
    message(t('导出成功'), {
      type: 'success'
    });
  };
  const handleCancel =(data:any)=>{

    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(
        t('确定取消注单吗？'),
        t('警告'),
        {
          center: true,
          type: 'warning'
        }
      )
        .then(async () => {
          const params:any={orderIds:[data.id]}
          const res= await API.orderCancel(params);
          if (res.code) {
            reject();
          } else {
            resolve(true);
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        })
        .catch(reject);
    });
  }

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    handleCancel,
  };
}
