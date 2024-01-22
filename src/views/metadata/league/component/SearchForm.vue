<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('联赛ID')}:`" prop="leagueId">
      <el-input
        v-model="form.leagueId"
        :placeholder="t('联赛ID')"
        clearable
        v-enter="search"
        :formatter="v => formatNumber(v, 10)"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('联赛等级')}:`" prop="level">
      <el-input
        :formatter="v => inputRestrictions(v)"
        v-model="form.level"
        :placeholder="t('请输入1-200之间的数字')"
        type="number"
        clearable
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('联赛中文名')}:`" prop="leagueNameCn">
      <el-input
        v-model="form.leagueNameCn"
        :placeholder="t('联赛中文名')"
        clearable
        maxLength="20"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('联赛英文名')}:`" prop="leagueNameEn">
      <el-input
        v-model="form.leagueNameEn"
        :placeholder="t('联赛英文名')"
        clearable
        maxLength="30"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('国家')}:`" prop="countryId">
      <el-select
        v-model="form.countryId"
        filterable
        clearable
        class="w-[280px]"
        :placeholder="t('请选择国家')"
      >
        <el-option
          v-for="item in matchStore.countryList"
          :key="item.countryId"
          :label="item.countryNameCn"
          :value="item.countryId"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('188数据源联赛杯ID')}:`" prop="leagueId188Bet">
      <el-input
        v-model="form.leagueId188Bet"
        :placeholder="t('188数据源联赛杯ID')"
        clearable
        :formatter="v => formatNumber(v)"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>
    <el-form-item :label="`${t('赛种')}:`" prop="sportId">
      <el-select v-model="form.sportId" :placeholder="t('赛种')" clearable>
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
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t('筛选') }}
      </el-button>
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import { useMatchStore } from '@/store/match';
import { formatNumber, inputRestrictions } from '@/utils/formatNumber';

defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const formRef = ref();
const matchStore = useMatchStore();

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
