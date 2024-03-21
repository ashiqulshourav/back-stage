<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item :label="`${t('赛事类型')}:`" prop="category">
          <el-select
            v-model="form.category"
            :placeholder="t('赛事类型')"
            class="!w-[150px]"
            @change="chagenMatchType"
          >
            <el-option :label="t('全部')" :value="' '" />
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
        <el-form-item :label="`${t('注单状态')}:`" prop="settleStatus">
          <el-select
              v-model="form.settleStatus"
              clearable
              class="!w-[100px]"
          >
            <el-option
                label="全部"
                value=""
            />
            <el-option
                label="已结算"
                :value="1"
            />
            <el-option
                label="未结算"
                :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('投注阶段')}:`" prop="isInplay">
          <el-select
              v-model="form.isInplay"
              clearable
              class="!w-[100px]"
          >
            <el-option
                label="全部"
                value=""
            />
            <el-option
                label="滚球"
                :value="1"
            />
            <el-option
                label="早盘"
                :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('过关类型')}:`" prop="seriesType">
          <el-select
              v-model="form.seriesType"
              clearable
              class="!w-[100px]"
          >
            <el-option
                label="全部"
                value=""
            />
            <el-option
                label="单关"
                :value="1"
            />
            <el-option
                label="串关"
                :value="0"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="`${t('联赛ID')}:`" prop="leagueId">
          <el-input
            v-model="form.leagueId"
            :placeholder="t('联赛ID')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('主队')}:`" prop="homeTeamNameCn">
          <el-input
            v-model="form.homeTeamNameCn"
            :placeholder="t('主队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('客队')}:`" prop="awayTeamNameCn">
          <el-input
            v-model="form.awayTeamNameCn"
            :placeholder="t('客队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>

        <el-form-item :label="`${t('会员账号')}:`" prop="userName">
          <el-input
            v-model="form.userIdOrName"
            :placeholder="t('请输入会员账号/ID')"
            clearable
            maxLenght="20"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('注单流水号')}:`" prop="orderId">
          <el-input
            v-model="form.orderId"
            :placeholder="t('注单流水号')"
            clearable
            :formatter="v => formatNumber(v, 30)"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item prop="selectDateT">
          <el-select v-model="form.timeType"  class="!w-[110px]">
            <el-option  :label="t('注单时间')" :value="1"  />
            <el-option  :label="t('结算时间')" :value="2"  />
            <el-option  :label="t('比赛时间')" :value="3"  />
          </el-select>
          <el-date-picker
            :type="dateRangetType"
            v-model="selectDate"
            :start-placeholder="dayjs().startOf('month').format('YYYY-MM-DD')"
            :end-placeholder="dayjs().endOf('day').format('YYYY-MM-DD')"
            @change="changeDate"
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
          <el-button
            :icon="useRenderIcon(RefreshIcon)"
            @click="resetForm(formRef)"
          >
            {{ t('重置') }}
          </el-button>
        </el-form-item>
      </div>
<!--      <div class="mr-3">
        <el-button
          type="primary"
          :icon="useRenderIcon('exportFill')"
          @click="exportFile()"
          v-if="hasAuth('DOWNLOAD')"
        >
          {{ t('导出报表') }}
        </el-button>
      </div>-->
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance } from 'element-plus';
import dayjs from 'dayjs';
import { formatNumber } from '@/utils/formatNumber';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
import { searchFormType } from '../util/types';
const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const formRef = ref();
const selectDate = ref('');
const dateType = ref(1);
const selectDateType = ref(2); // 1 开赛时间 2 下注时间
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const timeType = ref(1); //时间类型 1: 注单时间 2: 结算时间 3: 比赛时间")
const dateRangetType = computed(() => {
  const o = {
    1: 'daterange',
    2: 'monthrange'
  };
  return o[dateType.value];
});

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  selectDate.value = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const changeDate = t => {

  if (!t) {
    props.form.createTimeStart = '';
    props.form.createTimeEnd = '';
  } else {
    props.form.timeStart = dayjs(t[0]).startOf('day').valueOf();
    props.form.timeEnd = dayjs(t[1]).endOf('day').valueOf();
  }

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

const exportFile = () => {
  emits('exportFile');
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
