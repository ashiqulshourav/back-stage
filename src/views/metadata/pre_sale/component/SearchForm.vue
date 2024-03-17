<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('赛事类型')}:`" prop="category">
        <el-select
          v-model="form.category"
          :placeholder="t('赛事类型')"
          clearable
          class="!w-[150px]"
          @change="chagenMatchType"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in SPORT_CATEGORY"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('游戏种类')}:`" prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          clearable
          @change="chagenDetailMatchType"
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in gameClassify"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
        <el-select
          v-model="form.leagueId"
          filterable
          clearable
          class="!w-[280px]"
          :placeholder="t('请选择联赛')"
        >
          <el-option
            v-for="item in form.category === 0
              ? matchStore.sportLeagueList
              : matchStore.esportLeagueList"
            :key="item.leagueId"
            :label="item.leagueNameCn"
            :value="item.leagueId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('赛事ID')"
          v-enter="search"
          clearable
          :formatter="v => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('开售状态')}:`" prop="isSale">
        <el-select
          class="!w-[150px]"
          v-model="form.isSale"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option :label="t('开售')" :value="1" />
          <el-option :label="t('未开售')" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('盘口状态')}:`" prop="handicapStatus">
        <el-select
          class="!w-[150px]"
          v-model="form.handicapStatus"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option :label="t('未开售')" :value="0" />
          <el-option :label="t('早盘')" :value="1" />
          <el-option :label="t('滚球')" :value="2" />
          <el-option :label="t('进行中')" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('比赛时间')}:`" prop="startTime">
        <el-button
          v-for="(item, index) in nextDayArr"
          :key="index"
          :type="selectIndex === index ? 'primary' : ''"
          @click="changeSelectDate(index)"
          >{{ item }}</el-button
        >
        <el-date-picker
          class="ml-4"
          v-model="form.startTime"
          type="date"
          :placeholder="t('其他日期')"
          value-format="x"
          format="YYYY-MM-DD"
          :disabled-date="disableDate"
          @change="changeDate"
        />
      </el-form-item>

      <el-form-item prop="endTime" class="!hidden">
        <el-date-picker
          class="ml-4"
          v-model="form.endTime"
          type="date"
          :placeholder="t('其他日期')"
          value-format="x"
          format="YYYY-MM-DD"
          :disabled-date="disableDate"
          @change="changeDate"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { SearchFormType } from '../utils/types';
import dayjs from 'dayjs';
import { disableDate } from '@/utils/formatDate';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';
import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

const formRef = ref();
const emits = defineEmits(['onSearch', 'changeMatchCondition']);
const selectIndex = ref(-1);
const matchStore = useMatchStore();
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: SearchFormType;
    matchCondition: number;
  }>(),
  {}
);

/* const selectTypeList = [
  { val: t('开售管理'), num: 1 },
  { val: t('早盘赛事'), num: 2 },
  { val: t('滚球赛事'), num: 3 }
]; */

onMounted(() => {
  matchStore.set_lagueList(0, 1);
});

const changeDate = t => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
    selectIndex.value = -1;
  } else {
    const d = dayjs(t).format('YYYY-MM-DD');
    selectIndex.value = nextDayArr.value.findIndex(_ => _ === d);
    props.form.startTime = dayjs(t).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  selectIndex.value = -1;
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
};

const changeSelectDate = (_: number) => {
  selectIndex.value = _;
  props.form.startTime = dayjs(nextDayArr.value[_])
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  props.form.endTime = dayjs(nextDayArr.value[_])
    .endOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  matchStore.set_lagueList(type, props.form.sportId);
};
//- 赛种联赛筛选
const chagenDetailMatchType = val => {
  matchStore.set_lagueList(props.form.category as number, val);
};

const nextDayArr = computed(() => {
  const nextDayList = [];
  for (let i = 0; i < 5; i++) {
    nextDayList.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
  }
  return nextDayList;
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
@/utils/formatDate
