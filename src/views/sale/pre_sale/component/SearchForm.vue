<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="form.matchId"
        :placeholder="t('赛事ID')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
      <el-input
        v-model="form.matchName"
        :placeholder="t('赛事名称')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('开售状态')}:`" prop="isSale">
      <el-select v-model="form.isSale" :placeholder="t('请选择')">
        <el-option :label="t('关闭')" :value="1" />
        <el-option :label="t('开售')" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('比赛时间')}:`" prop="sportId">
      <el-date-picker
        v-model="form.beginTime"
        type="datetime"
        :placeholder="t('比赛时间')"
        value-format="x"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛种')}:`" prop="sportId">
      <el-select v-model="form.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
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
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { SearchFormType } from '../utils/types';

defineProps<{
  loading: boolean;
  form: SearchFormType;
}>();
const formRef = ref();

const emits = defineEmits(['onSearch']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
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
