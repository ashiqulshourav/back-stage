<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
      <el-select
        v-model="form.leagueId"
        filterable
        class="w-[280px]"
        clearable
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

    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model.trim="form.matchId"
        :placeholder="t('赛事ID')"
        v-enter="searchVal"
        :formatter="v => formatNumber(v)"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('比赛状态')}:`" prop="status">
      <el-select v-model="form.status" :placeholder="t('请选择')" clearable>
        <el-option :label="t('滚球')" value="nover" />
        <el-option :label="t('比赛结束')" value="over" />
        <el-option :label="t('未开始')" value="nobegin" />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('比赛时间')}:`" prop="startTime">
      <el-date-picker
        class="ml-4"
        v-model="form.startTime"
        type="date"
        :placeholder="t('比赛时间')"
        value-format="x"
        format="YYYY-MM-DD"
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
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(icon_serch)"
        :loading="loading"
        @click="searchVal"
      >
        {{ t('筛选') }}
      </el-button>
      <el-button
        :icon="useRenderIcon(icon_refresh)"
        @click="resetForm(formRef)"
      >
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import icon_serch from '@iconify-icons/ep/search';
import icon_refresh from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';
import { SearchFormType } from '../utils/type';
import { useMatchStore } from '@/store/match';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
const formRef = ref();
const matchStore = useMatchStore();

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: SearchFormType;
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
  } else {
    const d = dayjs(t).format('YYYY-MM-DD');
    props.form.startTime = dayjs(t).format('YYYY-MM-DD HH:mm:ss');
    const endTime = new Date(`${d} 23:59:59`);
    props.form.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss');
  }
  searchVal();
};

const emits = defineEmits(['onSearch', 'resetForm', 'changeMatchCondition']);

const searchVal = () => emits('onSearch', 'reload');

const resetForm = formRef => {
  emits('resetForm', formRef);
  emits('onSearch', ...['reload']);
};
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.is-horizontal) {
  display: block !important;
}

:deep(.el-statistic__number) {
  font-size: 14px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
