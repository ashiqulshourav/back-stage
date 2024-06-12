<template>
  <div
    v-if="matchInfo.matchId"
    class="my-2 search-form bg-bg_color w-[99/100] pl-8 py-3 flex items-center"
  >
    <div class="flex flex-col flex-shrink-0 mr-20">
      <div
        class="flex items-center cursor-pointer"
        @click="copyTxt(matchInfo.league, 'league')"
      >
        <span class="text-sm mr-1">{{ matchInfo.league }}</span>
        <IconifyIconOffline icon="copyIcon" />
      </div>
      <div
        class="flex items-center cursor-pointer my-1"
        @click="copyTxt(matchInfo.matchId.toString(), 'match')"
      >
        <span class="text-sm mr-1"
          >{{ matchInfo.hTeamName }} vs {{ matchInfo.aTeamName }}
        </span>
        <IconifyIconOffline icon="copyIcon" />
      </div>
      <div class="flex items-center cursor-pointer text-sm">
        <span class="mr-1"
          >{{ t('开赛时间') }}: {{ matchInfo.startDateTime }}</span
        >
        <span class="font-bold">结束</span>
        <el-button
          class="ml-4"
          size="small"
          type="primary"
          @click="betMapCLick"
          >{{ t('注单分布') }}</el-button
        >
      </div>
    </div>

    <div class="h-24">
      <pure-table
        align-whole="center"
        :loading="loading"
        size="small"
        adaptive
        border
        class="!h-24"
        :data="list"
        :columns="titleColumn"
      >
        <template #score="{ row }">
          <span> {{ row.t1 }} - {{ row.t2 }} </span>
        </template>
      </pure-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import { copyTextToClipboard } from '@pureadmin/utils';
import { titleColumn } from './TableColumnList';
import { addDialog, closeDialog } from '@/components/ReDialog';
import EventMatchBet from './eventMatchBet/index.vue';

const props = defineProps<{
  matchInfo: EventAPI.MatchInfo;
}>();

const loading = ref(false);
const copyTxt = (val: string, type: 'league' | 'match') => {
  const eMap = {
    league: t('联赛ID复制成功'),
    match: t('赛事ID复制成功')
  };
  copyTextToClipboard(val);
  message(eMap[type], { type: 'success' });
};

const list = computed(() => {
  return [
    {
      teamName: props.matchInfo.hTeamName ?? '-',
      ft: 0,
      ht1: 0,
      ht2: 0,
      goal: 0,
      corner: 0,
      yellow_card: 0,
      red_card: 0
    },
    {
      teamName: props.matchInfo.aTeamName ?? '-',
      ft: 0,
      ht1: 0,
      ht2: 0,
      goal: 0,
      corner: 0,
      yellow_card: 0,
      red_card: 0
    }
  ];
});

watch(
  () => props.matchInfo,
  () => {
    initData();
  },
  {
    deep: true
  }
);

const loopTimer = ref();
const matchData = reactive<EventAPI.getMatchStatusticData>(
  {} as EventAPI.getMatchStatusticData
);
//- 初始化赛事信息
const initData = async () => {
  const res = await API.getMatchStatistic({ matchId: props.matchInfo.matchId });
  if (res.code) return;
  Object.assign(matchData, res.data);
};

const betMapCLick = () => {
  addDialog({
    width: '80%',
    center: true,
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: ({ options, index }) =>
      h(EventMatchBet, {
        matchData,
        matchId: props.matchInfo.matchId,
        onCloseDialog: (_: boolean) => {
          closeDialog(options, index);
        }
      })
  });
};
</script>

<style scoped></style>
