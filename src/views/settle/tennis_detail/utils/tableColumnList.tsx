// import { parseMatchScore } from '@/utils/formatMatch';

export const columns: TableColumnList = [
  {
    type: 'expand',
    slot: 'expand'
  },
  {
    label: t('盘'),
    prop: 'inningNum',
    type: 'index'
    // formatter: ({ inningNum }) => {
    //   return inningNum;
    // }
  },
  {
    headerRenderer: () => history.state.params.homeTeamNameCn ?? '_',
    formatter: ({ t1 }) => {
      return t1;
    }
  },
  {
    headerRenderer: () => history.state.params.awayTeamNameCn ?? '_',
    formatter: ({ t2 }) => {
      return t2;
    }
  },
  {
    label: t('结算时间'),
    formatter: ({ eventTime }) => {
      return eventTime ?? '_';
    }
  },
  {
    label: t('操作人'),
    formatter: ({ createdBy }) => {
      return createdBy ?? '_';
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

export const childColumns: TableColumnList = [
  {
    label: t('局'),
    prop: 'inningNum',
    type: 'index'
    // formatter: ({ inningNum }) => {
    //   return inningNum;
    // }
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
      return createdBy ?? '_';
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
    slot: 'childOperation'
  }
];
