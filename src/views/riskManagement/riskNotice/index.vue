<template>
  <div class="flex flex-col pl-20 pt-10">
    <div class="flex items-center mb-10 mt-2">
      <span class="font-bold mr-5 text-[20px]">{{ t('待办事项') }}</span>

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
          >{{ item }}s</el-button
        >
      </div>
    </div>
    <div class="flex">
      <div class="flex flex-col items-center">
        <span>{{ t('手动接拒') }}</span>
        <span class="text-[30px]">50</span>
      </div>
      <div class="flex mr-10 ml-10 flex-col items-center">
        <span>{{ t('体育注单审核') }}</span>
        <span class="text-[30px]">50</span>
      </div>
      <div class="flex flex-col items-center">
        <span>{{ t('电竞注单审核') }}</span>
        <span class="text-[30px]">50</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useBetStore } from '@/store/bet';

const betStore = useBetStore();

const timeList = reactive<number[]>([30, 60, 120, 180]);
const currentSelectTimeIndex = ref<number>(0);

const voiceStatus = computed({
  set(v: boolean) {
    betStore.set_is_open_voice(v);
  },
  get() {
    return betStore.isOpenVoice;
  }
});
</script>

<style scoped></style>
