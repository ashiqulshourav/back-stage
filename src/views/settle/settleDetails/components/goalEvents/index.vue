<template>
  <PureTableBar
    :title="t('賽果結算')"
    :columns="props.columns"
  >
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        align-whole="center"
        showOverflowTooltip
        :size="size"
        :row-key="row => row.matchId"
        :data="renderData"
        :columns="dynamicColumns"
        :header-cell-style="tableHeaderStyle"
      >
        <template #matchPeriod="{row}">
          <span>
            {{ MATCH_PERIOD[row.matchPeriod] }}
          </span>
        </template>
        <template #t1="{ row, index }">
          <input
            v-if="isEdit && index === renderData.length - 1"
            class="border w-1/3 mx-auto"
            type="number"
            v-model="NewGoalEvent.t1"
          />
          <span v-else>
            {{ row.t1 }}
          </span>
        </template>
        <template #t2="{ row, index }">
          <input
            class="border w-1/3 mx-auto"
            v-if="isEdit && index === renderData.length - 1"
            type="number"
            v-model="NewGoalEvent.t2"
          />
          <span v-else>
            {{ row.t2 }}
          </span>
        </template>
        <template #eventTime="{ row, index }">
          <el-time-picker
            v-if="isEdit && index === renderData.length - 1"
            v-model="timestamps"
            :placeholder="t('请选择当前录入时间')"
            :disabled="!isEdit"
            value-format="x"
            hover="none"
            :default-value="dayjs().startOf('day').toDate()"
            class="custom-time-picker"
            format="HH:mm:ss"
          />
          <span v-else>{{ dayjs(dayjs(row.eventTime).diff(renderBegintime + 28800000)).format('HH:mm:ss') }}</span>
        </template>
        <template #operation="{ index }">
          <div
            class="flex gap-2 justify-center"
            v-if="isEdit && index === renderData.length - 1"
          >
            <el-button 
              type="primary"
              @click="handleNewEvent"  
            >
              {{t('結算節')}}
            </el-button>
            <el-button
              @click="handleEditEvent"              
            >{{t('取消')}}</el-button>
          </div>
          <span v-else> - </span>
        </template> 
      </pure-table>
    </template>
  </PureTableBar>
  <div class="mt-4">
    <el-button 
      type="primary"
      @click="handleEditEvent"
      >新增局</el-button>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { usePublicHooks } from '@/hooks';
import dayjs from 'dayjs';
import { t } from '@/plugins/i18n';
import { MATCH_PERIOD } from '@/utils/maps/sports_map';

const props = defineProps<{
  columns;
  dataList;
  onAddNewGoalEvent;
}>();
const timestamps = ref(0);
const getMatchPeriod = () => {
  return `Q${props.dataList.length + 1}`;
}
const NewGoalEvent: SattleDataAPI.BasketballEvent = reactive({
  matchId: history.state.params?.matchId,
  t1: 0 as number,
  t2: 0 as number,
  eventTime: 0,
  matchPeriod: getMatchPeriod()
});
const handleEditEvent = () => {
  isEdit.value = true;
  console.log(getMatchPeriod());
  NewGoalEvent.matchPeriod = getMatchPeriod();
}
const isEdit = ref(false);
const renderData = computed(() =>
  isEdit.value ? props.dataList.concat(NewGoalEvent) : props.dataList
)
const { tableHeaderStyle } = usePublicHooks();
const renderBegintime = computed(() => history.state.params?.beginTimeLong)
const handleNewEvent = () => {
  if (timestamps.value)
    NewGoalEvent.eventTime = history.state.params?.beginTimeLong + dayjs(timestamps.value).diff(dayjs(timestamps.value).startOf('day'));
  props.onAddNewGoalEvent(NewGoalEvent);
}

</script>
<style scoped>
</style>