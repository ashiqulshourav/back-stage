<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item :label="`${t('商户名')}:`" prop="tenantIds">
          <el-select
              class="!min-w-[200px]"
              :placeholder="t('请选择商户ID，多选项')"
                     multiple
                     v-model="form.tenantIds"
                     clearable
                     @change="search"
          >
            <el-option v-for="item in tenantList" :label="item.tenantName" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item  :label="`${t('风控标签')}:`"  prop="riskControlLabelList">
          <el-select v-model="form.riskControlLabelList"  @change="search" multiple clearable class="!w-[150px]">
            <el-option v-for="item in riskLabelList" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="props.venueType===0"  :label="`${t('赛事类型')}:`" prop="category">
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
            class="!w-[150px]"
            @change="search"
          >
            <el-option :label="t('全部')" :value="''" />
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in gameClassify"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('注单状态')}:`" prop="queryType">
          <el-select class="min-w100"
                  :placeholder="t('请选择状态')"
              v-model="form.queryType"
                     @change="search"
          >
            <el-option label="全部" :value="1"  />
              <el-option v-for="item in Object.entries(betStatusMap)" :label="item[1]" :value="Number(item[0])" :key="item[0]" />
          </el-select>
        </el-form-item>

        <el-form-item :label="`${t('投注阶段')}:`" prop="isInplay">
          <el-select
              v-model="form.isInplay"
              clearable
              class="!w-[100px]"
              @change="search"
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
          <el-select v-model="form.seriesType" clearable class="!w-[100px]" @change="search" >
            <el-option  label="全部" value="" />
            <el-option label="单关" :value="1" />
            <el-option label="单式串关" :value="2" />
            <el-option label="复试串关"  :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.seriesType===2" :label="`${t('单式串关类型')}:`" prop="seriesDetails">
          <el-select class="min-w100"
                     :placeholder="t('请选择串关类型')"
                     multiple
                     v-model="form.seriesDetailsSingle"
                     clearable
          >
            <el-option v-for="item in seriesTypesSingle " :label="item.name" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.seriesType===3" :label="`${t('复试串关类型')}:`" prop="seriesDetails">
          <el-select class="min-w100"
                     :placeholder="t('请选择串关类型')"
                     multiple
                     v-model="form.seriesDetailsDuplex"
                     @change="search"
                     clearable
          >
            <el-option v-for="item in seriesTypesDuplex" :label="item.name" :value="item.value" :key="item.value" />
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
        <el-form-item :label="`${t('联赛名')}:`" prop="leagueName">
          <el-input
              v-model="form.leagueName"
              :placeholder="t('联赛名')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
          <el-input
              v-model="form.matchId"
              :placeholder="t('赛事ID')"
              clearable
              v-enter="search"
              class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('主队')}:`" prop="homeTeamName">
          <el-input
            v-model="form.homeTeamName"
            :placeholder="t('主队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('客队')}:`" prop="awayTeamName">
          <el-input
            v-model="form.awayTeamName"
            :placeholder="t('客队名称')"
            clearable
            v-enter="search"
            class="!w-[150px]"
          />
        </el-form-item>

        <el-form-item :label="`${t('会员账号')}:`" prop="userIdOrName">
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


        <el-form-item :label="`${t('投注额')}:`" prop="minBetAmount">
          <el-input
              v-model="form.minBetAmount"
              :placeholder="t('最小投注额')"
              clearable
              class="!w-[110px]"
              v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('')}-`" prop="maxBetAmount" class="arrange2">
          <el-input
              v-model="form.maxBetAmount"
              :placeholder="t('最大投注额')"
              clearable
              class="!w-[110px]"
              v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('用户输赢金额')}:`" prop="minProfitAmount">
          <el-input
              v-model="form.minProfitAmount"
              :placeholder="t('最小输赢金额')"
              clearable
              class="!w-[110px]"
              v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('')}-`" prop="maxProfitAmount" class="arrange2">
          <el-input
              v-model="form.maxProfitAmount"
              :placeholder="t('最大输赢金额')"
              clearable
              class="!w-[110px]"
              v-enter="search"
          />
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select v-model="form.timeType"  class="!w-[110px]" @change="search">
            <el-option  :label="t('注单时间')" :value="1"  />
            <el-option  :label="t('结算时间')" :value="2"  />
            <el-option  :label="t('比赛时间')" :value="3"  />
          </el-select>
          <CustomDate v-model:val="selectDate"  :start-placeholder="dayjs().startOf('month').format('YYYY-MM-DD')" :end-placeholder="dayjs().startOf('day').format('YYYY-MM-DD')" @changeDate="changeDate" />
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
            <el-button
              type="primary"
              :icon="useRenderIcon(Download)"
              :loading="loading"
              v-if="hasAuth('EXPORT')"
              @click="exportFile()"
            >
              {{ t('导出报表') }}
            </el-button>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import Download from '@iconify-icons/ep/download';
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
  riskLabelList:UserAPI.labelType[];
  form: searchFormType;
  tenantList:[];
  venueType:number
}>();

const formRef = ref();
const selectDate = ref('');
const gameClassify = ref<{ label: string; value: number }[]>(props.venueType===1?ESPORT_ID_MAP:SPORT_ID_MAP);
import {  betStatusMap,seriesTypesSingle,seriesTypesDuplex} from "../util/types";
import {hasAuth} from "@/router/utils";
import CustomDate from "@/components/Form/Custom_date.vue";

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.timeStart = '';
    props.form.timeEnd = '';
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
  search()
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
.min-w100{
  min-width: 100px;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.arrange2{
  margin-left: -25px;
}
</style>
