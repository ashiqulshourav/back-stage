<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 py-[12px] text-sm">
    <div class="flex items-center">
      <span class="mr-5 font-bold">{{ t('选择数据源') }}:</span>
      <el-checkbox-group v-model="selectData.dataSourceCode">
        <el-checkbox :disabled="true" label="188" value="XJ" />
        <el-checkbox :disabled="true" :label="t('熊猫')" value="PS" />
        <el-checkbox :disabled="true" :label="t('播控')" value="VS" />
        <el-checkbox :disabled="true" :label="t('操盘')" value="Value C" />
      </el-checkbox-group>
    </div>

    <div class="flex items-center my-4">
      <span class="mr-5 font-bold">{{ t('赔率切换') }}:</span>
      <el-button-group>
        <el-button
          size="small"
          :type="selectData.oddsType === 'OU' ? 'primary' : 'default'"
          @click="changeList({ type: 'odds', val: 'OU' })"
          >{{ t('欧赔') }}</el-button
        >
        <el-button
          size="small"
          :type="selectData.oddsType === 'HK' ? 'primary' : 'default'"
          @click="changeList({ type: 'odds', val: 'HK' })"
          >{{ t('亚赔') }}</el-button
        >
        <el-button
          size="small"
          :type="selectData.oddsType === 'ML' ? 'primary' : 'default'"
          @click="changeList({ type: 'odds', val: 'ML' })"
          >{{ t('马来赔') }}</el-button
        >
      </el-button-group>
    </div>

    <div class="flex items-center">
      <span class="mr-5 font-bold">{{ t('选择玩法') }}:</span>
      <div class="flex items-center">
        <el-button
          size="small"
          v-for="item in playMethodsList"
          round
          :key="item.key"
          :type="selectData.kindsCode === item.key ? 'primary' : 'default'"
          @click="changeList({ type: 'kindsCode', val: item.key })"
          >{{ item.title }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { playMethodsList } from '../utils/map';

defineProps<{
  selectData: EventAPI.getMatchEventWithOddsHistoryReqType;
}>();

const emits = defineEmits(['changeList']);

//- 分类切换
const changeList = (d: { type: string; val: string }) => {
  emits('changeList', d);
};
</script>

<style scoped lang="scss"></style>
