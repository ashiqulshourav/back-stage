import dayjs from 'dayjs';
/* 

times
: 
null
xhReturnRate
: 
1.1245766811804547
xjAwayOdds
: 
6
xjCurrentScore
: 
"0:0"
xjDrawOdds
: 
5.3
xjHomeOdds
: 
1.3
xjIsSale
: 
2
 */
const STATUS_MAP = {
  2: t('开'),
  3: '-',
  4: t('关')
};
export const columns = () => {
  return [
    {
      field: 'matchStartTime',
      title: t('比赛时间'),
      minWidth: 200,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
    },
    {
      field: 'eventName',
      title: t('事件'),
      minWidth: 150,
      formatter({ cellValue }: { cellValue: string }) {
        return cellValue ? cellValue : '-';
      }
    },
    {
      field: 'eventCurrentScore',
      title: t('当前比分'),
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
          field: 'xjIsSale',
          type: 'html',
          formatter({ cellValue }: { cellValue: number }) {
            return `<div class="w-full justify-center flex items-center ">
            <div class="rounded-full w-[20px] h-[20px] text-white  justify-center flex items-center text-xs ${
              cellValue === 2 ? 'bg-[#00bf6f]' : 'bg-[#ff5e1d]'
            }">${STATUS_MAP[cellValue as keyof typeof STATUS_MAP]}</div>
            </div>`;
          }
        },
        {
          title: t('比分'),
          field: 'xjCurrentScore',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        },
        {
          title: t('主胜'),
          field: 'xjHomeOdds',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        },
        {
          title: t('平'),
          slot: 'xjDrawOdds',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        },
        {
          title: t('客胜'),
          field: 'xjAwayOdds',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        },
        {
          title: t('返还率'),
          field: 'xhReturnRate',
          formatter: ({ cellValue }: { cellValue: string }) =>
            cellValue ? cellValue : '-'
        }
      ]
    },
    {
      title: t('播控'),
      children: [
        {
          title: t('状态'),
          field: 'addition5',
          visible: false
        },
        {
          title: t('比分'),
          field: 'dataSourceCode',
          visible: false
        },
        {
          title: t('主胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('平'),
          slot: 'canceled',
          visible: false
        },
        {
          title: t('客胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('返还率'),
          slot: 'canceled',
          visible: false
        }
      ]
    },
    {
      title: t('熊猫'),
      visible: false,
      children: [
        {
          title: t('状态'),
          field: 'addition5',
          visible: false
        },
        {
          title: t('比分'),
          field: 'dataSourceCode',
          visible: false
        },
        {
          title: t('主胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('平'),
          field: 'canceled',
          visible: false
        },
        {
          title: t('客胜'),
          field: 'operationType',
          visible: false
        },
        {
          title: t('返还率'),
          field: '123',
          visible: false
        }
      ]
    },
    {
      title: t('操盘'),
      visible: false,
      children: [
        {
          title: t('状态'),
          visible: false,
          field: 'addition5'
        },
        {
          title: t('比分'),
          visible: false,
          field: 'dataSourceCode'
        },
        {
          title: t('主胜'),
          visible: false,
          field: 'operationType'
        },
        {
          title: t('平'),
          visible: false,
          slot: 'canceled'
        },
        {
          title: t('客胜'),
          visible: false,
          field: 'operationType'
        },
        {
          title: t('返还率'),
          visible: false,
          slot: 'canceled'
        }
      ]
    },
    {
      title: t('数据获取时间'),
      field: 'createdTime',
      minWidth: 150,
      formatter: ({ cellValue }: { cellValue: string }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-'
    }
  ];
};
