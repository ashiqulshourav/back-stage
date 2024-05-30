<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] px-8 pt-[12px]"
  >
    <div class="mb-6 font-bold">{{ t('用户信息') }}</div>
    <div class="flex">
      <div class="w-11/12 grid grid-cols-4 gap-20 mb-10">
        <div class="col-span-1">
          <div class="grid-cols-2 user-info">
            <div class="labels">{{ t('用户名') }}</div>
            <div class="labels">{{ userData.userName }}</div>
          </div>
          <div class="user-info">
            <div class="labels">{{ t('用户ID') }}</div>
            <div class="labels">{{ userData.userId }}</div>
          </div>
          <div class="user-info">
            <div class="labels">{{ t('用户币种') }}</div>
            <div class="labels">{{ t('人民币') }}</div>
          </div>
        </div>
        <div class="col-span-1">
          <div class="user-info">
            <div class="labels">{{ t('可用余额') }}</div>
            <div class="labels">{{ addThousandSeparator(userData.balance.toFixed(2)) }}</div>
          </div>
        </div>
        <div class="col-span-1">
          <div class="user-info">
            <div class="labels">{{ t('所属商户') }}</div>
            <div class="labels">{{ userData.tenantName }}</div>
          </div>
        </div>
      </div>
      <el-button class="ml-auto" type="primary" @click="openModifyBalanceDialog()">
        {{ t('修改余额') }}
      </el-button>
    </div>
    
    <el-form-item prop="accountChangeTypeCode">
      <el-select
        v-model="form.accountChangeTypeCode"
        :placeholder="`${t('请选择账变类型')}`"
        clearable
        class="!w-[200px]"
      >
        <el-option :label="t('全部')" :value="' '" />
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in accountChangeTypeCodeList"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('账变时间')}:`" prop="createTimeStart">
      <el-date-picker
        type="datetimerange"
        format="YYYY-MM-DD HH:mm:ss"
        v-model="selectDate"
        :start-placeholder="dayjs().startOf('month').format('YYYY-MM-DD')"
        :end-placeholder="dayjs().endOf('day').format('YYYY-MM-DD')"
        @change="changeDate"
      />
    </el-form-item>

    <el-form-item>
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t('重置') }}
      </el-button>
      <el-button
        type="primary"
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t('筛选') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance } from 'element-plus';
import dayjs from 'dayjs';
import { accountChangeRecordSearchFormType, userDataType } from './util/types';
import { accountChangeTypeCodeList } from './columns';
import { addThousandSeparator } from "@/utils/formatNumber";

const props = defineProps<{
  loading: boolean;
  form: accountChangeRecordSearchFormType;
  userData: userDataType;
}>();

// const userInfo = ref(props.userData);

const formRef = ref();
const selectDate = ref();

const emits = defineEmits([
  'onSearch',
  'exportFile',
  'openModifyBalanceDialog'
]);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  // selectDate.value = '';
  // props.form.startCreatedAt = dayjs()
  //   .startOf('month')
  //   .format('YYYY-MM-DD HH:mm:ss');
  // props.form.endCreatedAt = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
  search();
};

const exportFile = () => {
  emits('exportFile');
};

const changeDate = t => {
  if (!t) {
    props.form.startCreatedAt = '';
    props.form.endCreatedAt = '';
  } else {
    props.form.startCreatedAt = dayjs(t[0]).format('YYYY-MM-DD HH:mm:ss');

    props.form.endCreatedAt = dayjs(t[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const openModifyBalanceDialog = () => {
  emits('openModifyBalanceDialog', ...[t('修改余额')]);
};
</script>
<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.min-w100 {
  min-width: 100px;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.arrange2 {
  margin-left: -25px;
}
.user-info {
  display: flex;
  font-size: 14px;
  margin-bottom: 10px;
}
.labels {
  width: 45%;
  grid-column: span 1 / span 1;
}
</style>
