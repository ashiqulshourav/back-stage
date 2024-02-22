<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
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
    <el-form-item :label="`${t('热门排序')}:`" prop="level">
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
        class="!w-[280px]"
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import { useMatchStore } from '@/store/match';
import { formatNumber, inputRestrictions } from '@/utils/formatNumber';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const formRef = ref();
const matchStore = useMatchStore();
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);

const emits = defineEmits(['onSearch']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
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
