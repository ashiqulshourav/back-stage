import { MATCH_PERIOD, MATCH_UNITS } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';
export const truncateString = (str: string = '') => {
  if (str?.length > 8) {
    return str.substring(0, 7) + '...';
  }
  return str;
}
export const columns: TableColumnList = [
  {
    prop: 'matchPeriod',
    slot: 'matchPeriod',
    headerSlot: 'matchPeriodHeader',
    width: '100px',
    headerRenderer: () => {
      return t(MATCH_UNITS[history.state.params?.sportId]);
    },
    formatter: ({ matchPeriod }) => {
      return MATCH_PERIOD[matchPeriod];
    }
  },
  {
    label: truncateString(history.state.params?.homeTeamNameCn ? history.state.params?.homeTeamNameCn : history.state.params?.homeTeamNameEn),
    minWidth: 100,
    prop: 't1',
    slot: 't1',
    headerRenderer: () => {
      return truncateString(history.state.params.homeTeamNameCn ? history.state.params.homeTeamNameCn : history.state.params.homeTeamNameEn) ;
    },
  },
  {
    label: truncateString(history.state.params?.awayTeamNameCn ? history.state.params?.awayTeamNameCn : history.state.params?.awayTeamNameEn),
    prop: 't2',
    slot: 't2',
    headerRenderer: () => {
      return truncateString(history.state.params.awayTeamNameCn ? history.state.params.awayTeamNameCn : history.state.params.awayTeamNameEn);
    },
  },

  {
    label: t('结算时间'),
    minWidth: 100,
    prop: 'eventTime',
    slot: 'eventTime',
    formatter: ({ eventTime }) => {
      console.log(dayjs(eventTime).format('HH:mm:ss'));
      return dayjs(eventTime).format('HH:mm:ss');
    }
  },
  {
    label: t('操作人'),
    minWidth: 100,
    prop: 'createdBy',
    formatter: ({ createdBy }) => {
      return createdBy ? createdBy : '-';
    }
  },
  {
    label: t('状态'),
    minWidth: 100,
    prop: 'settleType',
    formatter: ({ settleType }) => {
      return settleType === '0'
        ? t('自动结算')
        : settleType === 1
        ? t('⼈⼯結算')
        : '-';
    }
  },
  {
    label: t('操作'),
    minWidth: 100,
    slot: 'operation',
    formatter() {
      return '-';
    }
  }
];
