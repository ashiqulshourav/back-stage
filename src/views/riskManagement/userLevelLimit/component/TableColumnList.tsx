import { t } from '@/plugins/i18n';
import { h } from 'vue';
import { ElTooltip, ElIcon } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';

const addTooltip = (labelText: string, tooltipContent: string) => {
  return h('div', { class: 'flex items-center justify-center' }, [
    h('span', labelText),
    h(ElTooltip, 
      { 
        content: tooltipContent,
        placement: 'top',
      }, {
      default: () => h(ElIcon, { class: 'ml-1 cursor-pointer'}, [
        h(InfoFilled)
      ])
    })
  ]);
};

export const columns: TableColumnList = [
  {
    label: addTooltip(t('用户限额等级'), "Hello"),
    prop: 'levelLimit',
  },
  {
    label: t('单注投注限额'),
    slot: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付限额'),
    slot: 'maxWinAmountLimit'
  },
  {
    label: t('单场赛事累计赔付限额(不分早盘滚球)'),
    slot: 'userSingleGamePay',
    width: 150
  },
  {
    label: t('单关单日累计赔付'),
    slot: 'singleMatchPay'
  },
  {
    label: t('串关单日累计赔付限额(不分早盘滚球)'),
    slot: 'bunchMatchPay',
    width: 150
  },
  {
    label: t('冠军单日累计赔付'),
    slot: 'championDailyPay'
  }
];