import { MATCH_PERIOD_TYPES } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    headerSlot: 'inningNum',
    formatter: ({matchPeriod}) => MATCH_PERIOD_TYPES[matchPeriod] ?? '-' 
  },
  {
    headerRenderer: () => history.state.params.homeTeamNameCn ?? '_',
    slot: 't1'
  },
  {
    headerRenderer: () => history.state.params.awayTeamNameCn ?? '_',
    slot: 't2'
  },
  {
    label: t('结算时间'),
    slot: 'eventTime'
  },
  {
    label: t('操作人'),
    formatter: ({ createdBy }) => {
      return createdBy ? createdBy : '_';
    }
  },
  {
    label: t('状态'),
    formatter: () => {
      return t('人工结算');
    }
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];
