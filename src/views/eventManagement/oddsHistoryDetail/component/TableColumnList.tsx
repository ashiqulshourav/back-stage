import dayjs from 'dayjs';
import { handleTableWidth } from '@/utils/getTableWidth';
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href,
  yellow_card: new URL('@/assets/event_img/yellow_card.png', import.meta.url)
    .href,
  corner: new URL('@/assets/event_img/corner.png', import.meta.url).href,
  red_card: new URL('@/assets/event_img/red.png', import.meta.url).href
};
export const columns = () => {
  return [
    {
      field: 'createdAt',
      title: t('比赛时间'),
      minWidth: 200,
      formatter({ cellValue }: { cellValue: string }) {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      field: 'playingTime',
      title: t('事件'),
      minWidth: 150,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? cellValue : '-';
      }
    },
    {
      title: t('188'),
      children: [
        {
          title: t('状态'),
          field: 'addition5'
        },
        {
          title: t('比分'),
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          field: 'operationType'
        },
        {
          title: t('平'),
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          field: 'operationType'
        },
        {
          title: t('返还率'),
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('188'),
      children: [
        {
          title: t('状态'),
          field: 'addition5'
        },
        {
          title: t('比分'),
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          field: 'operationType'
        },
        {
          title: t('平'),
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          field: 'operationType'
        },
        {
          title: t('返还率'),
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('188'),
      children: [
        {
          title: t('状态'),
          field: 'addition5'
        },
        {
          title: t('比分'),
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          field: 'operationType'
        },
        {
          title: t('平'),
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          field: 'operationType'
        },
        {
          title: t('返还率'),
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('188'),
      children: [
        {
          title: t('状态'),
          field: 'addition5'
        },
        {
          title: t('比分'),
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          field: 'operationType'
        },
        {
          title: t('平'),
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          field: 'operationType'
        },
        {
          title: t('返还率'),
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('数据获取时间'),
      field: 'score',
      headerRenderer: d => handleTableWidth(d, t('数据获取时间'), 'auto')
    }
  ];
};
