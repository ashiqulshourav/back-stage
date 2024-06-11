import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
import dayjs from "dayjs";
import { t } from "@/plugins/i18n";
import { matchMethod, matchSource } from "../utils/map";
export const columns: TableColumnList = [
  {
    label: t('赛种'),
    prop: 'sportId',
    formatter: ({ sportId, category }): string => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('赛事ID'),
    prop: 'matchId',
    minWidth: 120,
  },
  {
    label: t('联赛'),
    slot: 'leagueName',
    align: 'left',
    minWidth: 150,
  },
  {
    label: t('主队'),
    slot: 'homeTeamName',
    align: 'left',
    minWidth: 150,
  },
  {
    label: t('客队'),
    slot: 'awayTeamName',
    align: 'left',
    minWidth: 150,
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    minWidth: 200,
    formatter: ({ beginTime }) => dayjs(beginTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t('数据源'),
    prop: 'dataSourceCode',
    minWidth: 150,
    formatter: ({ dataSourceCode }) => matchSource.find(_ => _.value === dataSourceCode)?.label ?? '-'
  },
  {
    label: t('匹配方式'),
    prop: 'pairingType',
    minWidth: 150,
    formatter: ({ pairingType }) => matchMethod.find(_ => _.value === pairingType)?.label ?? '-'
  },
  {
    label: t('获取赔率数据'),
    slot: 'isDataSourceOdds',
    minWidth: 110,
  },
  {
    label: t('操作人'),
    prop: 'pairingUser',
    minWidth: 150,
  },
  {
    label: t('操作时间'),
    prop: 'pairingTime',
    minWidth: 150,
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 150,
    slot: 'operation',
  }
];

export const matchColumns: TableColumnList = [
  {
    label: t('数据源'),
    prop: 'dataSource',
    formatter: ({ dataSourceCode }) => matchSource.find(_ => _.value === dataSourceCode)?.label ?? '-'

  },
  {
    label: t('赛事ID'),
    prop: 'matchId'
  },
  {
    label: t('联赛'),
    slot: 'leagueName',
    align: 'left',
  },
  {
    label: t('主队'),
    slot: 'homeTeamName',
    align: 'left',
  },
  {
    label: t('客队'),
    slot: 'awayTeamName',
    align: 'left',
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    formatter: ({ beginTime }) => dayjs(beginTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];

export const selectedEventColumns = [
  {
    label: t('赛事ID'),
    keys: ["matchId"],
  },
  {
    label: t('联赛名称'),
    keys: ["leagueNameCn", "leagueNameEn"],
  },
  {
    label: t('主队名称'),
    keys: ["homeTeamNameCn", "homeTeamNameEn"],
  },
  {
    label: t('客队名称'),
    keys: ["awayTeamNameCn", "awayTeamNameEn"],
  },
  {
    label: t('比赛开始时间'),
    keys: ["beginTime"],
  }
];
