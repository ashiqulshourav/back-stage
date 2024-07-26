<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <div class="flex">
      <div>
        <el-form-item prop="tenantIds" :label="`${t('商户名')}:`">
          <el-tree-select
            v-model="props.form.tenantIds"
            :placeholder="t('请选择商户ID，多选项')"
            :data="
              tenantList.map(item => ({
                value: item.id,
                label: item.tenantName
              }))
            "
            @change="search"
            filterable
            clearable
            multiple
            collapse-tags
            :render-after-expand="false"
            show-checkbox
            check-strictly
            check-on-click-node
            style="width: 200px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllMName"
                @change="handleCheckAllMName"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-model="removeAllMName"
                @change="handleRemoveAllMName"
                :disabled="form?.tenantIds.length == 0"
              >
                {{ t('全不选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertMName"
                @change="handleCheckRevertMName"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item :label="`${t('赛种')}:`" prop="sportId">
          <el-select
            v-model="form.sportId"
            :placeholder="t('赛种')"
            class="!w-[160px]"
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
          <el-select
            class="!w-[150px]"
            :placeholder="t('请选择状态')"
            v-model="form.queryType"
            @change="search"
          >
            <el-option
              v-for="item in Object.entries(betStatusMap)"
              :label="item[1]"
              :value="Number(item[0])"
              :key="item[0]"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('投注阶段')}:`" prop="isInplay">
          <el-select
            v-model="form.isInplay"
            clearable
            class="!w-[120px]"
            @change="search"
          >
            <el-option label="全部" value="" />
            <el-option label="滚球" :value="1" />
            <el-option label="早盘" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('过关类型')}:`" prop="seriesType">
          <el-select
            v-model="form.seriesType"
            clearable
            class="!w-[100px]"
            @change="search"
          >
            <el-option :label="t('全部')" value="" />
            <el-option :label="t('单关')" :value="1" />
            <el-option :label="t('单式串关')" :value="2" />
            <el-option :label="t('复试串关')" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.seriesType === 2"
          :label="`${t('单式串关类型')}:`"
          prop="seriesDetails"
        >
          <el-select
            class="min-w100"
            :placeholder="t('请选择串关类型')"
            multiple
            v-model="form.seriesDetailsSingle"
            clearable
          >
            <el-option
              v-for="item in seriesTypesSingle"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.seriesType === 3"
          :label="`${t('复试串关类型')}:`"
          prop="seriesDetails"
        >
          <el-select
            class="min-w100"
            :placeholder="t('请选择串关类型')"
            multiple
            v-model="form.seriesDetailsDuplex"
            @change="search"
            clearable
          >
            <el-option
              v-for="item in seriesTypesDuplex"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
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
        <el-form-item
          :label="`${t('联赛查询')}:`"
          :prop="leagueQuery === 'leagueName' ? 'leagueName' : 'leagueId'"
          class="bold-label"
        >
          <el-select
            v-model="leagueQuery"
            @change="leagueQueryChange"
            class="!w-[100px] flex-shrink-0"
          >
            <el-option :label="t('联赛ID')" value="leagueId" />
            <el-option :label="t('联赛名')" value="leagueName" />
          </el-select>
          <el-input
            class="!w-[200px] flex-shrink-0"
            v-if="leagueQuery === 'leagueId'"
            filterable
            v-enter="search"
            v-model="form.leagueId"
            :placeholder="t('联赛ID')"
          />
          <el-select
            v-else
            v-model="form.leagueName"
            clearable
            filterable
            remote
            @change="search"
            @focus="matchStore.reset_lagueList"
            :remote-method="
              debounce(
                query =>
                  matchStore.search_league_list(query, form.sportId, category),
                1000
              )
            "
            class="!w-[200px] flex-shrink-0"
            :placeholder="t('联赛名')"
            :loading="matchStore.matchSearchLoading"
          >
            <el-option
              v-for="item in category === 0
                ? matchStore.sportLeagueList
                : matchStore.esportLeagueList"
              :key="item.leagueId"
              :label="item.leagueNameCn"
              :value="item.leagueNameCn"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${t('投注IP')}:`" prop="ip">
          <el-input
            v-model="form.ip"
            :placeholder="t('请输入IP')"
            clearable
            :formatter="(v:string) => formatIp(v)"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('用户名/用户ID')}:`" prop="userIdOrName">
          <el-input
            v-model="form.userIdOrName"
            :placeholder="t('请输入用户名/用户ID')"
            clearable
            maxLenght="20"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <!-- <el-form-item :label="`${t('风控标签')}:`" prop="riskControlLabelList">
          <el-select
            v-model="form.riskControlLabelList"
            @change="search"
            multiple
            clearable
            class="!w-[150px]"
          >
            <el-option
              v-for="item in riskLabelList"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item prop="riskControlLabelList" :label="t('风控标签:')">
          <el-tree-select
            v-model="props.form.riskControlLabelList"
            :data="
              riskLabelList.map(item => ({
                value: item.id,
                label: item.name
              }))
            "
            @change="search"
            filterable
            clearable
            multiple
            collapse-tags
            :render-after-expand="false"
            show-checkbox
            check-strictly
            check-on-click-node
            style="width: 200px"
          >
            <template #header>
              <el-checkbox
                v-model="checkAllRLabel"
                @change="handleCheckAllRLabel"
              >
                {{ t('全选') }}
              </el-checkbox>
              <el-checkbox
                v-mode="removeAllRLabel"
                @change="handleRemoveAllRLabel"
                :disabled="form?.riskControlLabelList.length == 0"
              >
                {{ t('全不选') }}
              </el-checkbox>
              <el-checkbox
                v-model="checkRevertRLabel"
                @change="handleCheckRevertRLabel"
              >
                {{ t('反选') }}
              </el-checkbox>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item
          v-if="props.venueType === 0"
          :label="`${t('赛事类型')}:`"
          prop="category"
        >
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
        <el-form-item :label="`${t('注单号')}:`" prop="orderId">
          <el-input
            v-model="form.orderId"
            :placeholder="t('注单流水号')"
            clearable
            :formatter="(v:string) => formatNumber(v, 30)"
            v-enter="search"
            class="!w-[200px]"
          />
        </el-form-item>
        <el-form-item :label="`${t('投注额')}:`" prop="minBetAmount">
          <el-input
            v-model="form.minBetAmount"
            :placeholder="t('最小值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('')}-`" prop="maxBetAmount" class="arrange2">
          <el-input
            v-model="form.maxBetAmount"
            :placeholder="t('最大值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item :label="`${t('用户输赢金额')}:`" prop="minProfitAmount">
          <el-input
            v-model="form.minProfitAmount"
            :placeholder="t('最小值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item
          :label="`${t('')}-`"
          prop="maxProfitAmount"
          class="arrange2"
        >
          <el-input
            v-model="form.maxProfitAmount"
            :placeholder="t('最大值')"
            clearable
            class="!w-[110px]"
            v-enter="search"
          />
        </el-form-item>
        <el-form-item prop="timeType">
          <el-select
            v-model="form.timeType"
            class="!w-[110px]"
            @change="search"
          >
            <el-option :label="t('下注时间')" :value="1" />
            <el-option :label="t('结算时间')" :value="2" />
            <el-option :label="t('开赛时间')" :value="3" />
          </el-select>
          <CustomDate
            v-model:val="selectDate"
            :start-placeholder="
              dayjs()
                .subtract(30, 'day')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            "
            :end-placeholder="
              dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            "
            @changeDate="changeDate"
            :isDateTime="true"
            :format="'YYYY-MM-DD HH:mm:ss'"
          />
        </el-form-item>
        <el-form-item>
          <el-form-item :label="`${t('投注项ID')}:`" prop="betItemId">
            <el-input
              v-model="form.betItemId"
              :placeholder="t('投注项ID')"
              clearable
              class="!w-[180px]"
              v-enter="search"
            />
          </el-form-item>

          <el-button
            type="primary"
            :icon="useRenderIcon(SearchIcon)"
            :loading="loading"
            @click="search"
          >
            {{ t('查询') }}
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
            :loading="downloading"
            v-if="hasAuth('EXPORT')"
            @click="exportFile()"
          >
            {{ t('导出') }}
          </el-button>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import type { FormInstance, CheckboxValueType } from 'element-plus';
import dayjs from 'dayjs';
import { useMatchStore } from '@/store/match';
import { debounce } from '@pureadmin/utils';
import { formatNumber, formatIp } from '@/utils/formatNumber';
import {
  SPORT_ID_MAP,
  ESPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';
import { searchFormType } from '../util/types';
import Download from '@iconify-icons/ep/download';
import { useBetStore } from '@/store/bet';
const matchStore = useMatchStore();

const props = defineProps<{
  loading: boolean;
  riskLabelList: UserAPI.labelType[];
  form: searchFormType;
  tenantList: { name: string; id: number; tenantName: string }[];
  venueType: number;
  category: number;
  downloading: boolean;
}>();

const leagueQuery = ref<'leagueName' | 'leagueId'>('leagueName');

const formRef = ref();
const selectDate = ref('');
const gameClassify = ref<{ label: string; value: number }[]>(
  props.venueType === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP
);
import {
  betStatusMap,
  seriesTypesSingle,
  seriesTypesDuplex
} from '../util/types';
import { hasAuth } from '@/router/utils';
import CustomDate from '@/components/Form/Custom_date.vue';

const emits = defineEmits(['onSearch', 'exportFile']);
const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  selectDate.value = '';
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  props.form.timeStart = dayjs().subtract(30, 'day').startOf('day').valueOf();
  props.form.timeEnd = dayjs().endOf('day').valueOf();
  props.form.betItemId = '';
  props.form.matchId = '';
  leagueQuery.value = 'leagueName';
  search();
};

const changeDate = t => {
  if (!t) {
    props.form.timeStart = '';
    props.form.timeEnd = '';
  } else {
    props.form.timeStart = dayjs(t[0]).valueOf();
    props.form.timeEnd = dayjs(t[1]).valueOf();
  }
  search();
};
const chagenMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = '';
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const exportFile = () => {
  emits('exportFile');
};
//- 操盘管理重置表单为初始值
const setPropsForm = () => {
  Object.assign(props.form, {
    sportId: '',
    userIdOrName: '',
    timeStart: dayjs().startOf('month').valueOf(),
    timeEnd: dayjs().endOf('day').valueOf(),
    orderId: '',
    leagueId: '',
    matchId: '',
    awayTeamName: '',
    homeTeamName: '',
    // status:[],
    betItemId: '',
    isInplay: '',
    seriesType: '',
    category: '',
    timeType: 1,
    leagueName: '',
    tenantIds: [],
    seriesDetailsSingle: [],
    seriesDetailsDuplex: [],
    queryType: 1,
    minBetAmount: '',
    maxBetAmount: '',
    minProfitAmount: '',
    maxProfitAmount: '',
    riskControlLabelList: []
  });
};

/* 添加投注项ID分类 */
const betStore = useBetStore();

watch(
  () => betStore.gameplayData,
  v => {
    if (v.betItemsId) {
      setPropsForm();
      props.form.betItemId = v.betItemsId;
      props.form.matchId = v.matchId as string;
      //- 只查询未结算注单
      props.form.queryType = 3;
      props.form.seriesType = 1;
    }
  },
  {
    immediate: true,
    deep: true
  }
);

onActivated(() => {
  if (betStore.gameplayData.betItemsId) {
    setPropsForm();
    props.form.betItemId = betStore.gameplayData.betItemsId;
    props.form.matchId = betStore.gameplayData.matchId as string;
    props.form.queryType = 3;
    props.form.seriesType = 1;
    search();
  }
});

onDeactivated(() => {
  if (betStore.gameplayData.betItemsId) {
    props.form.betItemId = '';
    props.form.matchId = '';
    props.form.queryType = 1;
    props.form.seriesType = '';
    betStore.set_gameplay_data({
      betItemsId: '',
      matchId: ''
    });
    search();
  }
});

// multiple select for merchant Name
const checkAllMName = ref(false);
const removeAllMName = ref(false);
const checkRevertMName = ref(false);

const handleCheckAllMName = (val: CheckboxValueType) => {
  if (val) {
    props.form.tenantIds = props.tenantList.map(_ => _.id);
  } else {
    props.form.tenantIds = [];
  }
};

const handleRemoveAllMName = (val: CheckboxValueType) => {
  props.form.tenantIds = [];
  removeAllMName.value = false;
};

const handleCheckRevertMName = () => {
  if (true) {
    const oldArray = [...props.form.tenantIds];
    props.form.tenantIds = props.tenantList
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

watch(
  () => props.form.tenantIds,
  val => {
    if (!val || val.length === 0) {
      checkAllMName.value = false;
    } else if (val.length === props.tenantList.length) {
      checkAllMName.value = true;
      removeAllMName.value = false;
    }
  }
);

// multiple select for risk label
const checkAllRLabel = ref(false);
const removeAllRLabel = ref(false);
const checkRevertRLabel = ref(false);

const handleCheckAllRLabel = (val: CheckboxValueType) => {
  if (val) {
    props.form.riskControlLabelList = props.riskLabelList.map(_ => _.id);
    removeAllRLabel.value = false;
  } else {
    props.form.riskControlLabelList = [];
  }
};

const handleRemoveAllRLabel = (val: CheckboxValueType) => {
  props.form.riskControlLabelList = [];
  checkRevertRLabel.value = false;
};
const leagueQueryChange = () => {
  props.form.leagueName = '';
  props.form.leagueId = '';
};

const handleCheckRevertRLabel = () => {
  if (true) {
    const oldArray = [...props.form.riskControlLabelList];
    props.form.riskControlLabelList = props.riskLabelList
      .filter(_ => !oldArray.includes(_.id))
      .map(_ => _.id);
  }
};

watch(
  () => props.form.riskControlLabelList,
  val => {
    if (!val || val.length === 0) {
      checkAllRLabel.value = false;
    } else if (val.length === props.riskLabelList.length) {
      checkAllRLabel.value = true;
      removeAllRLabel.value = false;
    }
  }
);
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
:deep() {
  .bold-label > .el-form-item__label {
    font-weight: 700;
  }
}
</style>
