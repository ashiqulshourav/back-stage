export function useEventMatchBet() {
  const loading = ref(false);
  const matchData = reactive<EventAPI.getMatchStatusticData>(
    {} as EventAPI.getMatchStatusticData
  );

  const form = reactive<{ matchId: number | string }>({
    // matchId: '27568'
    matchId: '275677'
  });

  async function onSearch(type?: string) {
    const res = await API.getMatchStatistic(form);
    if (res.code) return;
    Object.assign(matchData, res.data);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    onSearch,
    form,
    matchData
  };
}
