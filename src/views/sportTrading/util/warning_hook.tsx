import { message } from '@/utils/message';
import { WarningSearchFormType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { warningBaseList } from './baseData';
import type { PaginationProps } from '@pureadmin/table';
import {
  BO_DAN_CODE_LIST,
  SALE_STATUS,
  icon_msg_tip,
  transferBoDanCol
} from './playMap';
import { ElMessageBox } from 'element-plus';

export function useWarningHook() {
  const loading = ref(true);
  const noMatchList = ref(false);
  const matchList = reactive<sportTradingDataAPI.getAlarmMatchListType[]>([]);
  const matchIdList = reactive<number[]>([]);
  const pages = ref<number>();
  const size = ref<number>();

  //- 分页内容
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 5,
    currentPage: 1,
    background: true
  });

  //- 搜索表单
  const searchForm = reactive<WarningSearchFormType>({
    sportId: 1,
    leagueNameOrId: '',
    matchNameOrId: '',
    startTime: '',
    endTime: ''
  });

  //- 更新界面
  const reloadList = async () => {
    pagination.currentPage = 1;
    onSearch();
  };

  //- 分页改变
  const changePageSize = () => onSearch();

  //- 初始化搜索
  const onSearch = async () => {
    loading.value = true;
    noMatchList.value = false;
    const res = await API.getAlarmMatchList({
      ...removeEmptyStringKeys(searchForm),
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    //获取当前页面IDS
    matchIdList.length = 0;
    matchIdList.push(...res.data?.list.map(item => item.matchId));
    saveList(res.data);
    //- 开启事件定时任务
    runLoopMatch();
  };

  //- 处理数据填充逻辑
  const saveList = (data: sportTradingDataAPI.getAlarmMatchListData) => {
    pages.value = data.pages;
    size.value = data.size;
    pagination.total = data?.total;
    data.list.forEach((item: sportTradingDataAPI.getAlarmMatchListType) => {
      const baseDatat: typeof warningBaseList = JSON.parse(
        JSON.stringify(warningBaseList)
      );
      baseDatat.forEach(_ => {
        const arr =
          item.betItemsResultDto[
            _.listType as keyof sportTradingDataAPI.BetItemsResultDto
          ];
        arr.forEach((d: sportTradingDataAPI.MainListType) => {
          d.kindsCodeDtoList.forEach(_ => {
            _.betItemsDtoList.forEach(l => {
              if (!l.dpOdds) l.dpOdds = l.odds;
            });
          });
          // - 波胆单独处理
          if (BO_DAN_CODE_LIST.includes(d.kindsCode)) {
            transferBoDanCol(
              d as sportTradingDataAPI.MainBetItemsDtoList,
              item.homeTeamNameCn,
              item.awayTeamNameCn
            );
          }
        });
        _.list = arr;
      });
      item.renderList = baseDatat.filter(item => {
        return item.list.length;
      });
    });
    matchList.length = 0;
    matchList.push(...data.list);
  };

  //- 开启定时轮询任务
  const loopTimer = ref<NodeJS.Timeout>();
  const runLoopMatch = () => {
    if (loopTimer) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => {
      getLoopMatchData();
    }, 5000);
  };

  //- 轮询更新当前页面赛事信息
  const getLoopMatchData = async () => {
    const res = await API.loopAlarmMatchList({
      sportId: searchForm.sportId,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
      total: pagination.total,
      pages: pages.value as number,
      size: size.value as number,
      matchIdList
    });
    if (res.code) {
      clearInterval(loopTimer.value);
      return message(res.msg, { type: 'error' });
    }
    saveList(res.data);
  };

  //- 点击快捷键修改赔率
  const sendNewOdds = async (d: {
    matchId: number;
    params: { betItemsId: number; dpOdds: number }[];
  }) => {
    const res = await API.updateHandicapOdds({
      matchId: d.matchId,
      operateMenu: '操盘管理-早盘管理',
      betItemsDtoList: d.params
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
  };

  //- 鼠标进入后清空定时器
  const clearMatchTime = (type: 1 | -1) => {
    if (type === 1) {
      clearInterval(loopTimer.value);
    } else {
      runLoopMatch();
    }
  };

  //-赛事盘口状态更新
  const changeStatus = ({
    matchId,
    status,
    classify,
    betItemsIdList,
    categoryData,
    item
  }: {
    matchId: number;
    status: Partial<SALE_STATUS>;
    classify: 'match' | 'category' | 'pan';
    betItemsIdList?: number[];
    categoryData?: sportTradingDataAPI.MainListType;
    item?: sportTradingDataAPI.renderListType;
  }) => {
    clearInterval(loopTimer.value);
    ElMessageBox.confirm(icon_msg_tip[status], t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      center: true
    })
      .then(async () => {
        const res = await API.updateHandicapStatus({
          operateMenu: '操盘管理-早盘管理',
          matchId: matchId,
          isSale: status,
          betItemsIds: betItemsIdList ?? []
        });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        runLoopMatch();
        if (res.code) return;
        switch (classify) {
          case 'match':
            upateMatchSale(status, matchId);
          case 'pan':
            upatePanSale(
              status,
              categoryData as sportTradingDataAPI.MainBetItemsDtoList
            );
            break;
          case 'category':
            upatePalySale(status, item as sportTradingDataAPI.renderListType);
            break;
          default:
            break;
        }
      })
      .catch(() => runLoopMatch());
  };

  //- 修改赛事图标状态
  const upateMatchSale = (status: number, selectId: number) => {
    matchList.some(_ => {
      if (_.matchId === selectId) {
        _.isSale = status;
        return true;
      }
      return false;
    });
  };

  //- 修改盘赛事图标状态
  const upatePanSale = (
    status: number,
    categoryData: sportTradingDataAPI.MainBetItemsDtoList
  ) => {
    categoryData.isSale = status;
  };

  //- 修改玩法状态
  const upatePalySale = (
    status: number,
    item: sportTradingDataAPI.renderListType
  ) => {
    item.isSale = status;
    item.list.forEach(item => (item.isSale = status));
  };

  onMounted(() => {
    onSearch();
  });

  //- 卸载定时器
  onUnmounted(() => loopTimer.value && clearInterval(loopTimer.value));

  return {
    searchForm,
    pagination,
    loading,
    matchList,
    changePageSize,
    reloadList,
    sendNewOdds,
    clearMatchTime,
    changeStatus,
    onSearch
  };
}
