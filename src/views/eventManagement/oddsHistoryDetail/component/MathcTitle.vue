<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <div class="flex flex-col items-center">
      <div class="tex-xs py-2">
        <span class="mr-1">{{ t('联赛ID') }}:</span>
        <span class="mr-1">{{ matchDetail.leagueId }}</span>
        <span>{{ matchDetail.leagueNameCn }}</span>
      </div>
      <div class="flex items-center justify-center">
        <span>{{ matchDetail.homeTeamNameCn }} ({{ t('主') }})</span>
        <div class="flex mx-6 items-center text-3xl">
          {{ score[0] }} VS {{ score[1] }}
        </div>
        <span>{{ matchDetail.awayTeamNameCn }}（{{ t('客') }}）</span>
      </div>
      <div class="text-sm mb-1">
        {{ MATCH_STATUS[matchDetail.status as keyof typeof MATCH_STATUS] }}
      </div>
      <div class="flex text-sm">
        <span class="mr-1">{{ t('赛事ID') }}:</span>
        <span class="mr-1">{{ matchDetail.matchId }}</span>
        <span class="mr-1">{{ t('比赛时间') }}: </span>
        <span
          >{{ matchDetail.beginTime }}
          {{ WEEK_MAP[dayjs(matchDetail.beginTime).day()] }}</span
        >
      </div>
      <div class="text-sm my-2">
        {{ t('数据有效期') }}: {{ matchDetail.dataValidityPeriod }}{{ t('天') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MATCH_STATUS } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';
import { WEEK_MAP } from '@/utils/formatDate';

const emits = defineEmits(['onSearch', 'exportFile']);
const props = defineProps<{
  matchDetail: EventAPI.oddsHistoryMatchDetailData;
}>();

const score = computed(() => {
  if (!props.matchDetail!.score) return [0, 0];
  return props.matchDetail!.score!.slice(1).split('A').join(',');
});
</script>

<style scoped lang="scss"></style>
