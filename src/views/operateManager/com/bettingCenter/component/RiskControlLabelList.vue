<template>
    <div v-if="newRow.combineOrderDetails?.length === 1">
      <div class="mt-5">
        <el-text type="primary">{{ t('赛事信息') }}</el-text>
      </div>
      <div class="mt-1">
        {{ newRow.combineOrderDetails[0].sportNameCn }}/{{
          newRow.combineOrderDetails[0].leagueNameCn
        }}
      </div>
      <div class="mt-1">
        {{ t('赛事ID:') }} {{ newRow.combineOrderDetails[0].matchId }}
      </div>
      <div class="mt-1">
        {{ t('开赛时间:')
        }}{{
          dayjs(newRow.combineOrderDetails[0].beginTime ?? Date.now()).format(
            'MM-DD HH:mm:ss'
          )
        }}
      </div>
      <div class="mt-5">
        <el-text class="mt-5" type="primary">{{ t('赛果比分') }}</el-text>
      </div>
      <div class="result_wrap mt-5">
        <div class="result_l">
          <div>{{ newRow.combineOrderDetails[0].homeTeamNameCn }}</div>
          <div class="mt-2 flex max-w-full justify-center">
            <input
              class="mr-1 text-center"
              v-model="newRow.combineOrderDetails[0].betResultHomeScore"
              type="number"
            />
          </div>
        </div>
        <div class="result_r">
          <div>{{ newRow.combineOrderDetails[0].awayTeamNameCn }}</div>
          <div class="mt-2 flex max-w-full justify-center">
            <input
              class="mr-1 text-center"
              v-model="newRow.combineOrderDetails[0].betResultAwayScore"
              type="number"
            />
          </div>
        </div>
      </div>
      <div class="mt-5">
        <el-text type="primary">{{ t('请选择注单的投注结果') }}</el-text>
        <ul class="mt-2">
          <li
            v-for="item in resultList"
            :class="`result_item ${
              item?.value === data.combineOrderDetails[0].betResult
                ? 'result_item_disable'
                : item.value === newRow.combineOrderDetails[0].betResult
                ? 'result_item_active cursor-pointer'
                : 'cursor-pointer'
            }`"
            @click="
              selectBetResult(
                0,
                item.value,
                item?.value === data.combineOrderDetails[0].betResult
              )
            "
          >
            {{ item.title }}
          </li>
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
            :data="newRow.combineOrderDetails"
            :columns="dynamicColumns"
          >
            <template #matchMessage="{ row }">
              <div class="match_item">
                <div class="mt-1">
                  {{ row.sportNameCn }}/{{ row.leagueNameCn }}
                </div>
                <div class="mt-1">{{ t('赛事ID:') }} {{ row.matchId }}</div>
                <div class="mt-1">
                  {{ t('开赛时间:')
                  }}{{
                    dayjs(row.beginTime ?? Date.now()).format('MM-DD HH:mm:ss')
                  }}
                </div>
              </div>
            </template>
            <template #matchScore="{ row }">
              <div class="result_wrap">
                <div class="result_l">
                  <div>{{ row.homeTeamNameCn }}</div>
                  <div class="mt-2 flex max-w-full justify-center">
                    <input
                      class="mr-1 text-center"
                      v-model="row.betResultHomeScore"
                      type="number"
                    />
                  </div>
                </div>
                <div class="result_r">
                  <div>{{ row.awayTeamNameCn }}</div>
                  <div class="mt-2 flex max-w-full justify-center">
                    <input
                      class="mr-1 text-center"
                      v-model="row.betResultAwayScore"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </template>
            <template #matchResult="{ row }">
              <ul>
                <li
                  v-for="item in resultList"
                  :class="`result_item ${
                    item?.value === data.combineOrderDetails[row.index].betResult
                      ? 'result_item_disable'
                      : item?.value === row.betResult
                      ? 'result_item_active cursor-pointer'
                      : 'cursor-pointer'
                  }`"
                  @click="
                    selectBetResult(
                      row.index,
                      item.value,
                      item?.value ===
                        data.combineOrderDetails[row.index].betResult
                    )
                  "
                >
                  {{ item.title }}
                </li>
              </ul>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <div class="flex justify-end mt-10">
      <el-button @click="closeDialog">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="confirmClick">{{ t('确定') }}</el-button>
    </div>
  </template>
  
  <script setup lang="tsx">
  import { t } from '@/plugins/i18n';
  import dayjs from 'dayjs';
  import {
    BET_RESULT_TYPE_MAP,
    displayHomeAwayScore,
    EBetResultType
  } from '@/utils/formatMatch';
  import { PureTableBar } from '@/components/RePureTableBar';
  import { ElMessageBox } from 'element-plus';
  import { message } from '@/utils/message';
  import {riskStatus} from '@/views/riskManagement/bettingAudit/util/types'
  const { list } = defineProps<{
    list:
  }>();
  const emits = defineEmits(['closeDialog']);
  const newRow = ref<BetOrderAPI.Detail & BetOrderAPI.BetOrderList>(
    formatRow() as BetOrderAPI.Detail & BetOrderAPI.BetOrderList
  );


  </script>
  
  <style lang="scss">
 
  </style>
  