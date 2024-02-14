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
  const checkSettleCapability = () => {
    if (dataList[dataList?.length - 1]?.matchPeriod === 'OT') {
      return false;
    }
    if (dataList?.length === 4 || (dataList?.length === 2 && dataList[0]?.gameRule === 'HT')) {
      let diff = 0;
      dataList.forEach((item) => {
        diff += Number(item.t1) - Number(item.t2)
      })
      if (diff !== 0)
        return false;
    }
    return true;
  }

  const allSettleBtnClick = async () => {
    if (checkSettleCapability()) {
      message(t('请先完成结算'), { type: 'error' });
      return;
    }
    ElMessageBox.confirm(
      t('⼿動確認比嚼算全場比賽後，即開始結算全場比賽玩法，結算後無法回退。'),
      t('確認結算全場比賽'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('確認結算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const res = await API.allBasketballSettlement({ matchId: history.state.params?.matchId });
      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        onSearch();
      }
    });
  };

  const getCurrentMatchDetail = async () => {
    const res = await API.getPreSaleInfo({
      matchId: history.state.params?.matchId
    });
    if (res.code) return message(res.msg, { type: 'error' });
    Object.assign(renderObj, res.data);
  };

  const scoreValidation = (NewGoalEvent: SattleDataAPI.MatchEventParams) => {
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
  const timeValidation = (NewGoalEvent: SattleDataAPI.MatchEventParams) => {
    if (!NewGoalEvent.eventTime || NewGoalEvent.eventTime <= dataList[dataList.length - 1]?.eventTime) {
      message('无效时间', { type: 'error' });  
      return false;
    }
    return true;
  }
  const onAddNewGoalEvent = (NewGoalEvent: SattleDataAPI.MatchEventParams) => {
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
              ...NewGoalEvent
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
