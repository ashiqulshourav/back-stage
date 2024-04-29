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

const { list, showNumber } = defineProps<{
  list: UserAPI.labelType[];
  showNumber: number;
}>();

const getLabelColor = (level: number, type: string) => {
    if (type === 'risk') {
      switch (level) {
        case 1:
          return 'rgba(163, 0, 20, 1)';
        case 2:
          return 'rgba(255, 92, 0, 1)';
        case 3:
          return 'rgba(255, 153, 0, 1)';
      }
    } else {
      switch (level) {
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
