<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 py-[12px] text-sm">
    <div class="flex items-center">
      <span class="mr-5 font-bold">{{ t('选择数据源') }}:</span>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="188" value="Value A" />
        <el-checkbox :label="t('熊猫')" value="Value B" />
        <el-checkbox :label="t('播控')" value="Value C" />
        <el-checkbox :label="t('操盘')" value="Value C" />
      </el-checkbox-group>
    </div>

    <div class="flex items-center my-4">
      <span class="mr-5 font-bold">{{ t('赔率切换') }}:</span>
      <el-button-group>
        <el-button size="small" type="primary">{{ t('欧赔') }}</el-button>
        <el-button size="small" type="default">{{ t('亚赔') }}</el-button>
        <el-button size="small" type="default">{{ t('马来赔') }}</el-button>
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
          type="default"
          >{{ item.title }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { playMethodsList } from '../utils/map';
const checkList = ref([]);

// import { formatNumber } from '@/utils/formatNumber';
// import dayjs from 'dayjs';
// import { useRenderIcon } from '@/components/ReIcon/src/hooks';
// import Search from '@iconify-icons/ep/search';
// import Refresh from '@iconify-icons/ep/refresh';
// import type { FormInstance, CheckboxValueType } from 'element-plus';
// import { PandaMatch, searchFormType } from '../utils/types';
// import { EVENT_SOURCE } from '../utils/map';
// import { searchFormRules } from '../utils/rule';

// const props = defineProps<{
//   loading: boolean;
//   form: searchFormType;
// }>();
</script>

<style scoped lang="scss"></style>
