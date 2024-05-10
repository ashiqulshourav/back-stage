<template>
  <PlusSearch
    class="bg-bg_color w-[99/100] pl-8 pt-[12px] pb-[12px]"
    v-model="selfForm"
    :columns="columns"
    label-position="right"
    @search="search"
    @reset="handleReset"
    :has-unfold="false"
    labelWidth="auto"
    :defaultValues="defaultValue"
    :searchText="t('搜索')"
    :resetText="t('重置')"
    :colProps="{
      xl: locale === 'zh' ? 5 : 8,
      lg: 8,
      md: 8
    }"
    :searchLoading="loading"
    :rowProps="{ gutter: 10 }"
  />
</template>

<script setup lang="ts">
import {
  type PlusColumn,
  type FieldValues,
  PlusSearch
} from 'plus-pro-components';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
import { useTranslationLang } from '@/layout/hooks/useTranslationLang';

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const { locale } = useTranslationLang();
const selfForm = ref<FieldValues>(props.form);
const defaultValue = ref<FieldValues>(JSON.parse(JSON.stringify(props.form)));
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
//- 联赛更改
const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
};

const emits = defineEmits(['onSearch']);
const search = () => {
  Object.assign(props.form, selfForm.value);
  emits('onSearch', ...['reload']);
};
//- 表单重置
const handleReset = () => {
  Object.assign(props.form, defaultValue.value);
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const columns: PlusColumn[] = [
  {
    label: t('数据源'),
    prop: 'dataSource',
    valueType: 'select',
    options: [
      { label: t('全部'), value: '' },
      { label: t('未匹配'), value: '0' },
      { label: t('熊猫'), value: 'PS' },
      { label: t('播控'), value: 'VS' },
    ],
    fieldProps: {
      onChange: chagenMatchType
    }
  },
  {
    label: t('赛种选择'),
    prop: 'sportId',
    valueType: 'select',
    options: computed(() => gameClassify.value)
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('联赛中文名称'),
    prop: 'leagueNameCn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('比赛日期选择'),
    prop: 'competitionDate',
    valueType: 'date-picker',
  },
  {
    label: t('联赛英文名称'),
    prop: 'leagueNameEn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('主队中文名称'),
    prop: 'homeTeamNameCn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('主队英文名称'),
    prop: 'homeTeamNameEn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('客队中文名称'),
    prop: 'awayTeamNameCn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('客队英文名称'),
    prop: 'awayTeamNameEn',
    fieldProps: { maxlength: 30 },
  },
  {
    label: t('匹配方式'),
    prop: 'mathcMethod',
    valueType: 'select',
    options: [
      { label: t('不限'), value: '' },
      { label: t('人工匹配'), value: 2 },
      { label: t('自动匹配'), value: 1 },
    ],
    fieldProps: {
      onChange: chagenMatchType
    }
  },
  {
    label: t('操作人'),
    prop: 'operator',
    fieldProps: { maxlength: 30 },
  },
];
</script>
