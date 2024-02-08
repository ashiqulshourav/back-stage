import { columns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';

export function useBasketballDetailHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList>({} as SattleDataAPI.getSettlementDataList);

  const isFourRound = ref(true);  
  const matchId = ref(history.state.params.matchId);
  const isEdit = ref(false);

  const onSearch = async () => {
    getCurrentMatchDetail();
    const res: SattleDataAPI.getBasketballEventRes = await API.getBasketballEvents({ matchId: matchId.value });
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表

  const getCurrentMatchDetail = async () => {
    const res:SattleDataAPI.getSettlementListRes = await API.getSettlementList({ matchId: matchId.value });
    if (!res.code) {
      Object.assign(currentMatch, res.data.list[0]);
    }
  };
  const validation = (NewEvent: SattleDataAPI.BasketballEvent) => {
    if (!NewEvent.eventTime || NewEvent.eventTime <= dataList[dataList.length - 1]?.eventTime) {
      message('无效时间', { type: 'error' });
      return false;
    }
    if (Number(NewEvent.t1) < 0 || Number(NewEvent.t2) < 0 || Number(NewEvent.t1) > 300 || Number(NewEvent.t2) > 300) {
      message('无效值', { type: 'error' });
      return false;
    }
    if (NewEvent.t1 < dataList[dataList.length - 1].t1 || NewEvent.t2 < dataList[dataList.length - 1].t2) {
      message('无效值', { type: 'error' });
      return false;
    }
    return true;
  }
  const setNewBasketballEvent = async (NewEvent: SattleDataAPI.BasketballEvent) => {
    if (validation(NewEvent)) {
      ElMessageBox.confirm(
        `<p class='text-center'>${currentMatch.homeTeamNameCn || '-'} VS ${currentMatch.awayTeamNameCn || '-'} <br />
          <p class="text-center text-2xl text-bold w-full">${NewEvent.t1} : ${NewEvent.t2}</p>
          ⼿動結算後無法回退，請再次確認比分</p>
          `
        ,
        `結算第${MATCH_PERIOD[NewEvent.matchPeriod]}節`,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('確認結算'),
          cancelButtonText: t('取消'),
          center: true,
        }
      )
      .then(async () => {
        const res: MetadataAPI.AddBasketballEeventRes = await API.addBasketballEvent({
          matchId: NewEvent.matchId,
          eventTime: NewEvent.eventTime,
          t1: Number(NewEvent.t1),
          t2: Number(Number(NewEvent.t2)),
          matchPeriod: NewEvent.matchPeriod,
          canceled: 0
        });
        if (res.code) message(res.msg, { type: 'error' });
        else {
          isEdit.value = false;
          NewEvent.t1 = 0;
          NewEvent.t2 = 0;
          NewEvent.matchPeriod = ''
          onSearch();
        }
      })
      .catch(() => {
        isEdit.value = false;
      })
    }
  }
  const allSettleBtnClick = () => {
    if (dataList[dataList.length -1]?.t1 === dataList[dataList.length -1]?.t2 || ((isFourRound.value && dataList.length < 4) || (!isFourRound.value && dataList.length < 2))) {
      message('请先完成结算', { type: 'error' });
      return;
    }
    ElMessageBox.confirm(
    `⼿動確認比嚼算全場比賽後，即開始結算
      全場比賽玩法，結算後無法回退。
      `
      ,
      `確認結算全場比賽`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('確認結算'),
        cancelButtonText: t('取消'),
        center: true,
      }
    )
    .then(async () => {
      const res = await API.allBasketballSettlement({ matchId : matchId.value});
      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        onSearch();
      }
    })
  }
  return {
    onSearch,
    isEdit,
    isFourRound,
    columns,
    dataList,
    currentMatch,
    getCurrentMatchDetail,
    setNewBasketballEvent,
    allSettleBtnClick,
  };
}
