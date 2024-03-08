<template>
  <div class="flex">
    <el-button
      class="reset-margin"
      link
      type="primary"
      size="small"
      :icon="useRenderIcon('settle')"
      @click="cancelMatchEvent(row, index)"
    >
      {{ t('重新结算') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';

defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
  dataList: SattleDataAPI.newBasketballEventsList[];
  index: number;
}>();

const emits = defineEmits(['cancelMatchEvent', 'resetSettleBtnClick']);

const cancelMatchEvent = (...data) => emits('cancelMatchEvent', ...data);
</script>

<style scoped></style>
