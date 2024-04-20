// interface FormProps {
//   formInline: ConfigCenterDataAPI.LeagueTagType;
// }

export type searchFormType = {
  ids?: string | number | string[];
  usernames?: string | number | string[];
  riskControlLabelList?: string[];
  attributeLabelList?: string[];
  tenantIds?: number | string | string[] | number[];
  limitLevel?: number | string;
  tenantCode?: number | string;
  venueType?: number;
  offset?: number;
  timeVal?: string | number;
};

export type updateUserFormType = {
  id: number;
  limitLevel: number;
  isFreeze: number;
  singleBetLimit: number;
  singleEventCompensationLimit: string;
  createdAt: string | number;
};

export type recordFormType = {
  id: number;
  labelType: number;
  offset: string;
}

export type addLabelsType = {
  risk: number[],
  attr: number[]
}
// export type { FormProps };
