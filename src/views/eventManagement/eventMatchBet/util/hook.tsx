export function useEventMatchBet() {
  const loading = ref(false);
  const matchData = reactive<EventAPI.getMatchStatusticData>(
    {} as EventAPI.getMatchStatusticData
  );

  const loopTimer = ref();

  const form = reactive<{ matchId: number | string }>({
    // matchId: '27568'
    matchId: '275677'
  });

  async function onSearch() {
    const res = await API.getMatchStatistic(form);
    if (res.code) return;
    //- todo
    res.data.bet = res.data.bet.map((item, index) => {
      if (index % 6 === 0) {
        return Math.floor(Math.random() * (100 + 1));
      }
      return item;
    });
    Object.assign(matchData, res.data);
    loop();
  }

  const loop = () => {
    if (loopTimer.value) return;
    loopTimer.value = setInterval(() => onSearch(), 5000);
  };

  onMounted(() => {
    onSearch();
  });

  onUnmounted(() => {
    loopTimer.value && clearInterval(loopTimer.value);
  });

  return {
    loading,
    onSearch,
    form,
    matchData
  };
}
