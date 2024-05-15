<template>
  <div class="text-left text-lg font-bold">
    {{ t('确认' + (matchSourcePairDetails.pairingStatus === 1 ? '取消' : '') +  '匹配比赛数据？') }}
  </div>
  <div class="text-left text-m mb-4">
    {{ t('确认后以下赛事将会完成' + (matchSourcePairDetails.pairingStatus === 1 ? '取消' : '') + '匹配：') }}
  </div>
  <div class="flex items-center">
    <div>
      <div class="vertical-table-title">DP</div>
      <VerticalTable :columns="selectedEventColumns" :dataList="matchSourceDetails"/>
    </div>
    <IconifyIconOffline 
      class="link-icon" 
      :icon="matchSourcePairDetails.pairingStatus === 1 ? 'unlink' : 'link'"
    />
    <div>
      <div class="vertical-table-title">
        {{ matchSource.find(_ => _.value == matchSourcePairDetails.dataSourceCode)?.label ?? '-' }}
      </div>
      <VerticalTable :columns="selectedEventColumns" :dataList="matchSourcePairDetails"/>
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
import { matchSource } from "./utils/map";
import {removeEmptyStringKeys} from "@/utils/utilFn";
import {message} from "@/utils/message";
import { useUserStore } from "@/store/user";
import { matchCombineHook } from './utils/hook';
import { selectedEventColumns } from './component/TableColumnList';
import VerticalTable from '@/components/VerticalTable/index.vue';

const {
  editFrom,
} = matchCombineHook();

const props = withDefaults(defineProps<{
  matchSource: MatchCombineAPI.matchSourceDetail,
  matchSourcePair: MatchCombineAPI.matchSourceDetail,
}>(), {});
const userStore = useUserStore();
const emits = defineEmits(['closeDialog']);
const matchSourceDetails = ref(props.matchSource);
const matchSourcePairDetails = ref(props.matchSourcePair)
const handleMatch = ()=>{
  const param = {
    dpMatchId: props.matchSource.matchId,
    dpMatchId188bet: props.matchSource.matchId188bet,
    matchId: props.matchSourcePair.matchId,
    matchId188bet: props.matchSourcePair.matchId188bet,
    pairingUser: userStore.userInfo.name,
  }
  const params = { ...removeEmptyStringKeys(param)}
  editFrom.sportId=   props?.matchSource?.sportId;
  editFrom.matchId188bet= props?.matchSourcePair.matchId188bet;
  editFrom.matchId=props.matchSourcePair.matchId;
  if (props.matchSourcePair.pairingStatus === 0) {
    API.matchPairing(params).then((res)=>{
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if(res.code===0){
        emits('closeDialog',{matchId:props.matchSourcePair.matchId,pairingStatus:1});
      }
    })
  } else { // 取消匹配
    API.cancelMatchPairing(params).then((res)=>{
      message(res.msg, { type: res.code ? 'error' : 'success' });
      if(res.code===0){
        emits('closeDialog',{matchId:props.matchSourcePair.matchId,pairingStatus:0});
      }
    })
  }
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

.vertical-table-title {
  text-align: center;
  border-width: 1px;
  border-color: rgb(248 250 252);
  border-bottom: 0px;
}

.link-icon {
  margin: -10px;
  rotate: 90deg;
  height: 30px;
  width: 30px;
}
</style>
