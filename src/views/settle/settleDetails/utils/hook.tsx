import { message } from "@/utils/message";
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { columns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';

export function useMatchDetailsHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  const onSearch = async () => {
    getCurrentMatchDetail();
    const res: SattleDataAPI.getBasketballEventRes = await API.getBasketballEvents({ matchId: history.state.params?.matchId });
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表
  const allSettleBtnClick = async () => {
    console.log('123');
  };

  const getCurrentMatchDetail = async () => {
    const res = await API.getSettlementList({
      matchId: history.state.params?.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data.list[0]);
  };

  const scoreValidation = (NewGoalEvent: SattleDataAPI.BasketballEvent) => {
    const { t1, t2, matchPeriod } = NewGoalEvent;
    switch (history.state.params?.sportId) {
      case 2: 
        if (t1 as number < 0 || t2 as number < 0 || t1 as number > 150 || t2 as number > 150) {
          message('无效分数', { type: 'error' });  
          return false;
        }
        if (matchPeriod === 'OT' && t1 === t2) {
          message('无效分数', { type: 'error' });  
          return false;
        }
    }
    return true;
  }
  const timeValidation = (NewGoalEvent: SattleDataAPI.BasketballEvent) => {
    if (!NewGoalEvent.eventTime || NewGoalEvent.eventTime < dataList[0]?.eventTime) {
      message('无效时间', { type: 'error' });  
      return false;
    }
    return true;
  }
  const onAddNewGoalEvent = (NewGoalEvent: SattleDataAPI.BasketballEvent) => {
    if (scoreValidation(NewGoalEvent) && timeValidation(NewGoalEvent)) {
      ElMessageBox.confirm(
        `<p class='text-center'>${history.state.params?.homeTeamNameCn || '-'} VS ${
          history.state.params?.awayTeamNameCn || '-'
        } <br />
          <p class="text-center text-2xl text-bold w-full">${NewGoalEvent.t1} : ${
          NewGoalEvent.t2
        }</p>
          ⼿動結算後無法回退，請再次確認比分</p>
          `,
        `結算${MATCH_PERIOD[NewGoalEvent.matchPeriod]}`,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('確認結算'),
          cancelButtonText: t('取消'),
          center: true
        }
      )
        .then(async () => {
          const res: MetadataAPI.AddBasketballEeventRes =
            await API.addBasketballEvent({
              matchId: NewGoalEvent.matchId,
              eventTime: NewGoalEvent.eventTime,
              t1: NewGoalEvent.t1 as number,
              t2: NewGoalEvent.t2 as number,
              matchPeriod: NewGoalEvent.matchPeriod,
              canceled: 0,
            });
          if (res.code) message(res.msg, { type: 'error' });
          else {
            onSearch();
          }
        })
    }
  }

  onMounted(() => {
    onSearch();
  })
  return {
    renderObj,
    columns,
    dataList,
    allSettleBtnClick,
    getCurrentMatchDetail,
    onAddNewGoalEvent,
    onSearch,
  };
}
