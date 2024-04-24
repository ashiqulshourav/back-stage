<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" v-model="form" :inline="true" :model="form">
      <el-form-item prop="ids" :label="t('用户ID： ')">
        <el-select
          v-model="form.ids"
          multiple
          allow-create
          filterable
          default-first-option
          :reserve-keyword="false"
          placeholder="可输入1-50个用户ID，逗号隔开"
          class="!w-[260px] customInput"
        />
      </el-form-item>
      <el-form-item prop="tenantIds" :label="t('商户:')">
        <el-select
          v-model="form.tenantIds"
          :placeholder="t('所属商户')"
          clearable
          multiple
          class="!w-[150px]"
        >
          <el-option
            :label="item.tenantName"
            :value="item.id"
            v-for="item in tenantList"
            :key="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="riskControlLabelList" :label="t('风控标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
          v-model="form.riskControlLabelList"
        >
          <el-option
            v-for="label in labelList.risk"
            :key="label.id"
            :label="label.name"
            :value="label.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="attributeLabelList" :label="t('属性标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
          v-model="form.attributeLabelList"
        >
          <el-option
            v-for="label in labelList.attr"
            :key="label.id"
            :label="label.name"
            :value="label.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="" label="日期范围选择:">
        <Custom_date v-model:val="selectDate" @changeDate="changeDate" />
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

      <el-form-item>
        <el-button v-if="hasAuth('EXPORT')" type="primary"
          >批量编辑标签</el-button
        >
        <el-button v-if="hasAuth('EXPORT')" type="primary"
          >导出用户列表</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import Custom_date from '@/components/Form/Custom_date.vue';
import { hasAuth } from '@/router/utils';
import dayjs from 'dayjs';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import { labelListType, tenantType } from '../utils/types';
import type { FormInstance } from 'element-plus';

const formRef = ref<FormInstance | undefined>();
const emits = defineEmits(['onSearch']);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  category: number;
  labelList: labelListType;
  tenantList: tenantType[];
}>();

const form = ref(props.form);

const selectDate = ref<string[]>(['', '']);

const changeDate = (t: string[]) => {
  if (!t) {
    form.value.beginTime = '';
    form.value.endTime = '';
  } else {
    form.value.beginTime = dayjs(t[0]).format('YYYY-MM-DD');
    form.value.endTime = dayjs(t[1]).format('YYYY-MM-DD');
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  selectDate.value = ['', ''];
  emits('onSearch', 'reload');
};

const search = () => {
  emits('onSearch', 'reload');
};
</script>

<style lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.el-date-editor {
  margin: 0;
}
.el-form-item__label {
  font-weight: 700;
}
.customInput {
  .el-select-dropdown {
    display: none;
  }
  .el-select__suffix {
    display: none;
  }
}
</style>
