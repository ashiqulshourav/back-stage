<template>
  <div class="score_main">
    <el-input
      :disabled="!row.isEdit"
      v-model="row[type]"
      ref="inputRef"
      :formatter="v => formatNumber(v, 4)"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber';
const inputRef = ref();

const props = defineProps<{
  row: any;
  type: string;
}>();

watch(
  () => props.row,
  row => {
    if (row.isEdit && props.type === 't1' && row.t1 === '') {
      nextTick(() => {
        inputRef.value.focus();
      });
    }
  },
  {
    deep: true,
    immediate: true
  }
);
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
