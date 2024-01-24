<template>
  <div class="bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <div class="text-center font-bold text-2xl">{{ t('盘口详情') }}</div>
    <div class="flex justify-center flex-wrap mt-5 pl-[400px]">
      <div v-for="(item, index) in renderList" :key="index" class="w-1/2 mb-2">
        <span class="mr-2">{{ item.title }}:</span>
        <span>{{ item.val }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
const renderList = [
  { title: t('赛事ID'), val: 12312312312312 },
  { title: t('开赛时间'), val: '2021-03-21' },
  { title: t('游戏'), val: '英雄联盟' },
  { title: t('赛事状态'), val: '比赛中' },
  { title: t('联赛'), val: 'LPL 中国职业联四 - 春季赛' },
  { title: t('盘口状态'), val: '已开盘' },
  { title: t('队伍'), val: '西安WE - OMNG' },
  { title: t('结算人员'), val: '手动结算' }
];
</script>

<style scoped></style>
