<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('输入赛事ID')}`" prop="eventId">
        <el-input
          v-model="form.eventId"
          :placeholder="t('输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="v => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('输入时间段')}:`" prop="startTime">
        <el-date-picker
          v-model="time"
          type="daterange"
          :start-placeholder="t('开始日期')"
          :end-placeholder="t('结束日期')"
          value-format="x"
          format="YYYY-MM-DD"
          @change="changeDate"
        />
      </el-form-item>

      <el-form-item :label="`${t('事件名称')}:`" prop="eventName">
        <el-select
          v-model="form.eventName"
          :placeholder="t('事件名称')"
          clearable
          class="!w-[150px]"
          @change="changeEventName"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in eventNames"
            :key="item.value"
          />
        </el-select>
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
import { formatNumber } from '@/utils/formatNumber';
import dayjs from 'dayjs';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const time = ref('');
const formRef = ref();
const emits = defineEmits(['onSearch']);
const eventNames = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const changeDate = t => {
  if (!t) {
    props.form.startTime = '';
    props.form.endTime = '';
  } else {
    props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
    props.form.endTime = dayjs(t[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  time.value = '';
  props.form.startTime = '';
  props.form.endTime = '';
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const changeEventName = e => {
  // props.form.eventName = '';
};
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
