<template>
  <div class="grid grid-cols-5 bg-gray-100 ">
    <div class="col-span-1 m-2">
      <pure-table
        align-whole="center"
        :data="dataList"
        :columns="eventInfoColumn"
        :stripe=true
      />
    </div>
    <div class="col-span-4 m-2">
      <SearchForm
        :form="form"
        :loading="loading"
        @on-search="onSearch"
        :levelList="levelList"
      />

      <PureTableBar
        :title="``"
        :columns="columns"
        @refresh="onSearch('reload')"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            class="table_container"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            adaptive
            :data="dataList"
            :columns="dynamicColumns"
            :header-cell-style="tableHeaderStyle"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
  <div class="flex justify-center bg-white mt-5">
    <el-button type="primary" @click="closeDialog">{{ t('关闭对话框') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import { PureTableBar } from '@/components/RePureTableBar';
import { useLeague } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { usePublicHooks } from '@/hooks';
import { getLan } from "@/utils/utilFn";

const lan = getLan() ?? 'zh';
defineOptions({ name: 'METADATA_LEAGUE' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  dataList,
  onSearch,
  form,
  levelList
} = useLeague();
// const loading = ref(false);
const leagueTagsId = reactive<ConfigCenterDataAPI.LeagueTagListFetchProps[]>(
  []
);

const columns: TableColumnList = [
  {
    label: t('数据源'),
    prop: 'dataSource'
  },
  {
    label: t('赛事ID'),
    prop: 'matchId'
  },
  {
    label: t('联赛'),
    prop: lan === 'zh' ? 'leagueNameCn' : 'leagueNameEn',
  },
  {
    label: t('主队'),
    prop: lan === 'zh' ? 'homeTeamNameCn' : 'homeTeamNameEn',
  },
  {
    label: t('客队'),
    prop: lan === 'zh' ? 'awayTeamNameCn' : 'awayTeamNameEn',
  },
  {
    label: t('比赛开始时间'),
    prop: 'startTime'
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];

const eventInfoColumn: TableColumnList = [
  {
    label: t('赛事ID'),
    prop: 'matchId'
  },
  {
    label: t('联赛'),
    prop: lan === 'zh' ? 'leagueNameCn' : 'leagueNameEn',
  },
  {
    label: t('主队'),
    prop: lan === 'zh' ? 'homeTeamNameCn' : 'homeTeamNameEn',
  },
  {
    label: t('客队'),
    prop: lan === 'zh' ? 'awayTeamNameCn' : 'awayTeamNameEn',
  },
  {
    label: t('比赛开始时间'),
    prop: 'startTime'
  }
];

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueNameCn: '',
    level: '',
    countryId: '',
    leagueNameEn: '',
    leagueId: '',
    leagueLogo: '',
    sportId: '',
    category: '',
    riskLevel: '',
    isEsportType: false,
    leagueTagsId: []
  })
});

const emits = defineEmits(['reloadTable', 'closeDialog']);

const newFormInline = ref(props.formInline);

onMounted(() => {
  initLeaguetags();
});

//- 获取联赛列表标签
const initLeaguetags = async () => {
  const res = await API.getLeagueTagList({
    category: parseInt(newFormInline.value.category as string),
    sportId: parseInt(newFormInline.value.sportId)
  });
  leagueTagsId.length = 0;
  leagueTagsId.push(...res.data.list);
};

const closeDialog = () => {
  emits('closeDialog');
};
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>
