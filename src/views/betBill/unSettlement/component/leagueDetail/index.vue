<template>
<div>
  <div class="text-2xl text-black font-bold">
    盘口详情
  </div>
  <div class="grid grid-cols-4 gap-2 mt-4">
    <div class="item">
      <div class="prop">赛事ID</div>
      <div class="value">{{props.currentMatch.matchId}}</div>
    </div>
    <div class="item">
      <div class="prop">联 赛</div>
      <div class="value">{{props.currentMatch.leagueNameCn}}</div>
    </div>
    <div class="item">
      <div class="prop">开赛时间</div>
      <div class="value">{{props.currentMatch.beginTime}}</div>
    </div>
    <div class="item">
      <div class="prop">盘口状态</div>
      <div class="value">{{MATCH_STATUS[props.currentMatch.status]}}</div>
    </div>
    <div class="item">
      <div class="prop">赛种</div>
      <div class="value">{{sportName}}</div>
    </div>
    <div class="item">
      <div class="prop">比赛方</div>
      <div class="value">{{matchName}}</div>
    </div>
    <div class="item">
      <div class="prop">结算人员</div>
      <div class="value">Bai Bai</div>
    </div>
    <div class="item">
      <div class="prop">结算状态</div>
      <div class="value">全场结算</div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { SPORT_ID_MAP, MATCH_STATUS } from '@/utils/maps/sports_map';

const props = defineProps<{
  currentMatch: EsportsSettlementAPI.ESportMatchList;
}>();
console.log(props.currentMatch);
const sportName = computed(() => {
  return SPORT_ID_MAP.find(_ => _.value === props.currentMatch.sportId)?.label ?? '-';
});
const matchName = computed(() => {
  return `${props.currentMatch.homeTeamNameCn} VS ${props.currentMatch.awayTeamNameCn}`
});

</script>
<style scoped>
  .item {
    display: flex;
    gap: 0.5rem;
    color: var(--el-text-color-regular);
  }
  .item .prop {
    width: 20%;
    text-align: justify;
    position: relative;
  }
  .prop::after {
    content: ":";
    position: absolute;
    right: 0;
  }
</style>