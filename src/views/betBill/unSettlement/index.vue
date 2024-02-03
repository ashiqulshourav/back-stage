<template>
  <div class="p-6">
    <league-detail />
    <manual-settlement />
    <other-settlement />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import LeagueDetail from './component/leagueDetail/index.vue';
import ManualSettlement from './component/manualSettlement/index.vue';
import OtherSettlement from './component/otherSettlement/index.vue';
import { useRoute } from 'vue-router';
import { message } from '@/utils/message';

const router = useRoute();
const { matchId } = router.params;
const getMatchEvents = async () => {
  const res = await API.getMatchEvents({ matchId: Number(matchId) });
  if (res.code) return message(res.msg, { type: 'error' });
}; 
onMounted(() => {
  getMatchEvents();
});
</script>
