<template>
  <div
    class="absolute h-full flex justify-center"
    :style="{ left: index + '%' }"
  >
    <div
      class="absolute w-4 cursor-pointer flex items-center h-full"
      v-if="data.length"
    >
      <el-tooltip placement="top-start" v-for="(s, l) in data" :key="l">
        <template #content>
          <span>{{ t('距离开赛') }}{{ index }}{{ t('分钟后') }}-</span>
          <span class="text-primary">{{ type }}</span>
          <span>{{ t('发生') }}</span>
          <span>{{ eMap[s.type as keyof typeof eMap] }}</span>
          <span>{{ t('事件') }}</span>
        </template>
        <img
          :class="['w-4 h-4', s.type === 'goal' && 'animate-rotate360']"
          :src="IconMap[s.type as keyof typeof IconMap]"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
defineProps<{
  data: EventAPI.EventData[];
  index: number;
  type: string;
}>();

const eMap = {
  goal: t('进球'),
  yellow_card: t('黄牌'),
  corner: t('角球'),
  red_card: t('红牌')
};

//- 图标列表
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red_card.png', import.meta.url).href
};
</script>

<style scoped></style>
