<template>
  <div class="flex">
    <!--   v-if="row.settleTimes === 0" -->
    <el-button
      class="reset-margin"
      link
      v-if="isShowCancelBtn"
      type="danger"
      size="small"
      :icon="useRenderIcon('cancelIcon')"
      @click="cancelMatchEvent(row.id, index)"
    >
      {{ t('取消事件') }}
    </el-button>
    <!-- <span v-else>-</span> -->
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';

const props = defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
  dataList: SattleDataAPI.newBasketballEventsList[];
  index: number;
}>();

const emits = defineEmits(['cancelMatchEvent']);

const cancelMatchEvent = (...data) => emits('cancelMatchEvent', ...data);

const isShowCancelBtn = computed(
  () =>
    props.index ===
    props.dataList
      .map((item: SattleDataAPI.newBasketballEventsList) => item.canceled)
      .lastIndexOf(0)
);
</script>

<style scoped></style>
