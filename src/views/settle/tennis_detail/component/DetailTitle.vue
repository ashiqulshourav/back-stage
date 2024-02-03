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
        <template v-if="index !== renderList.length - 1">
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
import { t } from '@/plugins/i18n';
import { ESPORT_ID_MAP, ESPORT_MATCH_STATUS } from '@/utils/maps/sports_map';

const props = defineProps<{
  renderObj: EsportsSettlementAPI.ESportMatchById;
}>();

const renderList = computed(() => {
  const _ = props.renderObj;
  return [
    { title: t('赛事ID'), val: 123123123213 },
    { title: t('联赛'), val: '公开赛-女单' },
    {
      title: t('开赛时间'),
      val: '2024-11-01 18:00:00'
    },
    { title: t('盘口状态'), val: '已开盘' },
    {
      title: t('赛种'),
      val: '网球'
    },
    {
      title: t('比赛方'),
      val: '响亮 VS 立新'
    },
    { title: '结算状态', val: '已结算' },
    { title: t('结算人员'), val: t('baibai') }
  ];
});
</script>

<style scoped></style>
