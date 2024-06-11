<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item :label="`${t('输入赛事ID')}`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-[150px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search(formRef)"
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

const time = ref('');
const formRef = ref<FormInstance>();
const emits = defineEmits(['onSearch']);

const props = defineProps<{
  loading: boolean;
  form: {
    matchId: number | string;
  };
}>();

// const changeDate = t => {
//   if (!t) {
//     props.form.startTime = '';
//     props.form.endTime = '';
//   } else {
//     props.form.startTime = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');
//     props.form.endTime = dayjs(t[1]).format('YYYY-MM-DD HH:mm:ss');
//   }
//   emits('onSearch', ...['reload']);
// };

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  time.value = '';
  // props.form.startTime = '';
  // props.form.endTime = '';
  // props.form.matchId = '';
  // props.form.dataSourceCode = '';
  // props.form.eventCode = [];
  emits('onSearch', ...['reload']);
};

const search = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async v => {
    if (v) {
      emits('onSearch', ...['reload']);
    }
  });
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
