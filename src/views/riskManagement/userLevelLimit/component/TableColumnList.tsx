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
    label: t('用户限额等级'),
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
    label: addTooltip(t('赛事限额'), t('单场(早盘+滚球)，累计赔付')),
    slot: 'userSingleGamePay',
    width: 150
  },
  {
    label: addTooltip(t('单关限額'), t('单日（早盘＋滚球），累计赔付')),
    slot: 'singleMatchPay'
  },
  {
    label: addTooltip(t('串关限额'), t('单日（早盘＋滚球），累计赔付')),
    slot: 'bunchMatchPay',
    width: 150
  },
  {
    label: addTooltip(t('冠军限額'), t('单日累计赔付')),
    slot: 'championDailyPay'
  }
];