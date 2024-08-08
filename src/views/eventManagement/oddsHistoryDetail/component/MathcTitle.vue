<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <div class="flex flex-col items-center">
      <div class="tex-xs py-2">
        <span>{{ t('联赛ID') }}:</span>
        <span>564567</span>
        <span>英格兰超级联赛</span>
      </div>
      <div class="flex items-center justify-center">
        <span>纽卡斯尔联（主）</span>
        <div class="flex mx-6 items-center text-3xl">0 VS 0</div>
        <span>纽卡斯尔联（客）</span>
      </div>
      <div class="text-sm mb-1">滚球中</div>
      <div class="flex text-sm">
        <span>{{ t('赛事ID') }}:</span>
        <span>4565</span>
        <span>{{ t('比赛时间') }}</span>
        <span>20204-04-03 2:30 星期三</span>
      </div>
      <div class="text-sm my-2">数据有效期：7天</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
// import { formatNumber } from '@/utils/formatNumber';
// import dayjs from 'dayjs';
// import { useRenderIcon } from '@/components/ReIcon/src/hooks';
// import Search from '@iconify-icons/ep/search';
// import Refresh from '@iconify-icons/ep/refresh';
// import type { FormInstance, CheckboxValueType } from 'element-plus';
// import { PandaMatch, searchFormType } from '../utils/types';
// import { EVENT_SOURCE } from '../utils/map';
// import { searchFormRules } from '../utils/rule';

const time = ref('');
const formRef = ref<FormInstance>();
const emits = defineEmits(['onSearch', 'exportFile']);
const pandaMatchList = reactive<PandaMatch[]>([]);

// const props = defineProps<{
//   loading: boolean;
//   form: searchFormType;
// }>();

const getPandaMatchEventList = async () => {
  const res = await API.getPandaMatchEventList();
  pandaMatchList.push(...res.data);
};

onMounted(() => {
  getPandaMatchEventList();
});

const checkAll = ref(false);
const removeAll = ref(false);
const checkRevert = ref(false);
</script>

<style scoped lang="scss"></style>
