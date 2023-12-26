import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { $t } from "@/plugins/i18n";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  leagueNameCn: [{ required: true, message: $t("vMatch.leagueNameCnMsg"), trigger: "blur" }],
  leagueNameEn: [{ required: true, message: $t("vMatch.leagueNameEnMsg"), trigger: "blur" }],
  leagueName: [{ required: true, message: $t("vMatch.leagueNameMsg"), trigger: "blur" }],
  dataSource: [{ required: true, message: $t("vMatch.dataSourceMsg"), trigger: "blur" }],
  dataSourceName: [{ required: true, message: $t("vMatch.dataSourceNameMsg"), trigger: "blur" }],
});
