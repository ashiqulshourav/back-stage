import { auto_risks_control_type } from './types';

export enum AUTO_RISKS_BUTTONS {
  automatically_reject = 0,
  automatic_order_placement = 1,
  auto_freeze = 2
  // auto_label_limit = 3
}

export const AUTO_RISK_CONTROLS: auto_risks_control_type[] = [
  {
    label: t('自动接拒'),
    value: AUTO_RISKS_BUTTONS.automatically_reject,
    linkName: 'AUTO_RISKS_REJECT_DETAIL'
  },
  {
    label: t('自动划单'),
    value: AUTO_RISKS_BUTTONS.automatic_order_placement,
    linkName: 'AUTO_RISKS_ORDER_PLACEMENT_DETAIL'
  },
  {
    label: t('自动冻结'),
    value: AUTO_RISKS_BUTTONS.auto_freeze,
    linkName: 'AUTO_RISKS_FREEZE_DETAIL'
  }
  // {
  //   label: t('自动标签限额'),
  //   value: AUTO_RISKS_BUTTONS.auto_label_limit,
  //   linkName: 'AUTO_RISKS_LABEL_LIMIT_DETAIL'
  // }
];

export const EVENT_NAMES = [
  {
    eventName: '进球事件',
    eventCode: 'goal'
  },
  {
    eventName: '红牌事件',
    eventCode: 'red_card'
  },
  {
    eventName: '获得点球事件',
    eventCode: 'penalty_awarded'
  }
] as const;
