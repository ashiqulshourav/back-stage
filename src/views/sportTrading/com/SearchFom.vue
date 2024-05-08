<template>
  <div class="search-form bg-bg_color w-[99/100] pl-5 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          class="!w-[150px]"
          @change="search"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :loading="searchLoading"
            v-for="item in SPORT_ID_MAP.slice(0, 1)"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="league">
        <el-input
          v-model="form.league"
          :placeholder="t('联赛名称/ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item prop="match">
        <el-input
          v-model="form.match"
          :placeholder="t('赛事名称/ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item prop="startTime">
        <el-button
          v-for="(item, index) in preDayArr"
          :key="index"
          :type="selectIndex === index ? 'primary' : ''"
          @click="changeSelectDate(index)"
          >{{ index === 0 ? t('今日') : item }}</el-button
        >
        <CustomDate v-model:val="selectDate" @changeDate="changeDate" />
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
import { SearchFormType } from '../util/type';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
import CustomDate from '@/components/Form/Custom_date.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const formRef = ref();
const emits = defineEmits(['onSearch']);
const selectIndex = ref(-1);
const searchLoading = ref(false);
const selectDate = ref('');

const props = withDefaults(
  defineProps<{ loading: boolean; form: SearchFormType }>(),
  {}
);

const changeDate = (t: string[]) => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).startOf('day').valueOf();
    props.form.endTime = dayjs(t[1]).endOf('day').valueOf();
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectIndex.value = -1;
  emits('onSearch', ...['reload']);
};

const changeSelectDate = (_: number) => {
  selectIndex.value = _;
  props.form.startTime = dayjs(preDayArr.value[_])
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  props.form.endTime = dayjs(preDayArr.value[_])
    .endOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const preDayArr = computed(() => {
  const preDayList = [];
  for (let i = 0; i < 6; i++) {
    preDayList.push(
      dayjs()
        .add(i, 'day')
        .format(`MM${t('月')}DD${t('日')}`)
    );
  }
  return preDayList;
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
