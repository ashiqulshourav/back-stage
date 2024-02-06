<template>
  <div class="bg-bg_color w-[99/100] pl-8 pb-3 pt-[12px]">
    <div class="text-center font-bold text-2xl mb-3">{{ t('盘口详情') }}</div>
    <el-row>
      <el-col
        class="mb-2"
        v-for="(item, index) in renderList"
        :key="index"
        :span="6"
      >
        <span class="mr-2 text-sm">{{ item.title }}:</span>
        <span class="text-sm">{{ item.val }}</span>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">{{ t('全场结算') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const renderList = computed(() => {
  const _ = history.state.params;
  return [
    { title: t('赛事ID'), val: _.matchId },
    { title: t('联赛'), val: _.leagueNameCn },
    {
      title: t('开赛时间'),
      val: _.beginTime
    },
    { title: t('盘口状态'), val: _.isSale === 0 ? t('未开售') : t('已开售') },
    {
      title: t('赛种'),
      val: SPORT_ID_MAP.find(item => item.value === _.sportId).label
    },
    {
      title: t('比赛方'),
      val: `${_.homeTeamNameCn ?? '_'} VS ${_.awayTeamNameCn ?? '_'}`
    },
    {
      title: '结算状态',
      val: _.fullSettlementStatus === 0 ? t('未结算') : t('已结算')
    }
  ];
});
</script>

<style scoped></style>
