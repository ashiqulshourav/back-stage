import dayjs from 'dayjs';
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red.png', import.meta.url).href
};
export const columns: TableColumnList = [
  {
    label: t('事件源发生时间'),
    prop: 'createdAt',
    minWidth: 150,
    formatter({ createdAt }: { createdAt: string }) {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    label: t('事件源'),
    prop: 'dataSourceCode',
    minWidth: 150
  },
  {
    label: t('事件名称'),
    prop: 'addition5',
    minWidth: 300
  },
  {
    label: t('场次/局数/盘数'),
    prop: 'extraInfo',
    minWidth: 150
  },
  {
    label: t('主/客'),
    prop: 'homeAway',
    minWidth: 150
  },
  {
    label: t('球员名称'),
    prop: 'player1Name',
    minWidth: 150
  },
  {
    label: t('比分'),
    slot: 'score',
    minWidth: 150
  }
];

export const titleColumn: TableColumnList = [
  {
    label: t('队伍名称'),
    prop: 'teamName',
    minWidth: 200
  },
  {
    label: t('FT'),
    prop: 'ft'
  },
  {
    label: t('HT1'),
    prop: 'ht1'
  },
  {
    label: t('HT2'),
    prop: 'ht2'
  },
  {
    prop: 'goal',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.goal} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'corner',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.corner} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'yellow_card',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.yellow_card} class="h-4 w-4" />
        </div>
      );
    }
  },
  {
    prop: 'red_card',
    headerRenderer() {
      return (
        <div class="flex justify-center">
          <img src={IconMap.red_card} class="h-4 w-4" />
        </div>
      );
    }
  }
];
