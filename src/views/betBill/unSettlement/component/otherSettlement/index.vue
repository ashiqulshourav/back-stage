<template>
  <div class="text-2xl text-black font-bold mt-8">
    其他玩法结算
  </div>
  <pure-table
    align-whole="center"
    :row-key="row => row.home"
    :data="data"
    :columns="otherSettleColumn"
    :header-cell-style="tableHeaderStyle"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useManualUnsettlement } from '../../utils/hook';
import { usePublicHooks } from '@/hooks';


const {
  otherSettleColumn
} = useManualUnsettlement();
const { tableHeaderStyle } = usePublicHooks();

const data = reactive([
  {
    id: '6864894847842113',
    home: 1,
    away: 5,
    time: '2024-0203 18:00:00',
    manager: 'bai bai',
    status: '人工结算',
    operation: ''
  },
  {
    id: '6864894847842113',
    home: 5,
    away: 3,
    time: '2024-0203 18:00:00',
    manager: 'bai bai',
    status: '人工结算',
    operation: ''
  }
]);
</script>