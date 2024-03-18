<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item :label="`${t('联赛ID')}:`" prop="leagueId">
        <el-input
          v-model="form.leagueId"
          :formatter="v => formatNumber(v, 10)"
          :placeholder="t('联赛ID')"
          clearable
          v-enter="search"
          class="!w-[200px]"
        />
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
            v-for="item in ESPORT_ID_MAP.slice(0, 4)"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="`${t('联赛中文名')}:`" prop="leagueNameEn">
        <el-input
          v-model="form.leagueNameCn"
          :placeholder="t('联赛中文名')"
          clearable
          v-enter="search"
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item :label="`${t('联赛英文名')}:`" prop="leagueNameEn">
        <el-input
          v-model="form.leagueNameEn"
          :placeholder="t('联赛英文名')"
          clearable
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
          class="!w-[200px]"
        />
      </el-form-item>
      <!-- <el-form-item :label="`${t('赛种')}:`" prop="sportId">
        <el-select v-model="form.sportId" :placeholder="t('赛种')">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in SPORT_ID_MAP"
            :key="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search()"
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
// import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Refresh from '@iconify-icons/ep/refresh';
import Search from '@iconify-icons/ep/search';
import type { FormInstance } from 'element-plus';
import { SearchFormType } from '../utils/types';
import { formatNumber } from '@/utils/formatNumber';
import { useMatchStore } from '@/store/match';
import { ESPORT_ID_MAP } from '@/utils/maps/sports_map';

defineProps<{
  loading: boolean;
  form: SearchFormType;
}>();

const matchStore = useMatchStore();
const formRef = ref<FormInstance>();
const emits = defineEmits(['onSearch']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};
</script>

<style scoped></style>
