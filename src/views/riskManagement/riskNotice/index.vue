<template>
  <div class="flex flex-col">
    <div class="flex items-center mb-5 mt-2">
      <span class="font-bold mr-5">{{ t('待办事项') }}</span>

      <el-switch
        class="mr-10"
        inline-prompt
        active-text="on"
        inactive-text="off"
        v-model="voiceStatus"
      />
      <div class="flex">
        <el-button
          :type="currentSelectTimeIndex === index ? 'primary' : 'info'"
          v-for="(item, index) in timeList"
          :key="index"
          >{{ item }}</el-button
        >
      </div>
    </div>
    <el-row>
      <el-col :span="6">
        <el-statistic :title="t('手动接拒')" :value="268500" />
      </el-col>
      <el-col :span="6">
        <el-statistic :value="138" :title="t('体育注单审核')">
          <template #suffix>/100</template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic :title="t('电竞注单审核')" :value="outputValue" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useTransition } from '@vueuse/core';
const source = ref(0);
const voiceStatus = ref(true);
const outputValue = useTransition(source, {
  duration: 1500
});
source.value = 172000;

const timeList = reactive<number[]>([30, 60, 120, 180]);
const currentSelectTimeIndex = ref<number>(0);
</script>

<style scoped></style>
