<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle :renderObj="currentMatch" />

    <PureTableBar
      :title="t('賽果結算')"
      :columns="columns"
      @refresh="onSearch()"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.matchId"
          :expand-row-keys="expandMatchList"
          :data="renderData"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #t1="{ row, index}">
            <input 
              class="border w-1/3 flex justify-center" 
              v-if="isEdit && index === renderData.length - 1" 
              v-model="NewEvent.t1"  
            />
            <span v-else>
              {{row.t1}}
            </span>
          </template>
          <template #t2="{ row, index}">
            <input 
              class="border w-1/3 flex justify-center" 
              v-if="isEdit && index === renderData.length - 1" 
              v-model="NewEvent.t2"  
            />
            <span v-else>
              {{row.t2}}
            </span>
          </template>
          <template #matchPeriod="{ row, index}">
            <el-select
              :placeholder="t('请选择')"
              v-if="isEdit && index === renderData.length - 1" 
              class="!w-[150px]"
              v-model="NewEvent.matchPeriod"
            >
              <el-option v-for="(key, value) in MATCH_PERIOD" :label="key" :value="value" />
            </el-select>
            <span v-else>
              {{MATCH_PERIOD[row.matchPeriod]}}
            </span>
          </template>
          <template #operation="{ index}">
            <div 
              class="flex gap-2 justify-center" 
              v-if="isEdit && index === renderData.length - 1" 
            >
              <el-button 
                type="primary"
                @click="handleNewEvent"  
              >
                結算節
              </el-button>
              <el-button
                @click="isEdit.value = false"              
              >取消</el-button>
            </div>
            <span v-else>
              -
            </span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <el-button 
      type="primary" 
      class="mt-3 px-24"
      @click="toggleEdit"
    >
      新增節
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';
import { useBasketballDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import { MATCH_PERIOD } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';
defineOptions({ name: 'SETTLE_BASKETBALL_DETAIL' });
const router = useRoute();
const { matchId } = router.params;
const isEdit = ref(false);
const NewEvent: SattleDataAPI.BasketballEvent = reactive( {
  matchId: Number(matchId),
  eventTime: Date.now(),
  t1: 0,
  t2: 0,
  matchPeriod: 'Q1',
})
const renderData= computed(() => {
  return isEdit.value ? dataList.concat(NewEvent) : dataList;
})
const handleNewEvent = async () => {
  const res: MetadataAPI.AddBasketballEeventRes = await API.addBasketballEvent({
    matchId: NewEvent.matchId,
    eventTime: Date.now(),
    t1: 0,
    t2: 0,
    matchPeriod: 'Q1',
    canceled: 0
  });
  if (res.code) message(res.msg, { type: 'error' });
  else {
    isEdit.value = false;
    NewEvent.t1 = 0;
    NewEvent.t2 = 0;
    NewEvent.matchPeriod = 'Q1'
    onSearch();
  }
}
const toggleEdit = () => {
  isEdit.value = true;
}
const { tableHeaderStyle } = usePublicHooks();
const {
  onSearch,
  loading,
  columns,
  dataList,
  pagination,
  handleTableWidthChange,
  handleCurrentChange,
  expandChange,
  expandMatchList,
  currentMatch,
  getCurrentMatchDetail
} = useBasketballDetailHook();

onMounted(() => {
  getCurrentMatchDetail(Number(matchId));
  onSearch();
});
</script>

<style scoped></style>
