import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import {betStatus, betStatusMap, searchFormType, seriesTypesSingle, seriesTypesDuplex, riskStatusMap,riskStatus} from './types';
import { columns } from './exportTableColumnList';
import { utils, writeFile } from 'xlsx';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { reactive, ref, onMounted, h } from 'vue';
import {usePasswordInputHook} from "@/hooks/passwordInputHook";
import {
  markeTypeMap,
  useSportFormatDetail,
  displayHomeAwayScore, BET_RESULT_TYPE_MAP, formatSeriesType
} from "@/utils/formatMatch";
import dayjs from 'dayjs';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import {copyTextToClipboard} from "@pureadmin/utils";
import {t} from "@/plugins/i18n";
import formDom from "../component/form.vue";
import {ElMessageBox} from "element-plus";
export function useLeague() {
  const {openPasswordInput}= usePasswordInputHook()
  const dataList = reactive<BetOrderAPI.BetOrderList[]>([]);
  const tenantList = reactive<any>([]);
  const tenantObj = reactive<any>({});
  const UDialogFlag =  ref<Boolean>(false);
  const loading = ref(true);
  const totalInfo = reactive<BetOrderAPI.RiskOtherDataType>(
    {} as BetOrderAPI.RiskOtherDataType
  );
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    pageSizes:[10,20,50,100,200,1000],
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
    seriesType:'',
    category:'',
    tenantIds:[],
    seriesDetailsSingle:[],
    seriesDetailsDuplex:[],
    minBetAmount:'',
    maxBetAmount:'',
    riskStatus:'',
  });
  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  const selectReject = (flag,index,i)=>{
    dataList[index].combineOrderDetails[i]['rejectSelected'] = flag
  }
  const selectApprove = (flag,index,i)=>{
    dataList[index].combineOrderDetails[i]['approveSelected'] = flag
  }
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val);
  }

  const formatParams = (privateparams={}) =>{
    let seriesDetails:any=[];
    if(form.seriesType==2){
      if(form.seriesDetailsSingle.length){
        form.seriesDetailsSingle.map((item:any)=>{
          seriesDetails.push(...(seriesTypesSingle[item].list))
        })
      }else {
        for (let item in seriesTypesSingle){
          seriesDetails.push(...(seriesTypesSingle[item].list))
        }
      }

    }else if(form.seriesType==3) {
      if(form.seriesDetailsDuplex.length){
        form.seriesDetailsDuplex.map((item:any)=>{
          seriesDetails.push(...(seriesTypesDuplex[item].list))
        })
      }else {
        for (let item in seriesTypesDuplex){
          seriesDetails.push(...(seriesTypesDuplex[item].list))
        }
      }

    }else {
      seriesDetails=''
    }
    if(seriesDetails.length>1){
      seriesDetails= [...new Set(seriesDetails)]
    }
    return  {
      // @ts-ignore
      ...removeEmptyStringKeys({...form,seriesDetailsSingle:'',seriesDetailsDuplex:'',seriesDetails:seriesDetails,seriesType:form.seriesType>2?2:form.seriesType}),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage,
      ...privateparams
    }
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      const params:searchFormType= formatParams({}) as searchFormType
      if(Number(params.maxBetAmount)<Number(params.minBetAmount)){
          message(t('请检查投注额，最小值不能大于最大值'), { type: 'warning' });
          return
      }
      if(Number(params.maxProfitAmount)<Number(params.minProfitAmount)){
          message(t('请检查用户输赢，最小值不能大于最大值'), { type: 'warning' });
          return
      }
      loading.value = true;
      const res : BetOrderAPI.BetOrderResType = await API.bettingAuditList(params);
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      if (res.data !== null) {
        dataList.push(...res?.data?.pageData);
        dataList.map((item: any, index) => {
          item.index = index + 1
           item.combineOrderDetails.map((item)=>{
             item.rejectSelected = false;
             item.approveSelected = false;
           })
        })
        pagination.total = res?.data?.count;
        pagination.pageSize = res?.data?.pageSize;
        pagination.currentPage = res?.data?.pageNum;
        Object.assign(totalInfo, res?.data?.otherData);
      }
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      loading.value = false;
    }
  }

  const getTenantList = async ()=>{
    const res =  await API.getTenantList()
    if(res.data?.data?.length){
      tenantList.push(...res?.data?.data);
      // 将数组根据id转换为对象
      tenantList.map((item)=>{
        tenantObj[item.id] = item;
      })
    }
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  //- 导出excel表格
  const exportFile = async () => {
    const res: BetOrderAPI.BetOrderResType  = await API.bettingAuditList(formatParams({pageNum:1,pageSize:50000}) as searchFormType);
    const r = res.data.pageData.map((item:any,i) => {
      const arr = [];
      const data={...item,...item?.combineOrderDetails[0]}
      columns.forEach((column:{prop:string}) => {
        let str =''
        switch (column.prop.toString()){
          case 'sportId':
            str = SPORT_ID_MAP.find(_ => +_.value === +data[column.prop as string]) ?.label ?? data.sportNameCn;
            break;
          case 'beginTime':
            str = data.beginTime?dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss'):'';
            break;
          case 'createTime':
            str = data.createTime?dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss'):'';
            break;
          case 'settleTime':
            str = data.settleTime?dayjs(data[column.prop])?.format('YYYY-MM-DD HH:mm:ss'):'';
            break;
          case 'index':
            str = (i+1).toString()
            break;
          case 'playType':
            str=useSportFormatDetail(data)[4]
            break;
          case 'betName':
            str= useSportFormatDetail(data)[3]
            break;
          case 'teamName':
            str= `${data.homeTeamNameCn} vs ${data.awayTeamNameCn}`
            break;
          case 'marketType':
            str= markeTypeMap[data.marketType]
            break;
          case 'isSettlementAgain':
            str = data.isSettlementAgain===2?'是':'否'
            break;
          case 'status':
            str=betStatusMap[getStatus(data.status,data.billStatus,data.betResult,data.isReserve)?.status]
            break;
          case 'billStatus':
            str=betStatusMap[getStatus(data.status,data.billStatus,data.betResult,data.isReserve)?.status]
            break;
          case 'settleScore':
            str=displayHomeAwayScore(data.settleScore,data.sportId)
            break;
          case 'betResult':
            str=BET_RESULT_TYPE_MAP[data.betResult]
            break;
          case 'scoreBenchmark':
            str=displayHomeAwayScore(data.scoreBenchmark,data.sportId)
            break;
          case 'seriesType':
            if(data.combineOrderDetails.length>1){
              str=String(data.seriesType).slice(-3) ==='001'?'串关':'复式'
              str+=' '+formatSeriesType(data?.seriesType,data.combineOrderDetails.length)
            }
            break;
          case 'isSeriesType':  //单关 串关
              str=data.seriesType===1?'单关':'串关';
              break;
          case 'tenantName':  //商户名
            str=(tenantObj[data.tenantId])?.tenantName??''
            break;
          case 'tenantCode':  //商户编码
              str=(tenantObj[data.tenantId])?.name??''
              break;
          // case 'riskStatus':  //风控状态
          //   str= getRiskStatus(item.riskStatus).label
          //     if(item.riskType){
          //     }
          //   break;
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
    writeFile(workBook, '赛程_注单审核.xlsx');
    message(t('导出成功'), {
      type: 'success'
    });
  };
  const handleCancel = (row:any,index:number)=>{
    let data= {...row} //...row.combineOrderDetails[index]
    data.combineOrderDetails = data.combineOrderDetails.filter((item,i)=>{
      console.log(1111,item)
      return i == index
    })
    openCancelDialog([data])
  }
  const handleCancelAll = ()=>{
    openCancelDialog(dataList)
  }
  const openCancelDialog = (list)=>{
    addDialog({
      title:'风控划单',
      width: '30%',
      hideFooter: true,
      closeOnClickModal: false,
      alignCenter: true,
      contentRenderer: ({ options, index }) =>
        h(formDom, {
          list: list,
          onCloseDialog: () => {
            onSearch('reload');
            closeDialog(options, index);
          },
        }),
    });
  }
  const handleApprove = (row:any,index)=>{
    const r= openPasswordInput();
    if(!r){
      return
    }
    let data= {...row} //...row.combineOrderDetails[index]
    data.combineOrderDetails = data.combineOrderDetails.filter((item,i)=>{
      console.log(1111,item)
      return i == index
    })
    openApproveDialog([data])
  }

  const handleApproveAll =()=>{
    openApproveDialog(dataList)
  }

  const openApproveDialog = (list)=>{
    ElMessageBox.confirm(
      t('确定审核通过吗？'),
      t('警告'),
      {
        center: true,
        type: 'warning'
      }
    ).then(()=>{
      const r= openPasswordInput();
      if(!r){
        return
      }
      let param=[];
      list.map((item:any)=>{
        const details = item.combineOrderDetails.map((item)=>{
          return {detailId:item.detailId,riskTimes: item.riskTimes,}
        })
        param.push({
          orderId:item.id,
          details:details,
        })
      })
      console.log(4444,param)
      API.bettingAuditConfirm(param).then((res)=>{
        onSearch();
        console.log(55555,res)
      })
    })
  }



const getStatus = (status,billStatus,betResult,isReserve?)=>{
    let obj = {status:-1,bgColor:''}
  if(status==2&&billStatus===1&&(betResult===22||betResult===23)){   // 注单无效
    obj={status:betStatus.betInvalid,bgColor:'#E54752'}
  }else if(status===1&&billStatus===1&&(betResult===21)){  // 预约失败
    obj={status:betStatus.reserveFail,bgColor:'#F57582'}
  }else if(status===0&&billStatus===0){  // 未结算
    if(isReserve===1){ // 预约中
      obj={status:betStatus.onReverse,bgColor:'#F57582'}
    }else {
      obj={status:betStatus.unsettlementBet,bgColor:'#FFC53D'}
    }
  }else if(status===1&&billStatus===1){// 已结算
    obj={status:betStatus.settlementBet,bgColor:'#40A9FF'}
  }else if(status===4&&billStatus===1&&betResult===61){  // 封控拒单
    obj={status:betStatus.riskReject,bgColor:'#F88D48'}
  }else if(status===3){   // 待确认
    obj={status:betStatus.confirm,bgColor:'#FFC53D'}
  }else if(status===6){ // 待审核
    obj={status:betStatus.PendingApprove,bgColor:'#F88D48'}
  }else  if(status===4){  // 投注失败
    obj={status:betStatus.betFail,bgColor:'#F57582'}
  }else if(status===5){  // 赛事异常
    obj={status:betStatus.eventAbnormal,bgColor:'#F88D48'}
  }
   return obj
}

const getRiskStatus = (rStatus:number)=>{
  let obj = {label:'',bgColor:''}
    if(rStatus===riskStatus.approve){
      obj = {label:riskStatusMap[riskStatus.approve],bgColor:'#FFC53D'}
    }else if(rStatus===riskStatus.reject){
      obj = {label:riskStatusMap[riskStatus.reject],bgColor:'#F88D48'}
    }
    return obj
}

function copyTest(str:string,tip:string){
        if(!str) return;
        const success = copyTextToClipboard(str.toString());
        success
            ? message(t('复制{value}成功!',{value:tip||str||''}), { type: 'success' })
            : message(t('复制失败'), { type: 'error' });
    }

  //- 切换比赛类型
  onMounted(() => {
    onSearch();
    getTenantList();
  });

  return {
    loading,
    dataList,
    tenantList,
    pagination,
    form,
    totalInfo,
    onSearch,
    resetForm,
    handleTableWidthChange,
    handleCurrentChange,
    handleSelectionChange,
    exportFile,
    getRiskStatus,
    getStatus,
    copyTest,
    tenantObj,
    UDialogFlag,
    handleCancel,
    handleApprove,
    handleCancelAll,
    handleApproveAll,
    selectReject,
    selectApprove,
  };
}
