import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { t } from '@/plugins/i18n'

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  riskType: [{ required: true, message: t('请选择划单原因'), trigger: "blur" }],
});
