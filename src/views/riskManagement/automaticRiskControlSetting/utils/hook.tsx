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
  async function onSearchAutoLabelLimit() {
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
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
        }
        break;
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
          onSearchAutoLabelLimit();
        }
        break;
    }
  };

  const changeType = (id: number) => {
    currentRiskControlLabelId.value = id;
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
        }
        break;
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
          cancelRiskControlsEdit();
        }
        break;
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

      const res = await API.updateAutoLimitConfig([
        ...riskControlList,
        ...delList
      ]);
      loading.value = false;
      isEditRiskControls.value = false;
      if (res.code) {
        return message(res.msg, { type: 'error' });
      } else {
        delList.length = 0;

        message(res.msg, { type: res.code ? 'error' : 'success' });
        onSearchAutoLabelLimit();
      }
    });
  };

  const addControlLabel = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
        }
        break;
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
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
        }
        break;
    }
  };

  const deleteControlLabel = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
        }
        break;
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
          const item = riskControlList.pop();
          delList.push({ ...item, delFlag: 1 });
        }
        break;
    }
  };

  watch(
    () => currentRiskControlLabelId.value,
    async () => {
      switch (currentRiskControlLabelId.value) {
        case 0:
          {
          }
          break;
        case 1:
          {
          }
          break;
        case 2:
          {
          }
          break;
        case 3:
          {
            await dispatchGetLabelList();
            await onSearchAutoLabelLimit();
          }
          break;
      }
    }
  );

  onMounted(async () => {
    dispatchGetLabelList();
    onSearchAutoLabelLimit();
  });

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
