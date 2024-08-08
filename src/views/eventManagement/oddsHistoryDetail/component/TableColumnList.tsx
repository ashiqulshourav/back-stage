import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red.png', import.meta.url).href
};
export const columns = (): TableColumnList => {
  return [
    {
      label: t('比赛时间'),
      prop: 'createdAt',
      minWidth: 200,
      formatter({ createdAt }: { createdAt: string }) {
        return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      label: t('事件'),
      prop: 'playingTime',
      minWidth: 200,
      headerRenderer: d => handleTableWidth(d, t('事件'), 'auto'),
      formatter({ playingTime }) {
        return playingTime ? playingTime : '-';
      }
    },
    {
      label: t('188'),
      children: [
        {
          label: t('状态'),
          prop: 'addition5',
          headerRenderer: d => handleTableWidth(d, t('状态'), 'auto')
        },
        {
          label: t('比分'),
          prop: 'dataSourceCode',
          headerRenderer: d => handleTableWidth(d, t('比分'), 'auto')
        },
        {
          label: t('主胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('主胜'), 'auto')
        },
        {
          label: t('平'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('平'), 'auto')
        },
        {
          label: t('客胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('客胜'), 'auto')
        },
        {
          label: t('返还率'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('返还率'), 'auto')
        }
      ]
    },
    {
      label: t('188'),
      children: [
        {
          label: t('状态'),
          prop: 'addition5',
          headerRenderer: d => handleTableWidth(d, t('状态'), 'auto')
        },
        {
          label: t('比分'),
          prop: 'dataSourceCode',
          headerRenderer: d => handleTableWidth(d, t('比分'), 'auto')
        },
        {
          label: t('主胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('主胜'), 'auto')
        },
        {
          label: t('平'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('平'), 'auto')
        },
        {
          label: t('客胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('客胜'), 'auto')
        },
        {
          label: t('返还率'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('返还率'), 'auto')
        }
      ]
    },
    {
      label: t('188'),
      children: [
        {
          label: t('状态'),
          prop: 'addition5',
          headerRenderer: d => handleTableWidth(d, t('状态'), 'auto')
        },
        {
          label: t('比分'),
          prop: 'dataSourceCode',
          headerRenderer: d => handleTableWidth(d, t('比分'), 'auto')
        },
        {
          label: t('主胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('主胜'), 'auto')
        },
        {
          label: t('平'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('平'), 'auto')
        },
        {
          label: t('客胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('客胜'), 'auto')
        },
        {
          label: t('返还率'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('返还率'), 'auto')
        }
      ]
    },
    {
      label: t('188'),
      children: [
        {
          label: t('状态'),
          prop: 'addition5',
          headerRenderer: d => handleTableWidth(d, t('状态'), 'auto')
        },
        {
          label: t('比分'),
          prop: 'dataSourceCode',
          headerRenderer: d => handleTableWidth(d, t('比分'), 'auto')
        },
        {
          label: t('主胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('主胜'), 'auto')
        },
        {
          label: t('平'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('平'), 'auto')
        },
        {
          label: t('客胜'),
          prop: 'operationType',
          headerRenderer: d => handleTableWidth(d, t('客胜'), 'auto')
        },
        {
          label: t('返还率'),
          slot: 'canceled',
          headerRenderer: d => handleTableWidth(d, t('返还率'), 'auto')
        }
      ]
    },
    {
      label: t('数据获取时间'),
      prop: 'score',
      headerRenderer: d => handleTableWidth(d, t('数据获取时间'), 'auto')
    }
  ];
};
