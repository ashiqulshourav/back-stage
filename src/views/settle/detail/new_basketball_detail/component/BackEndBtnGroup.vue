<template>
  <div class="flex" v-if="!row.canceled">
    <!--   v-if="row.settleTimes === 0" -->
    <el-button
      class="reset-margin"
      link
      type="danger"
      size="small"
      :icon="useRenderIcon('cancelIcon')"
      @click="cancelMatchEvent(row.id)"
    >
      {{ t('取消事件') }}
    </el-button>
    <!-- <span v-else>-</span> -->
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';

defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
}>();

const emits = defineEmits(['cancelMatchEvent']);

const cancelMatchEvent = id => emits('cancelMatchEvent', id);
</script>

<style scoped></style>
