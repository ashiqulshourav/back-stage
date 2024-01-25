<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
        <el-select
          v-model="form.leagueId"
          filterable
          clearable
          class="w-[280px]"
          :placeholder="t('请选择联赛')"
        >
          <el-option
            v-for="item in matchStore.leagueList"
            :key="item.leagueId"
            :label="item.leagueNameCn"
            :value="item.leagueId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('游戏名称')}:`" prop="gameName">
        <el-input
          v-model="form.gameName"
          :placeholder="t('请输入游戏名称')"
          v-enter="search"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('请输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="v => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item :label="`${t('盘口状态')}:`" prop="handicapStatus">
        <el-select
          v-model="form.handicapStatus"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option :label="t('早盘')" :value="0" />
          <el-option :label="t('未开售')" :value="1" />
          <el-option :label="t('滚球中')" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('赛事状态')}:`" prop="handicapStatus">
        <el-select
          v-model="form.handicapStatus"
          clearable
          :placeholder="t('请选择')"
          @change="search"
        >
          <el-option :label="t('早盘')" :value="0" />
          <el-option :label="t('未开售')" :value="1" />
          <el-option :label="t('滚球中')" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('日期选择')}:`" prop="startTime">
        <el-date-picker
          class="ml-4 !w-[260px]"
          v-model="time"
          type="daterange"
          :placeholder="t('请选择')"
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

const formRef = ref();
const emits = defineEmits(['onSearch', 'changeMatchCondition']);
const selectIndex = ref(-1);
const matchStore = useMatchStore();
const time = ref('');
const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: SearchFormType;
    matchCondition: number;
  }>(),
  {}
);

onMounted(() => {
  matchStore.set_lagueList();
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
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
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
