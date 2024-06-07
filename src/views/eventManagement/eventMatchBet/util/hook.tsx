export function useEventMatchBet() {
  const loading = ref(false);

  const form = reactive<{ matchId: number | string }>({
    matchId: ''
  });

  async function onSearch(type?: string) {
    /* /matchData/v1/getMatchStatistic */
    const res = await API.getMatchStatistic(form);
    if (res.code) return;
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    onSearch,
    form
  };
}
