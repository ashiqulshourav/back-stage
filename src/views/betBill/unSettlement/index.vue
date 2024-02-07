<template>
  <div class="p-6">
    <league-detail 
      :currentMatch = "currentMatch"
    />
    <manual-settlement 
      :events="eventStore.eventsList"
    />
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

const eventStore = useEventStore();
const currentMatch = computed(() => {
  return eventStore.currentMatch ? eventStore.currentMatch : null;
});
const router = useRoute();
const { matchId } = router.params;
const getMatchEvents = async () => {
  eventStore.set_CurrentMatch({ matchId: Number(matchId) });
  eventStore.setEventsList({ matchId: Number(matchId) });
};
onMounted(() => {
  getMatchEvents();
});
</script>
