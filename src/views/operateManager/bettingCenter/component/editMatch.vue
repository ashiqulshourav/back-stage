<template>
  <div v-if="row.combineOrderDetails.length===1">
    <div class="mt-5">
      <el-text type="primary" >赛事信息</el-text>
    </div>
    <div class="mt-1">{{row.sportNameCn}}/{{row.leagueNameCn}}</div>
    <div class="mt-1">{{t('赛事ID:')}} {{row.matchId}}</div>
    <div class="mt-1">{{t('开赛时间:')}}{{dayjs(row.beginTime ?? Date.now()).format("MM-DD HH:mm:ss")}}</div>
    <div class="mt-5">
      <el-text class="mt-5" type="primary">赛果比分</el-text>
    </div>

    <div class="result_wrap mt-5">
      <div class="result_l">
        <div>{{ row.homeTeamNameCn }}</div>
        <div  class="mt-2 flex max-w-full justify-center">
          <input class="mr-1 text-center"  v-model="homeScore"  type="number"  />
        </div>
      </div>
      <div class="result_r">
        <div>{{ row.awayTeamNameCn }}</div>
        <div  class="mt-2 flex max-w-full justify-center">
          <input class="mr-1 text-center" v-model="awayScore"  type="number"  />
        </div>
      </div>
    </div>
    <div class="mt-5">
      <el-text  type="primary">请选择注单的投注结果</el-text>
      <ul >
         <li class="result_item" v-for="item in resultList">{{item.title}}</li>
      </ul>
    </div>

  </div>
  <div v-else>
    <PureTableBar
        title=""
        :columns="editColumnList"
        class="relative"
        :isShowHeader="false"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
            align-whole="center"
            table-layout="auto"
            class="table_container"
            adaptive
            :data="row.combineOrderDetails"
            :columns="dynamicColumns"
        >
          <template #matchMessage="{ row }">
            <div class="match_item" >
              <div class="mt-1">{{row.sportNameCn}}/{{row.leagueNameCn}}</div>
              <div class="mt-1">{{t('赛事ID:')}} {{row.matchId}}</div>
              <div class="mt-1">{{t('开赛时间:')}}{{dayjs(row.beginTime ?? Date.now()).format("MM-DD HH:mm:ss")}}</div>
            </div>
          </template>
          <template #matchScore="{ row }">
            <div class="result_wrap" >
              <div class="result_l">
                <div>{{ row.homeTeamNameCn }}</div>
                <div  class="mt-2 flex max-w-full justify-center">
                  <input class="mr-1 text-center"  v-model="homeScore"  type="number"  />
                </div>
              </div>
              <div class="result_r">
                <div>{{ row.awayTeamNameCn }}</div>
                <div  class="mt-2 flex max-w-full justify-center">
                  <input class="mr-1 text-center" v-model="awayScore"  type="number"  />
                </div>
              </div>
            </div>
          </template>
          <template #matchResult="{ row }">
            <ul >
              <li class="result_item" v-for="item in resultList">{{item.title}}</li>
            </ul>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>

</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from "dayjs";
import {displayHomeAwayScore,} from "@/utils/formatMatch";
import {PureTableBar} from "@/components/RePureTableBar";
const { row } = defineProps<{
  row: BetOrderAPI.Detail&BetOrderAPI.BetOrderList;
}>();
console.log(33333,row)
const homeScore = ref( displayHomeAwayScore(row.settleScore,row.sportId)?.split('-')[0]||0)
const awayScore = ref( displayHomeAwayScore(row.settleScore,row.sportId)?.split('-')[1]||0)
const resultList=[
  {
    value:1,title:t('赢'),bgColor:'',color:''
  },
  {
    value:2,title:t('输'),bgColor:'',color:''
  },
  {
    value:3,title:t('赢半'),bgColor:'',color:''
  },
  {
    value:4,title:t('输半'),bgColor:'',color:''
  },
  {
    value:5,title:t('走水'),bgColor:'',color:''
  },
]

const  editColumnList=[ {
  label: t("赛事信息"),
  slot: 'matchMessage',
  prop: 'matchMessage',
  align:'left',
},
{
  label: t("赛果比分"),
  slot: 'matchScore',
  align:'left',
  prop: 'result',
},
{
  label: t("投注结果"),
  slot: 'matchResult',
  prop: 'matchResult',
   align:'left',
}]

</script>

<style lang="scss">
.result_wrap{
  display: flex;
  justify-content: center;
  .result_l,.result_r{
    min-width: 150px;
    text-align: center;
  }
}
.result_item{
  margin-top: 10px;
  display: inline-block;
  text-align: center;
  line-height: 25px;
  width: 60px;
  height: 25px;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 12px;
  &:nth-child(1){
    color: red;
    background: rgb(255,220,224);
    border: 1px solid rgb(255,220,224);
  }
  &:nth-child(2){
    color: #FFF;
    background:rgb(167,167,167);
    border: 1px solid rgb(167,167,167);
  }
  &:nth-child(3){
    color: red;
    background: #FFF;
    border: 1px solid red;
  }
  &:nth-child(4){
    color: green;
    background: #FFF;
    border: 1px solid green;
  }
  &:nth-child(5){
    color: blue;
    background: #FFF;
    border: 1px solid blue;
  }
}
</style>
