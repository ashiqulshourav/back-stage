<template>
  <div v-if="newRow.combineOrderDetails?.length===1">
    <div class="mt-5">
      <el-text type="primary" >{{t('赛事信息')}}</el-text>
    </div>
    <div class="mt-1">{{newRow.combineOrderDetails[0].sportNameCn}}/{{newRow.combineOrderDetails[0].leagueNameCn}}</div>
    <div class="mt-1">{{t('赛事ID:')}} {{newRow.combineOrderDetails[0].matchId}}</div>
    <div class="mt-1">{{t('开赛时间:')}}{{dayjs(newRow.combineOrderDetails[0].beginTime ?? Date.now()).format("MM-DD HH:mm:ss")}}</div>
    <div class="mt-5">
      <el-text class="mt-5" type="primary">{{t('赛果比分')}}</el-text>
    </div>
    <div class="result_wrap mt-5">
      <div class="result_l">
        <div>{{ newRow.combineOrderDetails[0].homeTeamNameCn }}</div>
        <div  class="mt-2 flex max-w-full justify-center">
          <input class="mr-1 text-center"  v-model="newRow.combineOrderDetails[0].betResultHomeScore"  type="number"  />
        </div>
      </div>
      <div class="result_r">
        <div>{{ newRow.combineOrderDetails[0].awayTeamNameCn }}</div>
        <div  class="mt-2 flex max-w-full justify-center">
          <input class="mr-1 text-center" v-model="newRow.combineOrderDetails[0].betResultAwayScore"  type="number"  />
        </div>
      </div>
    </div>
    <div class="mt-5">
      <el-text  type="primary">{{t('请选择注单的投注结果')}}</el-text>
      <ul class="mt-2 cursor-pointer">
         <li v-for="item in resultList" :class="`result_item ${item?.value===newRow.combineOrderDetails[0].betResult?'result_item_active':''}`" @click="selectBetResult(0,item.value)" >{{item.title}}</li>
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
      <template v-slot="{ dynamicColumns }">
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
                  <input class="mr-1 text-center"  v-model="row.betResultHomeScore"  type="number"  />
                </div>
              </div>
              <div class="result_r">
                <div>{{ row.awayTeamNameCn }}</div>
                <div  class="mt-2 flex max-w-full justify-center">
                  <input class="mr-1 text-center" v-model="row.betResultAwayScore"  type="number"  />
                </div>
              </div>
            </div>
          </template>
          <template #matchResult="{ row }">
            <ul >
              <li v-for="item in resultList" :class="`result_item ${item?.value===row.betResult?'result_item_active':''}`" @click="selectBetResult(0,item.value)">{{item.title}}</li>
            </ul>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
  <div class="flex justify-end mt-10">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="confirmClick">{{
        t('确定')
      }}</el-button>
  </div>

</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from "dayjs";
import {BET_RESULT_TYPE_MAP, displayHomeAwayScore, EBetResultType,} from "@/utils/formatMatch";
import {PureTableBar} from "@/components/RePureTableBar";
import {ElMessageBox} from "element-plus";
const { row } = defineProps<{
  row: BetOrderAPI.Detail&BetOrderAPI.BetOrderList;
}>();

const newRow =ref<BetOrderAPI.Detail&BetOrderAPI.BetOrderList>(formatRow() as BetOrderAPI.Detail&BetOrderAPI.BetOrderList);
const emits = defineEmits(['closeDialog']);
const selectBetResult = (index:number,betResult:number)=>{
  // @ts-ignore
  newRow.value.combineOrderDetails[index].betResult= betResult;
}
function formatRow (){
  // @ts-ignore
   row.combineOrderDetails?.map((item:BetOrderAPI.Detail,index:number)=>{
       item.betResultHomeScore = displayHomeAwayScore(item.settleScore,row.sportId,'seprate','home');
       item.betResultAwayScore = displayHomeAwayScore(item.settleScore,row.sportId,'seprate','away');
       item.index= index;
       return item
     })
  return row
}
const resultList=[
  {
    value:EBetResultType.WIN,title:BET_RESULT_TYPE_MAP[EBetResultType.WIN]
  },
  {
    value:EBetResultType.LOSE,title:BET_RESULT_TYPE_MAP[EBetResultType.LOSE]
  },
  {
    value:EBetResultType.WIN_HALF,title:BET_RESULT_TYPE_MAP[EBetResultType.WIN_HALF]
  },
  {
    value:EBetResultType.LOSE_HALF,title:BET_RESULT_TYPE_MAP[EBetResultType.LOSE_HALF]
  },
  {
    value:EBetResultType.FLAT,title:BET_RESULT_TYPE_MAP[EBetResultType.FLAT]
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
const closeDialog = ()=>{
  emits('closeDialog');
}
const confirmClick = ()=>{
  ElMessageBox.confirm(
      `
    <div class="text-center">
        <div class="confirm_title text-base font-semibold">${t('您确定要更改此注单的投注结果？')}</div>
        <div class="confirm_content text-sm ml-2 mt-4">${t('重要提示：')}</div>
        <div class="confirm_content text-sm  ml-2 mt-2 mb-4">${t('重新结算操作会影响派彩经手动修改投注结果的注单，无法再使用程序二次结算。')}</div>
    </div>
    `,
      t(`操作提示`),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('确认'),
        cancelButtonText: t('取消'),
        center: true
      }
  )
      .then(async () => {
        const betOrderDetails= newRow.value.combineOrderDetails.map((item:BetOrderAPI.Detail)=>{
          const detailId:string = item.detailId;
          const settleScore:string= 'H'+item.betResultHomeScore+'A'+item.betResultAwayScore;
          return{detailId,settleScore,betResult:item.betResult}
        })
        const params:any = {
          id:newRow.value.id,
          betOrderDetails,
        }
        console.log(2222,params)
        API.betSettle(params).then((res)=>{
          console.log(11111111,res)
          if(res.code===0){

          }
        })


      })
      .catch(() => {

      });


}

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
  //color: blue;
    background: #FFF;
    border: 1px solid #CCC;
  &.result_item_active{
    border: 1px solid blue;
    color: blue;
  }
  //&:nth-child(1){
  //  color: red;
  //  background: rgb(255,220,224);
  //  border: 1px solid rgb(255,220,224);
  //}
  //&:nth-child(2){
  //  color: #FFF;
  //  background:rgb(167,167,167);
  //  border: 1px solid rgb(167,167,167);
  //}
  //&:nth-child(3){
  //  color: red;
  //  background: #FFF;
  //  border: 1px solid red;
  //}
  //&:nth-child(4){
  //  color: green;
  //  background: #FFF;
  //  border: 1px solid green;
  //}
  //&:nth-child(5){
  //  color: blue;
  //  background: #FFF;
  //  border: 1px solid blue;
  //}
}
.confirm_title{
  font-size: 16px;
}
.confirm_content{
  font-size: 14px;
  text-align: left;
  width: 80%;
}
input{
  border: 1px solid #9ca3af;
}
</style>
