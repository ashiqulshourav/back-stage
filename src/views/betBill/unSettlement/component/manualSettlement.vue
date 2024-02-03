<template>
  <div class="text-2xl text-black font-bold mt-8">
    盘口详情
  </div>
  <pure-table
    align-whole="center"
    :row-key="row => row.home"
    :data="data"
    :columns="columns"
    class="mt-4"
  />
  <el-button
    type="primary"
    class="mt-4"
  >
    新增節
  </el-button>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useManualUnsettlement } from '../utils/hook';

const {
  columns
} = useManualUnsettlement();
console.log(columns);
const data = reactive([
  {
    index: '1',
    home: 1,
    away: 5,
    time: '2024-0203 18:00:00',
    manager: 'bai bai',
    status: '人工结算',
    operation: ''
  },
  {
    index: '2',
    home: 5,
    away: 3,
    time: '2024-0203 18:00:00',
    manager: 'bai bai',
    status: '人工结算',
    operation: ''
  }
]);
</script>