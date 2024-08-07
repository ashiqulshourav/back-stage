import { IconifyIconOffline } from '@/components/ReIcon';
import { handleTableWidth } from '@/utils/getTableWidth';
import { ESPORT_ID_MAP, SPORT_ID_MAP } from '@/utils/maps/sports_map';

export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    minWidth: 100
  },
  {
    label: t('联赛名称'),
    prop: 'leagueNameCn',
    headerRenderer: d => handleTableWidth(d, t('联赛名称'), 'auto'),
    minWidth: 150,
    align: 'left'
  },
  {
    label: t('主队'),
    prop: 'leagueId188Bet',
    headerRenderer: d => handleTableWidth(d, t('主队'), 'auto'),
    minWidth: 150
  },

  {
    label: t('客队'),
    prop: 'leagueNameEn',
    headerRenderer: d => handleTableWidth(d, t('客队'), 'auto'),
    minWidth: 150,
    align: 'left'
  },
  {
    label: t('赛事ID'),
    prop: 'level',
    headerRenderer: d => handleTableWidth(d, t('赛事ID'), 'auto'),
    minWidth: 150
  },
  {
    label: t('开赛时间'),
    prop: 'riskLevel',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('开赛时间'), 'auto'),
    formatter: ({ riskLevel }): string => {
      return riskLevel < 0 ? t('未评级') : riskLevel;
    }
  },
  {
    label: t('比赛状态'),
    prop: 'sportId',
    headerRenderer: d => handleTableWidth(d, t('比赛状态'), 'auto'),
    formatter: ({ sportId, category }): string => {
      const arr = category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
      return arr.find(_ => _.value === sportId)?.label ?? '-';
    },
    minWidth: 150
  },
  {
    label: t('数据有效期'),
    prop: 'level',
    headerAlign: 'center',
    headerRenderer: () => {
      return (
        <div class="flex justify-center w-full cursor-pointer">
          <el-tooltip effect="dark" content={t('数据有效期')} placement="top">
            <IconifyIconOffline icon="clockIcon" class="text-[16px]" />
          </el-tooltip>
        </div>
      );
    },
    minWidth: 150
  },
  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
