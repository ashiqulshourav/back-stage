import { columns } from './TableColumnList';
<template>
  <el-tag
    @close="emits('onClose')"
    round
    type="info"
    effect="plain"
    :closable="expand && hasAuth('DELUSERLABEL')"
  >
    <div
      :style="`background-color: ${getLabelColor(label.level, type)}`"
      class="w-[10px] h-[10px] rounded-[50%] bg-blue-500"
    />
    <el-text size="small">{{ props.label.name }}</el-text>
  </el-tag>
</template>
<script setup lang="ts">
import { hasAuth } from '@/router/utils';

const props = defineProps<{
  label: UserAPI.labelType;
  type: string;
  expand?: boolean;
}>();
const emits = defineEmits(['onClose']);

const getLabelColor = (label: number, type: string) => {
  if (type === 'risk') {
    switch (label) {
      case 1:
        return 'rgba(163, 0, 20, 1)';
      case 2:
        return 'rgba(255, 92, 0, 1)';
      case 3:
        return 'rgba(255, 153, 0, 1)';
    }
  } else {
    switch (label) {
      case 1:
        return 'rgba(24, 145, 255, 1)';
      case 2:
        return 'rgba(25, 190, 107, 1)';
      case 3:
        return 'rgba(46, 64, 80, 1)';
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-tag__content) {
  display: flex;
  align-items: center;
  column-gap: 0.3rem;
}
</style>
