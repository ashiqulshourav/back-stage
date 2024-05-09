<template>
  <div class="grid grid-cols-5 bg-gray-100 ">
    <div class="place-content-center col-span-1 m-2">
      <div class="text-center text-lg font-bold mb-5">{{ t('正在编辑的赛事信息') }}</div>
      <table class="vertical-table">
        <tr>
          <th>{{ t('赛事ID')}}</th>
          <td>{{ matchSourceDetails.matchId }}</td>
        </tr>
        <tr>
          <th>{{ t('联赛名称')}}</th>
          <td>{{ t(matchSourceDetails.leagueNameCn) }}</td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>{{ t(matchSourceDetails.homeTeamNameCn) }}</td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>{{ t(matchSourceDetails.awayTeamNameCn)  }}</td>
        </tr>
        <tr>
          <th>{{ t('比赛开始时间')}}</th>
          <td>{{ matchSourceDetails.beginTime }}</td>
        </tr>
      </table>
    </div>
    <div class="col-span-4 m-2">
      <SearchForm
        :form="form"
        :loading="loading"
        @on-search="onModalSearch"
      />

      <PureTableBar
        :title="``"
        :columns="matchColumns"
        @refresh="onModalSearch('reload')"
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
            :data="matchInfoDataList"
            :columns="dynamicColumns"
            :header-cell-style="tableHeaderStyle"
          >
            <template #operation="{ row }">
              <el-button
                :type= "row.paringStatus === 0 ? 'success' : 'warning'"
                :size="size"
                @click="openDialog(t('立即匹配'), row)"
              >
                {{ t(row.paringStatus === 0 ? '编辑' : '取消匹配') }}
              </el-button>
            </template>
          </pure-table>
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
import { t } from '@/plugins/i18n';
import { PureTableBar } from '@/components/RePureTableBar';
import { matchCombineHook } from './utils/hook';
import SearchForm from './component/ModalSearchForm.vue';
import { usePublicHooks } from '@/hooks';
import { matchColumns } from './component/TableColumnList';

defineOptions({ name: 'METADATA_LEAGUE' });
const { tableHeaderStyle } = usePublicHooks();

const {
  loading,
  onModalSearch,
  form,
  matchInfoDataList,
} = matchCombineHook();

const props = withDefaults(defineProps<{matchDetail: MatchCombineAPI.matchSourceDetail}>(), {});

const emits = defineEmits(['reloadTable', 'closeDialog']);

const matchSourceDetails = ref(props.matchDetail);

onMounted(() => {
    getMatchDataSourceList();
});

const getMatchDataSourceList = () =>{
    const params = {
        // pageNum:0,
        // pageSize:20,
        // category:0,
    }
    API.getMatchDataSourceList(params).then((res)=>{
        console.log(2222222,res)
    })
}

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

.vertical-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #FFFFFF;
}

.vertical-table th,
.vertical-table td {
  text-align: left;
  padding: 16px;
  border-right: 1px solid #FFFFFF;
}

.vertical-table tr:nth-child(even) {
  background-color: #f2f2f2;
}
.vertical-table tr:nth-child(odd) {
  background-color: #FFFFFF;
}
</style>
