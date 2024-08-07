<template>
  <div class="search-form w_33 bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form" label-width="130px">
      <el-form-item :label="`${t('联赛')}:`" prop="leagueId">
        <el-select
          v-model.lazy="form.leagueId"
          clearable
          filterable
          remote
          @change="search"
          @focus="matchStore.reset_lagueList"
          :remote-method="(query:string)=>matchStore.search_league_list(
                  query.trim(),
                  1,
                  form.category as LeagueClassifyType
                )"
          class="!w-full"
          :placeholder="t('请选择联赛')"
          :loading="matchStore.matchSearchLoading"
        >
          <el-option
            v-for="item in matchStore.sportLeagueList"
            :key="item.leagueId"
            :label="item.leagueNameCn"
            :value="item.leagueId"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
        <el-input
          v-model="form.matchId"
          :placeholder="t('输入赛事ID')"
          v-enter="search"
          clearable
          :formatter="(v:string) => formatNumber(v)"
          class="!w-full"
        />
      </el-form-item>

      <el-form-item :label="`${t('比赛状态')}:`" prop="isSale">
        <el-select
          class="!w-full"
          v-model="form.status"
          clearable
          :placeholder="t('选择比赛状态')"
          @change="search"
        >
          <el-option :label="t('未开始')" :value="1" />
          <el-option :label="t('滚球')" :value="2" />
          <el-option :label="t('比赛结束')" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('比赛时间范围')}:`" prop="startTime">
        <CustomDate
          className="!w-full"
          :placeholder="t('选择时间范围')"
          :disableDate="disableDate"
          :isDateTime="true"
          v-model:val="selectDate"
          @changeDate="changeDate"
          :isShowShortCuts="true"
        />
      </el-form-item>

      <el-form-item :label="`${t('数据有效期')}:`" prop="isSale">
        <el-select
          class="!w-full"
          v-model="selectDate"
          clearable
          :placeholder="t('选择数据有效期天数')"
          @change="search"
        >
          <el-option
            v-for="item in 7"
            :key="item"
            :label="item + t('天')"
            :value="item"
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
          {{ t('搜索') }}
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
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import dayjs from 'dayjs';
import { disableDate } from '@/utils/formatDate';
import { useMatchStore } from '@/store/match';
import { formatNumber } from '@/utils/formatNumber';
import CustomDate from '@/components/Form/Custom_date.vue';

import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  LeagueClassifyType
} from '@/utils/maps/sports_map';

const formRef = ref();
const emits = defineEmits(['onSearch', 'changeMatchCondition']);
const selectIndex = ref(-1);
const matchStore = useMatchStore();
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const selectDate = ref('');

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: searchFormType;
  }>(),
  {}
);

const changeDate = (
  t: (string | number | Date | dayjs.Dayjs | null | undefined)[]
) => {
  if (!t) {
    props.form.timeStart = '';
    props.form.timeEnd = '';
  } else {
    props.form.timeStart = dayjs(t[0]).valueOf();
    props.form.timeEnd = dayjs(t[1]).valueOf();
  }
  search();
};

const resetForm = (formEl: FormInstance | undefined) => {
  props.form.timeStart = '';
  props.form.timeEnd = '';
  formEl?.resetFields();
  selectIndex.value = -1;
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
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

:deep(.odds_history) {
  margin-left: 0 !important;
  max-width: 350px !important;
}

.w_33 {
  :deep() {
    .el-form-item {
      color: red;
      width: 33% !important;
      margin-right: 0;
      &:last-child {
        padding-left: 130px;
      }
    }
  }
}
</style>
