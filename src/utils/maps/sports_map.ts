import { $t, transformI18n } from "@/plugins/i18n";

export const sportIdsMap = [
  { label: transformI18n($t('settle.football')), value: 1 },
  { label: transformI18n($t('settle.basketball')), value: 2 },
  { label: transformI18n($t('settle.tennis')), value: 3 },
  { label: transformI18n($t('settle.eSports')), value: 4 },
  { label: transformI18n($t('settle.snookerBilliards')), value: 5 },
  { label: transformI18n($t('settle.volleyball')), value: 6 },
  { label: transformI18n($t('settle.specialProjects')), value: 7 },
  { label: transformI18n($t('settle.darts')), value: 8 },
  { label: transformI18n($t('settle.rugby')), value: 9 },
  { label: transformI18n($t('settle.boxingFighting')), value: 10 },
]