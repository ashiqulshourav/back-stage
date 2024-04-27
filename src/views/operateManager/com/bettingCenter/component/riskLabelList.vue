<template>
      <el-row
          v-if="list"
          class="items-center min-w-[200px]"
          :gutter="20"
      >
        <el-col :span="list?.length > 6 ? 20 : 24">
          <el-row :gutter="5">
            <el-col
                v-for="label in list
                      .slice(0, 6)
                      .sort((a, b) => a.level - b.level)"
                :key="label.id"
                class="custom"
            >
              <el-tag
                  :style="`background-color: ${getLabelColor(
                        label.level,
                        'risk'
                      )}`"
                  class="rounded-lg w-full py-1"
              >
                {{ label.name }}
              </el-tag>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" v-if="list?.length > 6">
          <el-popover
              placement="top-end"
              :width="300"
              trigger="hover"
              content="this is over"
          >
            <template #reference>
              <el-button class="w-full"
              ><el-icon><Plus /></el-icon
              ></el-button>
            </template>
            <template #default>
              <el-row :gutter="5">
                <el-col
                    v-for="label in list.sort(
                          (a, b) => a.level - b.level
                        )"
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
                </el-col>
              </el-row>
            </template>
          </el-popover>
        </el-col>
      </el-row>
</template>
<script setup lang="ts">

import {Plus} from "@element-plus/icons-vue";
const {list} = defineProps<{
  list:UserAPI.labelType[]
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

<style lang="scss"></style>
