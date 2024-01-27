<template>
  <div class="bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <div class="text-center font-bold text-2xl">{{ t('盘口详情') }}</div>
    <div class="flex justify-ceter flex-wrap mt-5 pl-[400px]">
      <div v-for="(item, index) in renderList" :key="index" class="w-1/2 mb-2">
        <span class="mr-2">{{ item.title }}:</span>
        <span>{{ item.val }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useMatchStore } from '@/store/match';
import { ESPORT_ID_MAP, ESPORT_MATCH_STATUS } from '@/utils/maps/sports_map';

const matchStore = useMatchStore();

const props = defineProps<{
  renderObj: EsportsSettlementAPI.ESportMatchById;
}>();

const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    { title: t('赛事ID'), val: _.matchId },
    { title: t('开赛时间'), val: _.beginTime },
    {
      title: t('游戏'),
      val: ESPORT_ID_MAP.find(r => r.val === +_.sportId)?.label
    },
    { title: t('赛事状态'), val: ESPORT_MATCH_STATUS[_.status] },
    {
      title: t('联赛'),
      val: matchStore.esportLeagueList.find(_ => _.leagueId === _.leagueId)
        ?.leagueNameCn
    },
    {
      title: t('盘口状态'),
      val: props.renderObj.isSale === 0 ? t('未开盘') : t('已开盘')
    },
    { title: t('队伍'), val: `${_.homeTeamNameCn} - ${_.awayTeamNameCn}` },
    { title: t('结算人员'), val: t('手动结算') }
  ];
});
</script>

<style scoped></style>
