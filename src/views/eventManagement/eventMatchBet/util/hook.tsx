export function useEventMatchBet() {
  const loading = ref(false);

  const form = reactive<{ matchId: number | string }>({
    matchId: ''
  });

  async function onSearch(type?: string) {}

  onMounted(() => {
    // onSearch();
  });

  return {
    loading,
    onSearch,
    form
  };
}
