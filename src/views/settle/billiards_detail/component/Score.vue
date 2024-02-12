<template>
  <div class="score_main">
    <el-input
      :disabled="!row.isEdit"
      v-model="row[type]"
      :formatter="v => formatNumber(v, 3)"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber';

defineProps<{
  row: any;
  type: string;
}>();
</script>

<style scoped lang="scss">
.score_main {
  display: flex;
  align-items: center;
  :deep() {
    .is-disabled {
      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none;
      }
    }
  }
}
</style>
