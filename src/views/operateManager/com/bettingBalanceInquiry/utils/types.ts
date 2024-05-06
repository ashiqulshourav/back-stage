interface FormProps {
  formInline: ConfigCenterDataAPI.LeagueTagType;
}

export type searchFormType = {
  id: string; //TODO: changed to userIdOrName if api is available
  userName: string; //TODO: changed to matchId if api is available
}

export type { FormProps };