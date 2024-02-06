<template>
  <div class="main">
    <!-- -盘口详情 -->
    <DetiltTitle :renderObj="currentMatch[0]" />

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
              class="border w-1/3 mx-auto" 
              v-if="isEdit && index === renderData.length - 1" 
              type="number"
              v-model="NewEvent.t1"  
            />
            <span v-else>
              {{row.t1}}
            </span>
          </template>
          <template #t2="{ row, index}">
            <input 
              class="border w-1/3 mx-auto" 
              v-if="isEdit && index === renderData.length - 1"
              type="number"
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
              <el-option v-for="(key, value) in restPeriod" :label="key" :value="value" />
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
                @click="cancelEdit"              
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
      @click="setEdit"
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
import { ElMessageBox } from 'element-plus';
defineOptions({ name: 'SETTLE_BASKETBALL_DETAIL' });

const router = useRoute();
const { matchId } = router.params;
const isEdit = ref(false);
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
const restPeriod = computed(() => {
  const tmp = {};
  Object.assign(tmp, MATCH_PERIOD);
  dataList.forEach(obj => {
    delete tmp[obj.matchPeriod];
  }) 
  return tmp;
})
const NewEvent: SattleDataAPI.BasketballEvent = reactive( {
  matchId: Number(matchId),
  eventTime: Date.now(),
  t1: 0,
  t2: 0,
})
const renderData= computed(() => {
  return isEdit.value ? dataList.concat(NewEvent) : dataList;
})
const NewErrorPop = (msg: string) => {
  message(msg, { type: 'error' });
}
const validation = () => {
  if (Number(NewEvent.t1) < 0 || Number(NewEvent.t2) < 0) {
    NewErrorPop("分数不能为负。");
    return false;
  }
  if (dataList.find(item => item.matchPeriod === NewEvent.matchPeriod)) {
    NewErrorPop("本轮得分数据现已存在。");
    return false;
  }
  if (NewEvent.matchPeriod === 'HT') {
    if (!dataList.find(item => item.matchPeriod === 'Q1') || !dataList.find(item => item.matchPeriod === 'Q2')) {
      NewErrorPop("请输入第一轮和第二轮得分。");
      return false;
    }
    let totalHome = 0;
    let totalAway = 0;

    for (const item of dataList) {
      if (item.matchPeriod === 'Q1' || item.matchPeriod === 'Q2') {
        totalHome += Number(item.t1);
        totalAway += Number(item.t2);
      }
    }

    if (totalHome !== Number(NewEvent.t1) || totalAway !== Number(NewEvent.t2)) {
      NewErrorPop("分数不可用。");
      return false;
    }
  }
  if (NewEvent.matchPeriod === 'OT') {
    const total = dataList.find(item => item.matchPeriod === 'FT');
    if (!total) {
      NewErrorPop("请输入全日制成绩。");
      return false;
    }
    if (total.t1 != total.t2) {
      NewErrorPop("分数无效。");
      return false;
    }
  }
  if (NewEvent.matchPeriod === 'FT') {
    if (!dataList.find(item => item.matchPeriod === 'Q1') || !dataList.find(item => item.matchPeriod === 'Q2') || !dataList.find(item => item.matchPeriod === 'Q3') || !dataList.find(item => item.matchPeriod === 'Q4')) {
      NewErrorPop("请先输入所有轮次得分。");
      return false;
    }
    let totalHome = 0;
    let totalAway = 0;

    for (const item of dataList) {
      if (item.matchPeriod !== 'HT' && item.matchPeriod !== 'OT') {
        totalHome += Number(item.t1);
        totalAway += Number(item.t2);
      }
    }

    if (totalHome !== Number(NewEvent.t1) || totalAway !== Number(NewEvent.t2)) {
      NewErrorPop("分数不可用。");
      return false;
    }
  }
  return true;
} 
const handleNewEvent = async () => {
  if (validation()) {
    ElMessageBox.confirm(
      `<p class='text-center'>${currentMatch[0].homeTeamNameCn} VS ${currentMatch[0].awayTeamNameCn} <br />
        <p class="text-center text-2xl text-bold w-full">${NewEvent.t1} : ${NewEvent.t2}</p>
        ⼿動結算後無法回退，請再次確認比分</p>
        `
        ,
        `結算第${MATCH_PERIOD[NewEvent.matchPeriod]}節`,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: t('確認結算'),
          cancelButtonText: t('取消'),
          center: true,
        }
    )
    .then(async () => {
      const res: MetadataAPI.AddBasketballEeventRes = await API.addBasketballEvent({
        matchId: NewEvent.matchId,
        eventTime: Date.now(),
        t1: Number(NewEvent.t1),
        t2: Number(Number(NewEvent.t2)),
        matchPeriod: NewEvent.matchPeriod,
        canceled: 0
      });
      if (res.code) message(res.msg, { type: 'error' });
      else {
        delete restPeriod[NewEvent.matchPeriod];
        isEdit.value = false;
        NewEvent.t1 = 0;
        NewEvent.t2 = 0;
        NewEvent.matchPeriod = ''
        onSearch();

      }
      
    })
    .catch(() => {
      cancelEdit();
    })
  }
}
const setEdit = () => {
  isEdit.value = true;
}
const cancelEdit = () => {
  isEdit.value = false;
}
const { tableHeaderStyle } = usePublicHooks();


onMounted(() => {
  getCurrentMatchDetail(Number(matchId));
  onSearch();
});
</script>

<style scoped></style>
