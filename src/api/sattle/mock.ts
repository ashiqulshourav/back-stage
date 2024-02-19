let data = [];
const getHandballEvents = (props: { matchId: number }) => {
  return new Promise<SattleDataAPI.getHandballEventRes>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: data.filter(item => item.matchId === props.matchId),
        msg: '操作成功',
        ts: Date.now()
      });
    }, 1000);
  });
};

const addHandballEvent = (props: SattleDataAPI.MatchEventParams) => {
  return new Promise<MetadataAPI.AddSportEventRes>((resolve, reject) => {
    setTimeout(() => {
      data.push({
        ...props,
        settleType: 1,
        createdBy: 'admin@gmail.com',
        updatedBy: 'admin@gmail.com'
      });
      resolve({ code: 0, ts: Date.now(), msg: '操作成功', data: null });
    }, 1000);
  });
};

const getIceHockeyEvents = (props: { matchId: number }) => {
  return new Promise<SattleDataAPI.getIceHockeyEventRes>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: data.filter(item => item.matchId === props.matchId),
        msg: '操作成功',
        ts: Date.now()
      });
    }, 1000);
  });
};

const addIceHockeyEvent = (props: SattleDataAPI.MatchEventParams) => {
  return new Promise<MetadataAPI.AddSportEventRes>((resolve, reject) => {
    setTimeout(() => {
      data.push({
        ...props,
        settleType: 1,
        createdBy: 'admin@gmail.com',
        updatedBy: 'admin@gmail.com'
      });
      resolve({ code: 0, ts: Date.now(), msg: '操作成功', data: null });
    }, 1000);
  });
};

const getCricketEvents = (props: { matchId: number }) => {
  return new Promise<SattleDataAPI.getCricketEventRes>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: data.filter(item => item.matchId === props.matchId),
        msg: '操作成功',
        ts: Date.now()
      });
    }, 1000);
  });
};

const addCricketEvent = (props: SattleDataAPI.MatchEventParams) => {
  return new Promise<MetadataAPI.AddSportEventRes>((resolve, reject) => {
    setTimeout(() => {
      data.push({
        ...props,
        settleType: 1,
        createdBy: 'admin@gmail.com',
        updatedBy: 'admin@gmail.com'
      });
      resolve({ code: 0, ts: Date.now(), msg: '操作成功', data: null });
    }, 1000);
  });
};

const mockAPI = {
  getHandballEvents,
  addHandballEvent,
  getIceHockeyEvents,
  addIceHockeyEvent,
  getCricketEvents,
  addCricketEvent
};

export default mockAPI;
