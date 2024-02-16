import { message } from "@/utils/message";
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { columns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { useMatchStore } from "@/store/match";

export function useMatchDetailsHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const { sportId } = useMatchStore();
  const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  const onSearch = async () => {
    getCurrentMatchDetail();
    let res;
    switch (sportId) {
      case 2:
        res = await API.getBasketballEvents({ matchId: history.state.params?.matchId });
        break;
      case 19:
        res = await API.getBadmintonEvents({ matchId: history.state.params?.matchId });
        break;
      case 23:
        res = await API.getPingpongEvents({ matchId: history.state.params?.matchId });
        break;
    }
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表
  const checkSettleCapability = () => {
    let winCount1 = 0, winCount2 = 0;
    switch (sportId) {
      case 2:
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
      case 19:
        winCount1 = 0, winCount2 = 0;
        dataList.forEach(element => {
          element.t1 > element.t2 ? winCount1++ : winCount2++;
        });
        if (winCount1 > 1 || winCount2 > 1)
          return false;
        return true;
      case 23:
        winCount1 = 0, winCount2 = 0;
        dataList.forEach(element => {
          element.t1 > element.t2 ? winCount1++ : winCount2++;
        });
        if (winCount1 >= Number(dataList[0]?.gameRule[2]) || winCount2 >= Number(dataList[0]?.gameRule[2]))
          return false;
        return true;
    }
  }

  const allSettleBtnClick = async () => {
    if (checkSettleCapability()) {
      message(t('请先完成结算'), { type: 'error' });
      return;
    }
    ElMessageBox.confirm(
      t('手动确认结算全场比赛后，即开始截赛全场比赛玩法，结算后无法回退。'),
      t('確認結算全場比賽'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('確認結算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      let res;
      switch (sportId) {
        case 2:
          res = await API.allBasketballSettlement({ matchId: history.state.params?.matchId });
          break;
        case 19:
          res = await API.BamintonManualSettlementFullTime({ matchId: history.state.params?.matchId });
          break;
        case 23:
          res = await API.PingPongManualSettlementFullTime({ matchId: history.state.params?.matchId });
          break;
      }
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
    console.log(renderObj);
  };

  const scoreValidation = (NewGoalEvent: SattleDataAPI.MatchEventParams) => {
    const { t1, t2, matchPeriod } = NewGoalEvent;
    switch (sportId) {
      case 2:
        if (t1 as number < 0 || t2 as number < 0 || t1 as number > 150 || t2 as number > 150) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if (matchPeriod === 'OT' && t1 === t2) {
          message('无效分数', { type: 'error' });
          return false;
        }
        break;
      case 19:
        if (t1 > 30 || t2 > 30 || t1 < 0 || t2 < 0) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if (t1 < 25 && t2 < 25) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if (t1 >= 24 && t2 >= 24 && Math.abs(t1 - t2) !== 2) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if ((t1 < 24 && t2 > 25) || (t2 < 24 && t1 > 25)) {
          message('无效分数', { type: 'error' });
          return false;
        }
        return true;
      case 23:
        if (t1 < 0 || t2 < 0) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if (t1 < 11 && t2 < 11) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if (t1 >= 10 && t2 >= 10 && Math.abs(t1 - t2) !== 2) {
          message('无效分数', { type: 'error' });
          return false;
        }
        if ((t1 < 10 && t2 > 11) || (t2 < 10 && t1 > 11)) {
          message('无效分数', { type: 'error' });
          return false;
        }
        return true;  
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
      let tag = true;
      switch (sportId) {
        case 2:
          ElMessageBox.confirm(
            `<p class='text-center'>${history.state.params?.homeTeamNameCn || '-'} VS ${history.state.params?.awayTeamNameCn || '-'
            } <br />
              <p class="text-center text-2xl text-bold w-full">${NewGoalEvent.t1} : ${NewGoalEvent.t2
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
              if (res.code) {
                message(res.msg, { type: 'error' });
                return false;
              }
              else {
                onSearch();
                return true;
              }
            })
            .catch(() => {
              tag = false;
              return false;
            })
          break;
        case 19:
          ElMessageBox.confirm(
            `<p class='text-center'>${history.state.params?.homeTeamNameCn || '-'} VS ${history.state.params?.awayTeamNameCn || '-'
            } <br />
              <p class="text-center text-2xl text-bold w-full">${NewGoalEvent.t1} : ${NewGoalEvent.t2
            }</p>
              ⼿動結算後無法回退，請再次確認比分</p>
              `,
            `結算第 ${NewGoalEvent.inningNum + 1} 节`,
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: t('確認結算'),
              cancelButtonText: t('取消'),
              center: true
            }
          )
            .then(async () => {
              const res =
                await API.addBadmintonballEvent({
                  ...NewGoalEvent as SattleDataAPI.BadmintonEventReq
                });
              if (res.code) {
                message(res.msg, { type: 'error' });
                return false;
              }
              else {
                onSearch();
                return true;
              }
            })
            .catch(() => {
              tag = false;
            })
          break;
        case 23:
          ElMessageBox.confirm(
            `<p class='text-center'>${history.state.params?.homeTeamNameCn || '-'} VS ${history.state.params?.awayTeamNameCn || '-'
            } <br />
              <p class="text-center text-2xl text-bold w-full">${NewGoalEvent.t1} : ${NewGoalEvent.t2
            }</p>
              ⼿動結算後無法回退，請再次確認比分</p>
              `,
            `結算第 ${NewGoalEvent.inningNum + 1} 节`,
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: t('確認結算'),
              cancelButtonText: t('取消'),
              center: true
            }
          )
            .then(async () => {
              const res =
                await API.addPingPongballEvent({
                  ...NewGoalEvent as SattleDataAPI.BadmintonEventReq
                });
              if (res.code) {
                message(res.msg, { type: 'error' });
                return false;
              }
              else {
                onSearch();
                return true;
              }
            })
            .catch(() => {
              tag = false;
            })
          break;
      }
      return tag;
    }
  }

  onMounted(() => {
    onSearch();
  })
  return {
    renderObj,
    columns,
    dataList,
    sportId,
    allSettleBtnClick,
    getCurrentMatchDetail,
    onAddNewGoalEvent,
    onSearch,
  };
}
