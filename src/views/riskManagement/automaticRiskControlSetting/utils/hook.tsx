import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';
import { reactive, ref, onMounted } from 'vue';
import { columns } from '../component/TableColumnList';
import { labelListType } from '@/views/operateManager/com/playerList/utils/types';

export function useRiskControlHook({
  venueType,
  category
}: {
  venueType: number;
  category: number;
}) {
  const currentRiskControlLabelId = ref(0);
  const loading = ref(false);
  const isEditRiskControls = ref(false);
  const labelList = reactive<labelListType>({
    risk: [],
    attr: []
  } as labelListType);
  const { openPasswordInput } = usePasswordInputHook();
  const riskControlList = reactive<RiskManagementDataAPI.RiskControlTypes[]>(
    []
  );
  const sourceRiskControlList = reactive<
    RiskManagementDataAPI.RiskControlTypes[]
  >([]);
  const delList = reactive<RiskManagementDataAPI.RiskControlTypes[]>([]);

  const dispatchGetLabelList = async () => {
    try {
      const res = await API.getLabelList({
        category: venueType
      });

      labelList.risk.length = 0;
      if (res.data.riskControlLabelList)
        labelList.risk.push(...res.data.riskControlLabelList);
      labelList.attr.length = 0;
      if (res.data.attributeLabelList)
        labelList.attr.push(...res.data.attributeLabelList);
    } catch (error) {
      return message(error as string, { type: 'error' });
    }
  };

  // 初始化
  async function onSearch() {
    loading.value = true;
    const res = await API.getAutoLimitConfigList();

    loading.value = false;
    if (res.code) return message(res.msg, { type: 'error' });
    riskControlList.length = 0;
    sourceRiskControlList.length = 0;
    riskControlList.push(...res.data);
    sourceRiskControlList.push(...res.data);
    loading.value = false;
  }

  const cancelRiskControlsEdit = () => {
    isEditRiskControls.value = false;
    onSearch();
  };

  const changeType = (id: number) => {
    currentRiskControlLabelId.value = id;
    if (currentRiskControlLabelId.value == 3) {
      cancelRiskControlsEdit();
    }
  };

  const toggle = async (flag: boolean) => {
    const r = await openPasswordInput();
    if (!r) return;
    isEditRiskControls.value = flag;
  };

  const confirmRiskControlsClick = () => {
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;

      const transformPayload = (
        data: RiskManagementDataAPI.RiskControlTypes[]
      ) =>
        data.map(item => ({
          ...item,
          days: parseInt(item.days || 0),
          betcount: parseInt(item.betcount || 0),
          profitAmout: parseInt(item.profiteAmout || 0),
          profitRate: parseInt(item.profiteRate || 0)
        }));

      const res = await API.updateAutoLimitConfig([
        ...transformPayload(riskControlList),
        ...transformPayload(delList)
      ]);
      delList.length = 0;
      loading.value = false;
      isEditRiskControls.value = false;
      message(res.msg, { type: res.code ? 'error' : 'success' });
      onSearch();
    });
  };

  const addControlLabel = () => {
    riskControlList.push({
      name: undefined,
      days: undefined,
      betcount: undefined,
      profiteAmout: undefined,
      profiteRate: undefined,
      level: undefined,
      labelId: undefined,
      lableName: undefined
    });
  };

  const deleteControlLabel = () => {
    const item = riskControlList.pop();
    delList.push({ ...item, delFlag: 1 });
  };

  watch(
    () => currentRiskControlLabelId.value,
    async () => {
      // 自动标签限额 - auto label limit
      if (currentRiskControlLabelId.value == 3) {
        console.log('hit');
        await dispatchGetLabelList();
        await onSearch();
      }
    }
  );

  return {
    currentRiskControlLabelId,
    loading,
    changeType,
    isEditRiskControls,
    toggle,
    cancelRiskControlsEdit,
    confirmRiskControlsClick,
    columns,
    riskControlList,
    deleteControlLabel,
    addControlLabel,
    labelList
  };
}
