import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { getLan } from "@/utils/utilFn";
import dayjs from "dayjs";
import { t } from "@/plugins/i18n";

const lan = getLan() ?? 'zh';

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
    prop: lan === 'zh' ? 'leagueNameCn' : 'leagueNameEn',
    minWidth: 150,
  },
  {
    label: t('主队'),
    prop: 'homeTeamNameCn',
    minWidth: 150,
  },
  {
    label: t('客队'),
    prop: 'awayTeamNameCn',
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
    prop: 'dataSource',
    minWidth: 150,
  },
  {
    label: t('匹配方式'),
    prop: 'matchMethod',
    minWidth: 150,
  },
  {
    label: t('操作人'),
    prop: 'createdBy',
    minWidth: 150,
  },
  {
    label: t('操作时间'),
    prop: 'createdDate',
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
    prop: 'dataSourceCode',
    formatter: ({ dataSourceCode }): string => { return dataSourceCode === 'PS' ? t('熊猫') : dataSourceCode === 'VS' ? t('播控') : ""; },
  },
  {
    label: t('赛事ID'),
    prop: 'matchId'
  },
  {
    label: t('联赛'),
    prop: lan === 'zh' ? 'leagueNameCn' : 'leagueNameEn',
  },
  {
    label: t('主队'),
    prop: lan === 'zh' ? 'homeTeamNameCn' : 'homeTeamNameEn',
  },
  {
    label: t('客队'),
    prop: lan === 'zh' ? 'awayTeamNameCn' : 'awayTeamNameEn',
  },
  {
    label: t('开赛时间'),
    prop: 'beginTime',
    minWidth: 200,
    formatter: ({ beginTime }) => dayjs(beginTime).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    label: t('操作'),
    slot: 'operation'
  }
];
