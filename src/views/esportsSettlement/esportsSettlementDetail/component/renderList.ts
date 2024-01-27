import { t } from '@/plugins/i18n';
import { props } from './MatchDetailCard.vue';

export const renderList = computed(() => {
  console.log(
    'MatchDetailCard.vue文件 21==============行打印=',
    props.renderObj
  );

  const d = [
    { title: t('赛事ID'), val: props.renderObj.matchId },
    { title: t('开赛时间'), val: props.renderObj.beginTime },
    { title: t('游戏'), val: ESPORT_ID_MAP },
    { title: t('赛事状态'), val: '比赛中' },
    { title: t('联赛'), val: 'LPL 中国职业联四 - 春季赛' },
    { title: t('盘口状态'), val: '已开盘' },
    { title: t('队伍'), val: '西安WE - OMNG' },
    { title: t('结算人员'), val: '手动结算' }
  ];
  return d;
});
