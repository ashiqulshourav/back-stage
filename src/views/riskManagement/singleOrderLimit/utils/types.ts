
interface FormProps {
  formInline: MetadataAPI.LeagueList;
}

interface TeamFormProps {
  formInline: MetadataAPI.TeamList;
}
export type sport_list_map_type = {
  label: string;
  value: number;
  linkName: string;
}
export type SearchFormType = {
  sportId: number;
}

export type {
  FormProps,
  TeamFormProps
};
