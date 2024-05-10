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
          <td>
            <div>{{ matchSourceDetails.leagueNameCn }}</div>
            <div>{{ matchSourceDetails.leagueNameEn }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>
            <div>{{ matchSourceDetails.homeTeamNameCn }}</div>
            <div>{{ matchSourceDetails.homeTeamNameEn }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>
            <div>{{ matchSourceDetails.awayTeamNameCn }}</div>
            <div>{{ matchSourceDetails.awayTeamNameEn }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('比赛开始时间')}}</th>
          <td>{{ matchSourceDetails.beginTime }}</td>
        </tr>
      </table>
    </div>
    <div class="col-span-4 m-2">
      <SearchForm
        :form="editFrom"
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
                @click="openManualMatchDialog(t('匹配确认'), row)"
              >
                {{ row.pairingStatus === 0?t('立即匹配'):t('取消匹配') }}
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
  editFrom,
  openManualMatchDialog,
  matchInfoDataList,
} = matchCombineHook();

const props = withDefaults(defineProps<{rowData: MatchCombineAPI.matchPairingDetail}>(), {});

const emits = defineEmits(['reloadTable', 'closeDialog']);

const matchSourceDetails = ref(props.rowData);
const _matchPairing = (row:MatchCombineAPI.matchSourceDetail)=>{
  console.log('rowData',props.rowData)
  console.log('row',row)
  const params = {
    dpMatchId: props.rowData.matchId,
    dpMatchId188bet: props.rowData.matchId188bet,
    matchId: '327521786928148482',
    matchId188bet: row.matchId188bet,
    pairingUser: ""
  }
  matchPairing(params)
}

onMounted(() => {

  console.log(123123,props?.rowData)
    const date = props?.rowData?.beginTime?.split(' ');
    if(date?.length){
      editFrom.startTime = date[0] +' '+ '00:00:00';
      editFrom.endTime = date[0] +' '+ '23:59:59'
    }
    editFrom.sportId=   props?.rowData?.sportId;
    editFrom.matchId188bet= props?.rowData.matchId188bet;
    editFrom.beginTime

    onModalSearch();
});

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
