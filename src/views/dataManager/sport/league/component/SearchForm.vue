<template>
  <PlusSearch
    class="bg-bg_color w-[99/100] pl-8 pt-[12px] pb-[12px]"
    v-model="selfForm"
    :columns="columns"
    label-position="right"
    @search="search"
    @reset="handleRest"
    :has-unfold="false"
    labelWidth="auto"
    :defaultValues="defaultValue"
    :searchText="t('筛选')"
    :resetText="t('重置')"
    :searchLoading="loading"
    :rowProps="{ gutter: 10 }"
    :colProps="{ xl: locale === 'zh' ? 5 : 8 }"
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
import { formatNumber, inputRestrictions } from '@/utils/formatNumber';
import { useMatchStore } from '@/store/match';
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
const matchStore = useMatchStore();
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
const handleRest = () => {
  Object.assign(props.form, defaultValue.value);
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const columns: PlusColumn[] = [
  {
    label: t('赛事类型'),
    prop: 'category',
    valueType: 'select',
    options: SPORT_CATEGORY,
    fieldProps: {
      onChange: chagenMatchType
    }
  },
  {
    label: t('游戏种类'),
    prop: 'sportId',
    valueType: 'select',
    options: computed(() => gameClassify.value)
  },
  {
    label: t('联赛ID'),
    prop: 'leagueId',
    fieldProps: {
      formatter: (v: string) => formatNumber(v, 10),
      onChange: search
    }
  },
  {
    label: t('热门排序'),
    prop: 'level',
    fieldProps: {
      formatter: (v: string) => inputRestrictions(v),
      placeholder: t('请输入1-200之间的数字')
    }
  },
  {
    label: t('联赛中文名'),
    prop: 'leagueNameCn',
    fieldProps: { maxlength: 20 }
  },
  {
    label: t('联赛英文名'),
    prop: 'leagueNameEn',
    fieldProps: { maxlength: 30 }
  },
  {
    label: t('国家'),
    prop: 'countryId',
    valueType: 'select',
    options: matchStore.countryList.map(item => ({
      label: item.countryNameCn,
      value: item.countryId
    })),
    fieldProps: {
      onChange: chagenMatchType
    }
  },
  {
    label: t('188数据源联赛杯ID'),
    prop: 'leagueId188Bet'
  }
];
</script>
