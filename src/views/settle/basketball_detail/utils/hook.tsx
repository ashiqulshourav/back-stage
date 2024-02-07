import { childColumns, columns } from './tableColumnList';
import { ElMessageBox } from 'element-plus';
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';
import dayjs from 'dayjs';

export function useBasketballDetailHook() {
  const dataList = reactive<SattleDataAPI.BasketballEvent[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  
  const matchId = ref(0);
  const isEdit = ref(false);

  const setMatchId = (tmp: string | string[]) => {
    matchId.value = Number(tmp);
  }

  const onSearch = async () => {
    getCurrentMatchDetail(matchId.value);
    const res: SattleDataAPI.getBasketballEventRes = await API.getBasketballEvents({ matchId: matchId.value });
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表

  const getCurrentMatchDetail = async (matchId1: number) => {
    matchId.value = matchId1
    const res:SattleDataAPI.getSettlementListRes = await API.getSettlementList({ matchId: matchId.value });
    if (!res.code && res.data.list[0] !== undefined && res.data.list[0] !== null) {
      currentMatch.length = 0;
      currentMatch.push(res.data.list[0]);
    }
  };

  const setNewBasketballEvent = async (NewEvent: SattleDataAPI.BasketballEvent) => {
    ElMessageBox.confirm(
      `<p class='text-center'>${currentMatch[0].homeTeamNameCn} VS ${currentMatch[0].awayTeamNameCn} <br />
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
      console.log(dayjs(NewEvent.eventTime).format("YYYY-MM-DD HH:mm:ss"));
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
  return {
    onSearch,
    isEdit,
    columns,
    dataList,
    currentMatch,
    getCurrentMatchDetail,
    setNewBasketballEvent,
    childColumns,
    setMatchId
  };
}
