<template>
  <div class="bg-bg_color w-[99/100] pl-8 pb-3 pt-[12px]">
    <div class="text-center font-bold text-2xl mb-3">{{ t('盘口详情') }}</div>
    <el-row>
      <el-col
        class="mb-2"
        v-for="(item, index) in renderList"
        :key="index"
        :span="6"
      >
        <template v-if="(item.title == 'button')">
          <el-button
            type="primary"
            @click="onSettlement"
          >
            {{item.val}}
          </el-button>
        </template>
        <template v-else>
          <span class="mr-2 text-sm">{{ item.title }}:</span>
          <span class="text-sm">{{ item.val }}</span>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { SPORT_ID_MAP, MATCH_STATUS } from '@/utils/maps/sports_map';
import { t } from '@/plugins/i18n';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';

const props = defineProps<{
  renderObj: EsportsSettlementAPI.ESportMatchById;
}>();
const renderList = computed(() => {
  const _ = props.renderObj;
  console.log(_);
  return [
    {
      title: t('赛事ID'),
      val: _?.matchId || ''
    },
    {
      title: t('联赛'),
      val: _?.leagueNameCn
    },
    {
      title: t('开赛时间'),
      val: _?.beginTime
    },
    {
      title: t('盘口状态'),
      val: MATCH_STATUS[_?.status]
    },
    {
      title: t('赛种'),
      val: SPORT_ID_MAP.find(item => item.value === _?.sportId)?.label ?? '-'
    },
    {
      title: t('比赛方'),
      val: `${_?.homeTeamNameCn} VS ${_?.awayTeamNameCn}`
    },
    { title: t('结算状态'), val: _?.settlementStatus === 1 ? '已结算' : '未结算'},
    { title: 'button', val: t('全場結算')}
  ];
});
const onSettlement = () => {
  ElMessageBox.confirm(
    `⼿動確認比嚼算全場比賽後，即開始結算
      全場比賽玩法，結算後無法回退。
      `
      ,
      `確認結算全場比賽`,
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('確認結算'),
        cancelButtonText: t('取消'),
        center: true,
      }
  )
    .then(async () => {
      const res = await API.allBasketballSettlement({ matchId: Number(props.renderObj.matchId) });
      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
      }
    })
}
</script>

<style scoped></style>
