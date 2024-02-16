<template>
  <template v-if="dataList.length === 0 && !isEdit" class="p-3">
    <h3 class="text-sm mt-8">赛制</h3>
    <div class="flex mt-4">
      <el-button
        @click="editGameRule = 'INNING'"
        size="small"
        :type="gameRule === 'INNING' ? 'primary' : ''"
      >
        {{ t('四节制') }}
      </el-button>
      <el-button
        @click="editGameRule = 'HT'"
        size="small"
        :type="gameRule === 'HT' ? 'primary' : ''"
      >
        {{ t('两节制') }}
      </el-button>
    </div>
  </template>
  <PureTableBar
    :title="t('賽果結算')"
    :columns="props.columns"
    @refresh="props.onSearch()"
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
        <template #matchPeriod="{ row }">
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
          <span v-else>{{
            dayjs(dayjs(row.eventTime).diff(renderBegintime)).format('HH:mm:ss')
          }}</span>
        </template>
        <template #operation="{ index }">
          <div
            class="flex gap-2 justify-center"
            v-if="isEdit && index === renderData.length - 1"
          >
            <el-button type="primary" @click="handleNewEvent">
              {{ t('結算節') }}
            </el-button>
            <el-button @click="isEdit = false">{{ t('取消') }}</el-button>
          </div>
          <span v-else> - </span>
        </template>
      </pure-table>
    </template>
  </PureTableBar>
  <div class="mt-4">
    <el-button type="primary" v-if="checkNoMore()" @click="handleEditEvent">{{
      (gameRule === 'HT' && props.dataList.length == 2) ||
      (gameRule === 'INNING' && props.dataList.length == 4)
        ? '新增加时赛'
        : '新增节'
    }}</el-button>
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
  onSearch;
}>();

const timestamps = ref(0);
const editGameRule = ref('INNING');
const gameRule = computed(() => {
  return props.dataList[0]?.gameRule || editGameRule.value;
});

const getMatchPeriod = () => {
  if (
    (gameRule.value === 'HT' && props.dataList.length == 2) ||
    (gameRule.value === 'INNING' && props.dataList.length == 4)
  ) {
    return 'OT';
  }
  if (gameRule.value === 'HT') {
    return props.dataList.length === 0 ? 'HT' : 'FT';
  }
  return `Q${props.dataList.length + 1}`;
};

const checkNoMore = () => {
  if (isEdit.value) {
    return false;
  }
  if (getMatchPeriod() === 'OT') {
    let diff = 0;
    props.dataList.forEach(event => {
      diff += event.t1 - event.t2;
    });
    if (diff !== 0) return false;
  }
  if (gameRule.value === 'HT' && props.dataList.length > 2) return false;
  if (gameRule.value === 'INNING' && props.dataList.length > 4) return false;
  return true;
};
const NewGoalEvent: SattleDataAPI.MatchEventParams = reactive({
  matchId: history.state.params?.matchId,
  t1: 0 as number,
  t2: 0 as number,
  eventTime: 0,
  gameRule: gameRule,
  matchPeriod: ''
});
const handleEditEvent = () => {
  isEdit.value = true;
  NewGoalEvent.t1 = 0;
  NewGoalEvent.t2 = 0;
  NewGoalEvent.matchPeriod = getMatchPeriod();
};
const isEdit = ref(false);
const renderData = computed(() =>
  isEdit.value ? props.dataList.concat(NewGoalEvent) : props.dataList
);
const { tableHeaderStyle } = usePublicHooks();
const renderBegintime = computed(
  () => history.state.params?.beginTimeLong + 28800000
);
const handleNewEvent = () => {
  if (timestamps.value)
    NewGoalEvent.eventTime =
      history.state.params?.beginTimeLong +
      dayjs(timestamps.value).diff(dayjs(timestamps.value).startOf('day'));
  if (props.onAddNewGoalEvent(NewGoalEvent)) isEdit.value = false;
};
</script>
<style scoped></style>
