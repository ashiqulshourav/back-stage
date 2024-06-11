export function useEventMatchBet() {
  const loading = ref(false);
  const matchData = reactive<EventAPI.getMatchStatusticData>(
    {} as EventAPI.getMatchStatusticData
  );

  const loopTimer = ref();

  const form = reactive<{ matchId: number | string }>({
    // matchId: '288252'
    matchId: ''
  });

  async function onSearch(type?: string) {
    if (type === 'reload') {
      Object.assign(matchData, {
        beginTime: '',
        homeTeamNameCn: '',
        awayTeamNameCn: '',
        homeTeamLogo: '',
        awayTeamLogo: '',
        bet: [],
        event: []
      });
      clearInterval(loopTimer.value);
      return;
    }
    const res = await API.getMatchStatistic(form);
    if (res.code) return;
    Object.assign(matchData, res.data);
    loop();
  }

  const loop = () => {
    if (loopTimer.value) clearInterval(loopTimer.value);
    loopTimer.value = setInterval(() => onSearch(), 5000);
  };

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
