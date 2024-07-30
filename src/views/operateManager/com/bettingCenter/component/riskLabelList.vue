<template>
  <div v-if="list" class="items-center flex flex-wrap px-2 mt-1 gap-1 min-w-[120px]">
    <div v-for="label in list.slice(0, showNumber).sort((a, b) => a.level - b.level)" :key="label.id" class="custom">
      <el-tag
        v-if="label.name.length <= 4"
        :style="`background-color: ${getLabelColor(label.level, label.labelColor)}`"
        class="rounded-lg w-full py-1"
      >
        {{ label.name, "shourav"}}
      </el-tag>
      <el-tooltip
        v-else
        effect="light"
        :content="label.name"
        placement="top"
      >
        <el-tag :style="`background-color: ${getLabelColor(label.level, label.labelColor)}`">{{ label.name.substring(0, 4), "shourav 2" }}...</el-tag>
      </el-tooltip>
      
    </div>
    <div v-if="list?.length > showNumber">
      <el-popover
        placement="top-end"
        :width="200"
        trigger="hover"
        content="this is over"
      >
        <template #reference>
          <span class="py-1 px-2 border border-slate-300 text-slate-500 rounded-full cursor-default">{{ list.length - 1 }}</span>
        </template>
        <template #default>
          <div class="flex flex-wrap gap-1">
            <div
              v-for="label in list.sort((a, b) => a.level - b.level)"
              :key="label.id"
              class="custom"
            >
              <el-tag
                v-if="label.name.length <= 4"
                :style="`background-color: ${getLabelColor(
                  label.level,
                  label.labelColor
                )}`"
                class="rounded-lg w-full py-1 text-white text-center"
              >
                {{ label.name }}
              </el-tag>
              <el-tooltip
                v-else
                effect="light"
                :content="label.name"
                placement="top"
                :style="`background-color: ${getLabelColor(
                  label.level,
                  label.labelColor
                )}`"
              >
                <el-tag :style="`background-color: ${getLabelColor(label.level, label.labelColor)}`">{{ label.name.substring(0, 4), "shourav 2" }}...</el-tag>
              </el-tooltip>
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


const getLabelColor = (level: number, labelColor?: string) => {
  console.log(labelColor)
  if(labelColor) return labelColor    
  switch(level) {
    case 1: 
      return "#1891FF"
    case 2:
      return "#19BE6B"
    case 3:
      return "#2E4050"
  }
}
</script>

<style lang="scss">
.el-row {
  row-gap: 0.5rem;
}
.custom {
  .el-tag__content {
    color: white;
  }
}
</style>
