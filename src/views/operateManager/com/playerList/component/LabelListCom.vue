<template>
  <div class="flex justify-between w-full items-center">
    <div class="flex gap-2 flex-wrap">
      <LabelItem
        v-for="label in renderItem"
        :key="label.id"
        :label="label"
        :type="type"
        :expand="!expand"
        @onClose="emits('onClose', label.id, type)"
      />
    </div>
    <div v-if="expand && labels.length > 6" class="w-10">
      <el-popover
        placement="top-end"
        :width="300"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <el-button size="small" class="w-full"
            ><el-icon><Plus /></el-icon
          ></el-button>
        </template>
        <template #default>
          <div class="flex gap-2 flex-wrap">
            <LabelItem
              v-for="label in props.labels"
              :key="label.id"
              :label="label"
              :type="type"
            />
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import LabelItem from './LabelItem.vue';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps<{
  labels: UserAPI.labelType[];
  type: string;
  expand?: boolean;
}>();
const emits = defineEmits(['onClose']);
const renderItem = computed(() => {
  return props.expand ? props.labels.slice(0, 6) : props.labels;
});
</script>
<style lang="scss" scoped></style>
