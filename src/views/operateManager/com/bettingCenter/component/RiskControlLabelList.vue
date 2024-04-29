<template>
  <div v-if="list" class="items-center flex flex-wrap px-1">
    <div v-for="label in list.slice(0, 6).sort((a, b) => a.level - b.level)" :key="label.id" class="custom">
      <el-tag
        :style="`background-color: ${getLabelColor(label.level, 'risk')}`"
        class="rounded-lg w-full py-1"
      >
        {{ label.name }}
      </el-tag>
    </div>
    <div v-if="list?.length > 6">
      <el-popover
        placement="top-end"
        :width="200"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <el-button class="w-full"
            ><el-icon><Plus /></el-icon
          ></el-button>
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
import { Plus } from '@element-plus/icons-vue';
import { useBettingCenterHook } from '../util/hook';

const { list, category, venueType } = defineProps<{
  list: UserAPI.labelType[];
  category: number;
  venueType: number;
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
