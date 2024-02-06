<template>
  <div class="text-2xl text-black font-bold mt-8">
    赛果结算
  </div>
  <pure-table
    align-whole="center"
    :row-key="row => row.home"
    :data="scoreData"
    :columns="manualColumn"
    :header-cell-style="tableHeaderStyle"
    class="mt-4"
  />
  <el-button
    type="primary"
    class="mt-4"
    @click="handleEdit"
  >
    新增節
  </el-button>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue';
import { useManualUnsettlement } from '../../utils/hook';
import { usePublicHooks } from '@/hooks';

const props = defineProps<{events}>();
const isEdit = ref(false);
const { manualColumn } = useManualUnsettlement();
const { tableHeaderStyle } = usePublicHooks();

const handleEdit = () => {
  isEdit.value = !isEdit.value;
}
const newEvent = reactive({
  matchId: 44050,
  eventCode: 'goal',
  isEdit: isEdit.value,
  eventTime: Date.now(),
  dataSourceCode: "SK",
  canceled: 0,
  scourceType: 1,
  sportId: 1,
  t1: -1,
  t2: -1
});

const scoreData = computed(() => {
  return isEdit.value ? props.events.matchScoreRecordList.concat(newEvent) : props.events.matchScoreRecordList || [];
});
console.log(scoreData);
</script>
