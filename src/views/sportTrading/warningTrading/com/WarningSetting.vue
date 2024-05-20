<template>
  <div class="flex min-w-[300px] flex-col bg-bg_color pt-2 p-3">
    <div class="font-bold mb-3">{{ t('告警设定') }}</div>
    <div class="flex justify-end pr-5">
      <el-button
        v-if="!isShowEdit"
        type="primary"
        @click="changeEditStatus(true)"
        >{{ t('编辑') }}</el-button
      >
      <template v-else>
        <el-button>{{ t('取消') }}</el-button>
        <el-button type="primary">{{ t('保存') }}</el-button>
      </template>
    </div>
    <div class="mt-4">
      <div class="mb-3 flex items-center">
        <span class="mr-5 flex-shrink-0 text-sm">{{ t('投注额告警值') }}</span>
        <span v-if="!isShowEdit">5,000</span>
        <div v-else class="flex flex-grow pr-6">
          <el-input />
        </div>
      </div>
      <div class="mb-3 flex items-center">
        <span class="mr-5 flex-shrink-0 text-sm">{{ t('百分比告警值') }}</span>
        <span v-if="!isShowEdit">20%</span>
        <div v-else class="flex flex-grow items-center">
          <el-input />
          <span class="ml-2">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

const isShowEdit = ref(true);

//- 修改保存状态
const changeEditStatus = (_: boolean) => {
  isShowEdit.value = _;
};
</script>

<style lang="scss">

</style>
