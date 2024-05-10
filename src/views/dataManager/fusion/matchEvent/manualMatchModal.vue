<template>
  <div class="text-left text-lg font-bold">{{ t('确认匹配比赛数据？') }}</div>
  <div class="text-left text-m mb-4">{{ t('确认后以下赛事将会完成匹配：') }}</div>
  <div class="flex items-center">
    <div>
      <div class="text-center border border-slate-100 border-b-0">DP</div>
      <table class="border border-slate-100 table">
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
    <IconifyIconOffline class="link-icon" icon="link"/>
    <div>
      <div class="text-center border border-slate-100 border-b-0">
        {{ matchSource.find(_ => _.value == matchSourcePairDetails.dataSourceCode)?.label ?? '-' }}
      </div>
      <table class="border border-slate-100 table">
        <tr>
          <th>{{ t('赛事ID')}}</th>
          <td>{{ matchSourcePairDetails.matchId }}</td>
        </tr>
        <tr>
          <th>{{ t('联赛名称')}}</th>
          <td>
            <div>{{ matchSourcePairDetails.leagueNameCn }}</div>
            <div>{{ matchSourcePairDetails.leagueNameEn ? matchSourcePairDetails.leagueNameEn : '-' }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>
            <div>{{ matchSourcePairDetails.homeTeamNameCn }}</div>
            <div>{{ matchSourcePairDetails.homeTeamNameEn ? matchSourcePairDetails.homeTeamNameEn : '-' }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('客队名称')}}</th>
          <td>
            <div>{{ matchSourcePairDetails.awayTeamNameCn }}</div>
            <div>{{ matchSourcePairDetails.awayTeamNameEn ? matchSourcePairDetails.awayTeamNameEn : '-' }}</div>
          </td>
        </tr>
        <tr>
          <th>{{ t('比赛开始时间')}}</th>
          <td>{{ matchSourcePairDetails.beginTime }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="flex justify-end bg-white mt-4">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="handleMatch">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { matchCombineHook } from './utils/hook';
import { matchSource } from "./utils/map";
import {removeEmptyStringKeys} from "@/utils/utilFn";
import {message} from "@/utils/message";
defineOptions({ name: 'METADATA_LEAGUE' });

const props = withDefaults(defineProps<{
  matchSource: MatchCombineAPI.matchSourceDetail,
  matchSourcePair: MatchCombineAPI.matchSourceDetail,
}>(), {});

const emits = defineEmits(['reloadTable', 'closeDialog']);

const matchSourceDetails = ref(props.matchSource);
const matchSourcePairDetails = ref(props.matchSourcePair)
const handleMatch = ()=>{

  console.log(11111,props.matchSource)
  console.log(222222,props.matchSourcePair)
  const param = {
    dpMatchId: props.matchSource.matchId,
    dpMatchId188bet: props.matchSource.matchId188bet,
    matchId: props.matchSourcePair.matchId,
    matchId188bet: props.matchSourcePair.matchId188bet,
    pairingUser: ""
  }
  const params = { ...removeEmptyStringKeys(param)}
  API.matchPairing(params).then((res)=>{
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if(res.code===0){
      emits('closeDialog');
    }
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

.table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

.table th,
.table td {
  text-align: left;
  padding: 16px;
  border-right: 1px solid #FFFFFF;
}

.table th:last-child,
.table td:last-child {
  border-right: none;
}

.table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tr:nth-child(odd) {
  background-color: #FFFFFF;
}

.link-icon {
  margin: -10px;
  rotate: 90deg;
  height: 30px;
  width: 30px;
}
</style>
