<template>
  <div class="grid grid-cols-5 bg-gray-100 ">
    <div class="col-span-1 m-2">
      <div class="col-span-1 m-2">
      <pure-table
        align-whole="center"
        :data="dataList"
        :columns="eventInfoColumn"
        :stripe=true
      />
    </div>
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
            :pagination="{ ...pagination, pageSizes: [5, 10, 20, 50, 100] }"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="tableHeaderStyle"
            @selection-change="handleSelectionChange"
            @page-size-change="handleTableWidthChange"
            @page-current-change="handleCurrentChange"
          />
        </template>
      </PureTableBar>
      <div class="flex justify-end">
        <el-button @click="cancelDialog">{{ t('取消') }}</el-button>
        <el-button :loading="loading" @click="confirmBtnClick" type="primary">{{
          t('确定')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
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
  pagination,
  onSearch,
  openDialog,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  form,
  levelList
} = useLeague();
const uploadFormFile = ref();
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

const ruleFormRef = ref();
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

const cancelDialog = () => {
  emits('closeDialog');
};

const confirmBtnClick = () => {
  ruleFormRef.value.validate(async (valid: any) => {
    if (valid) {
      loading.value = true;
      if (uploadFormFile.value) {
        let formData = new FormData();
        formData.append('file', uploadFormFile.value);
        formData.append('fileUsageCategory', '3');
        const res = await API.fileUpload(formData);
        if (res.data?.url) {
          newFormInline.value.leagueLogo = res.data?.remoteFileName;
        }
      }
      updateLeague();
    }
  });
};

const updateLeague = async () => {
  const res = await API.updateLeague(newFormInline.value);
  message(res.msg, { type: res.code ? 'error' : 'success' });
  emits('closeDialog', !res.code && 'reload');
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
