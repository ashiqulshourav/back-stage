import { columns } from './tableColumnList';
import { ElMessageBox, dayjs } from 'element-plus';
// import { MATCH_PERIOD_TYPES } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';

export function useDetailHook() {
  const dataList = reactive<SattleDataAPI.CricketEvent[]>([]);
  const currentMatch = reactive<SattleDataAPI.getSettlementDataList>(
    {} as SattleDataAPI.getSettlementDataList
  );

  // const isFourRound = ref(true);
  const matchId = ref(history.state.params.matchId);
  const isEdit = ref(false);
  const timestamps = ref(0);

  const onSearch = async () => {
    getCurrentMatchDetail();
    const res: SattleDataAPI.getCricketEventRes = await API.getCricketEvents({
      matchId: matchId.value
    });
    if (!res.code) {
      dataList.length = 0;
      dataList.push(...res.data);
    }
  };

  //- 获取当前展开行结算列表

  const getCurrentMatchDetail = async () => {
    const res: SattleDataAPI.getSettlementListRes = await API.getSettlementList(
      { matchId: matchId.value }
    );
    if (!res.code) {
      Object.assign(currentMatch, res.data.list[0]);
    }
  };
  const validation = (NewEvent: SattleDataAPI.CricketEvent) => {
    if (
      !NewEvent.eventTime ||
      NewEvent.eventTime <= dataList[dataList.length - 1]?.eventTime
    ) {
      message(t('无效时间'), { type: 'error' });
      return false;
    }
    if (
      Number(NewEvent.t1) < 0 ||
      Number(NewEvent.t2) < 0 ||
      Number(NewEvent.t1) > 300 ||
      Number(NewEvent.t2) > 300
    ) {
      message(t('无效值'), { type: 'error' });
      return false;
    }
    return true;
  };
  const getCorrectTime = (tmp: number | string | Date) => {
    const day = new Date(tmp);
    day.setFullYear(1970, 0, 1);
    const currenTime = new Date(currentMatch.beginTime);
    return currenTime.getTime() + day.getTime() + 28800000;
  };
  const setNewEvent = async (NewEvent: SattleDataAPI.CricketEvent) => {
    NewEvent.eventTime = getCorrectTime(timestamps.value);
    console.log(dayjs(NewEvent.eventTime).format('YYYY-MM-DD HH:mm:ss'));
    if (validation(NewEvent)) {
      ElMessageBox.confirm(
        `<p class='text-center'>${currentMatch.homeTeamNameCn || '-'} VS ${
          currentMatch.awayTeamNameCn || '-'
        } <br />
          <p class="text-center text-2xl text-bold w-full">${NewEvent.t1} : ${
          NewEvent.t2
        }</p>
          ⼿动结算后无法回退，请再次确认比分</p>
          `,
        // `結算第${MATCH_PERIOD_TYPES[NewEvent.matchPeriod]}节`,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('确认结算'),
          cancelButtonText: t('取消'),
          center: true
        }
      )
        .then(async () => {
          const res: MetadataAPI.AddSportEventRes = await API.addCricketEvent({
            matchId: NewEvent.matchId,
            eventTime: NewEvent.eventTime,
            t1: Number(NewEvent.t1),
            t2: Number(Number(NewEvent.t2)),
            matchPeriod: NewEvent.matchPeriod,
            canceled: 0
          });
          if (res.code) message(res.msg, { type: 'error' });
          else {
            NewEvent.t1 = 0;
            NewEvent.t2 = 0;
            NewEvent.matchPeriod = '';
            await onSearch();
            isEdit.value = false;
          }
        })
        .catch(() => {
          isEdit.value = false;
        });
    }
  };
  const allSettleBtnClick = () => {
    if (
      dataList[dataList.length - 1]?.t1 === dataList[dataList.length - 1]?.t2 ||
      dataList.length < 2
    ) {
      message(t('请先完成结算'), { type: 'error' });
      return;
    }
    ElMessageBox.confirm(
      t('⼿动确认比嚼算全场比赛后，即开始结算全场比赛玩法，结算后无法回退。'),
      t('确认结算全场比赛'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认结算'),
        cancelButtonText: t('取消'),
        center: true
      }
    ).then(async () => {
      const res = await API.allCricketSettlement({ matchId: matchId.value });
      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        onSearch();
      }
    });
  };
  return {
    onSearch,
    isEdit,
    columns,
    dataList,
    currentMatch,
    timestamps,
    getCurrentMatchDetail,
    setNewEvent,
    allSettleBtnClick
  };
}
