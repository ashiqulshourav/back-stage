<template>
  <div>
    <SearchFom :form="searchForm" :loading="loading" />
    <div class="bg-bg_color w-[99/100] mt-2 pl-5 pt-[12px]">
      <div class="font-bold">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchFom from './SearchFom.vue';
import { useTradingHook } from '../util/hook';

const { searchForm, loading } = useTradingHook();
const { type } = defineProps<{
  type: 'early' | 'in';
}>();

const title = computed(() =>
  type === 'early' ? t('早盘管理') : t('滚球管理')
);
</script>

<style scoped></style>
