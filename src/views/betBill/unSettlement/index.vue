<template>
  <div class="p-6">
    <league-detail 
      :currentMatch = "currentMatch"
    />
    <manual-settlement />
    <other-settlement />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/store/event';
import LeagueDetail from './component/leagueDetail/index.vue';
import ManualSettlement from './component/manualSettlement/index.vue';
import OtherSettlement from './component/otherSettlement/index.vue';
import { message } from '@/utils/message';

const eventStore = useEventStore();
console.log(eventStore.currentMatch);
const currentMatch = computed(() => {
  return eventStore.currentMatch ? eventStore.currentMatch : null;
});
console.log(currentMatch);
const router = useRoute();
const { matchId } = router.params;
const getMatchEvents = async () => {
  const res = await API.getMatchEvents({ matchId: Number(matchId) });
  if (res.code) return message(res.msg, { type: 'error' });
  console.log(res.data);
};
onMounted(() => {
  getMatchEvents();
  eventStore.set_CurrentMatch({ matchId: Number(matchId) });
});
</script>
