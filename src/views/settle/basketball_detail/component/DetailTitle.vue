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
        <template v-if="props.renderObj.unSettlementEvents === 0">
          <span class="mr-2 text-sm">{{ item.title }}:</span>
          <span class="text-sm">{{ item.val }}</span>
        </template>
        <template v-else>
          <el-button type="primary">{{ t('全场结算') }}</el-button>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { SPORT_ID_MAP, MATCH_STATUS } from '@/utils/maps/sports_map';
import { t } from '@/plugins/i18n';

const props = defineProps<{
  renderObj: EsportsSettlementAPI.ESportMatchById;
}>();
console.log(props.renderObj, 'adfadf');
const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    {
      title: t('赛事ID'),
      val: _.matchId
    },
    {
      title: t('联赛'),
      val: _.leagueNameCn
    },
    {
      title: t('开赛时间'),
      val: _.beginTime
    },
    {
      title: t('盘口状态'),
      val: MATCH_STATUS[_.status]
    },
    {
      title: t('赛种'),
      val: SPORT_ID_MAP.find(item => item.value === _.sportId)?.label ?? '-'
    },
    {
      title: t('比赛方'),
      val: `${_.homeTeamNameCn} VS ${_.awayTeamNameCn}`
    },
    { title: t('结算人员'), val: t('baibai') },
    { title: '结算状态', val: '已结算' },
  ];
});
</script>

<style scoped></style>
