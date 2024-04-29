<template>
  <div v-if="list" class="items-center flex flex-wrap px-2 mt-1 gap-1">
    <div v-for="label in list.slice(0, showNumber).sort((a, b) => a.level - b.level)" :key="label.id" class="custom">
      <el-tag
        :style="`background-color: ${getLabelColor(label.level, 'risk')}`"
        class="rounded-lg w-full py-1"
      >
        {{ label.name }}
      </el-tag>
    </div>
    <div v-if="list?.length > showNumber">
      <el-popover
        placement="top-end"
        :width="200"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <span class="py-1 px-2 border border-slate-300 text-slate-500 rounded-full cursor-default">{{ list.length }}</span>
        </template>
        <template #default>
          <div class="flex flex-wrap">
            <div
              v-for="label in list.sort((a, b) => a.level - b.level)"
              :key="label.id"
              class="custom"
            >
              <el-tag
                :style="`background-color: ${getLabelColor(
                  label.level,
                  'risk'
                )}`"
                class="rounded-lg w-full py-1 text-white text-center"
              >
                {{ label.name }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useBettingCenterHook } from '../util/hook';

const { list, category, venueType, showNumber } = defineProps<{
  list: UserAPI.labelType[];
  category: number;
  venueType: number;
  showNumber: number;
}>();

const { getLabelColor } = useBettingCenterHook(category, venueType);
</script>

<style lang="scss">
.el-row {
  row-gap: 0.5rem;
}
.custom {
  flex: 0 0 0;
  max-width: unset;
  .el-tag__content {
    color: white;
  }
}
</style>
