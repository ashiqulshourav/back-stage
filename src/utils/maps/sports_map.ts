import { t } from "@/plugins/i18n";

export const SPORT_ID_MAP = [
  { label: t('足球'), value: 1 },
  { label: t('篮球'), value: 2 },
  { label: t('网球'), value: 3 },
  { label: t('电子竞技'), value: 4 },
  { label: t('斯诺克/台球'), value: 5 },
  { label: t('排球'), value: 6 },
  { label: t('特别项目'), value: 7 },
  { label: t('飞镖'), value: 8 },
  { label: t('橄榄球'), value: 9 },
  { label: t('拳击/格斗'), value: 10 },
]

export const MATCH_EVENT_CODE = {
  goal: t('足球进球'),
  yellow_red_card: t('红牌/黄牌'),
  corner: t('角球'),
}