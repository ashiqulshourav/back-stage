import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { $t } from "@/plugins/i18n";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  teamNameCn: [{ required: true, message: $t("vTeam.teamNameCnMsg"), trigger: "blur" }],
  teamNameEn: [{ required: true, message: $t("vTeam.teamNameEnMsg"), trigger: "blur" }],
  teamName: [{ required: true, message: $t("vTeam.teamNameMsg"), trigger: "blur" }],
  dataSource: [{ required: true, message: $t("vTeam.dataSourceMsg"), trigger: "blur" }],
  dataSourceName: [{ required: true, message: $t("vTeam.dataSourceNameMsg"), trigger: "blur" }],
});
