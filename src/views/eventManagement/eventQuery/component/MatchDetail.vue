<template>
  <div
    v-if="matchInfo.matchId"
    class="mt-3 search-form bg-bg_color w-[99/100] pl-8 pt-[12px] flex flex-col"
  >
    <span>{{ matchInfo.league }}</span>
    <span>{{ matchInfo.hTeamName }} vs {{ matchInfo.aTeamName }} </span>
    <span>{{ t('赛事ID ') }}: {{ matchInfo.matchId }}</span>
    <span>{{ t('开赛时间') }}: {{ matchInfo.startDateTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
defineProps<{
  matchInfo: EventAPI.MatchInfo;
}>();
</script>

<style scoped></style>
