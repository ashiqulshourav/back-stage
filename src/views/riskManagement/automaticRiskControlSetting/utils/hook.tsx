import { usePasswordInputHook } from '@/hooks/passwordInputHook';
import { ElMessageBox } from 'element-plus';
import { message } from '@/utils/message';
import { reactive, ref, onMounted, toRaw } from 'vue';
import {
  autoLabelColumns,
  orderPlacementColumns,
  rejectOrderColumns,
  autoFreezeColumns
} from '../component/TableColumnList';
import { labelListType } from '@/views/operateManager/com/playerList/utils/types';
import { PandaMatch } from '@/views/eventManagement/eventQuery/utils/types';

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
  const { openPasswordInput } = usePasswordInputHook();
  const pandaMatchList = reactive<PandaMatch[]>([]);

  // order reject
  const rejectOrderList = reactive<RiskManagementDataAPI.OrderRejectTypes[]>(
    []
  );
  const sourcerejectOrderList = reactive<
    RiskManagementDataAPI.OrderRejectTypes[]
  >([]);
  const delrejectOrderList = reactive<RiskManagementDataAPI.OrderRejectTypes[]>(
    []
  );

  // order placement
  const orderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  const sourceOrderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  const delOrderPlacementList = reactive<
    RiskManagementDataAPI.OrderPlacementTypes[]
  >([]);
  // auto freeze
  const orderAutoFreezeList = reactive<RiskManagementDataAPI.AutoFreeze[]>([]);
  const sourceOrderAutoFreezeList = reactive<
    RiskManagementDataAPI.AutoFreeze[]
  >([]);
  const delOrderAutoFreezeList = reactive<RiskManagementDataAPI.AutoFreeze[]>(
    []
  );

  // auto label limit
  const labelList = reactive<labelListType>({
    risk: [],
    attr: []
  } as labelListType);

  const riskControlList = reactive<RiskManagementDataAPI.RiskControlTypes[]>(
    []
  );
  const sourceRiskControlList = reactive<
    RiskManagementDataAPI.RiskControlTypes[]
  >([]);
  const delRiskControlList = reactive<RiskManagementDataAPI.RiskControlTypes[]>(
    []
  );

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

  // reject
  async function onSearchFreezeOrder() {
    try {
      loading.value = true;
      const res = await API.getRiskFreezeConfigList();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      orderAutoFreezeList.length = 0;
      sourceOrderAutoFreezeList.length = 0;
      orderAutoFreezeList.push(...res.data);
      sourceOrderAutoFreezeList.push(...res.data);
    } catch (error) {
      loading.value = false;
    }
  }
  // order placement
  async function onSearchOrderPlacement() {
    try {
      loading.value = true;
      const res = await API.getRiskSettleConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      orderPlacementList.length = 0;
      sourceOrderPlacementList.length = 0;
      orderPlacementList.push(...res.data);
      sourceOrderPlacementList.push(...res.data);
    } catch (error) {
      loading.value = false;
    }
  }
  // auto freeze
  async function onSearchRejectOrder() {
    try {
      loading.value = true;
      const res = await API.getRiskBetConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });

      rejectOrderList.length = 0;
      sourcerejectOrderList.length = 0;
      rejectOrderList.push(...res.data);
      sourcerejectOrderList.push(...res.data);
    } catch (error) {
      loading.value = false;
    }
  }

  // risk control label limit
  async function onSearchAutoLabelLimit() {
    try {
      loading.value = true;
      const res = await API.getAutoLimitConfigList();

      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      riskControlList.length = 0;
      sourceRiskControlList.length = 0;
      riskControlList.push(...res.data);
      sourceRiskControlList.push(...res.data);
    } catch (error) {
      loading.value = true;
    }
  }

  const cancelRiskControlsEdit = () => {
    isEditRiskControls.value = false;
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          onSearchRejectOrder();
        }
        break;
      case 1:
        {
          onSearchOrderPlacement();
        }
        break;
      case 2:
        {
          onSearchFreezeOrder();
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
    cancelRiskControlsEdit();
  };

  const toggle = async (flag: boolean) => {
    // todo: add later
    // const r = await openPasswordInput();
    // if (!r) return;
    isEditRiskControls.value = flag;
  };

  // rejectOrder
  const confirmRejectOrder = () => {
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;

      const transformPayload = (
        data: RiskManagementDataAPI.OrderRejectTypes[]
      ) => {
        return data.map(item => ({
          id: item?.id,
          sourceCode: item.sourceCode,
          sourceName: item.sourceName,
          eventCode: item.eventCode,
          eventName: item.eventName,
          isDelete: item.isDelete,
          betBeforeTime: parseInt(item.betBeforeTime || 0),
          betAfterTime: parseInt(item.betAfterTime || 0),
          event_name: item.eventName
        }));
      };

      const res = await API.editRiskBetConfigEdit([
        ...transformPayload(rejectOrderList),
        ...transformPayload(delrejectOrderList)
      ]);
      loading.value = false;

      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        rejectOrderList.length = 0;
        delrejectOrderList.length = 0;
        onSearchRejectOrder();
      }
    });
  };
  // auto order placement
  const confirmOrderPlacement = () => {
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;

      const transformPayload = (
        data: RiskManagementDataAPI.OrderPlacementTypes[]
      ) => {
        return data.map(item => ({
          id: item?.id,
          sourceCode: item.sourceCode,
          sourceName: item.sourceName,
          eventCode: item.eventCode,
          eventName: item.eventName,
          isDelete: item.isDelete,
          betBeforeTime: parseInt(item.betBeforeTime || 0),
          betAfterTime: parseInt(item.betAfterTime || 0),
          minLimitAmount: parseInt(item.minLimitAmount || 0),
          maxLimitAmount: parseInt(item.maxLimitAmount || 0),
          event_name: item.eventName
        }));
      };

      const res = await API.updateOrderPlacement([
        ...transformPayload(orderPlacementList),
        ...transformPayload(delOrderPlacementList)
      ]);
      loading.value = false;

      if (res.code) {
        message(res.msg, { type: 'error' });
      } else {
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        orderPlacementList.length = 0;
        delOrderPlacementList.length = 0;
        onSearchOrderPlacement();
      }
    });
  };
  // auto label
  const confirmAutoLabel = () => {
    ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
      center: true
    }).then(async () => {
      loading.value = true;

      const res = await API.updateAutoLimitConfig([
        ...riskControlList,
        ...delRiskControlList
      ]);
      loading.value = false;
      if (res.code) {
        message(res.msg, { type: 'error' });
        return;
      } else {
        message(res.msg, { type: res.code ? 'error' : 'success' });
        isEditRiskControls.value = false;
        riskControlList.length = 0;
        delRiskControlList.length = 0;
        onSearchAutoLabelLimit();
      }
    });
  };

  // auto freeze
  const confirmAutoFreeze = () => {
    let returnFn = false;
    orderAutoFreezeList.forEach(item => {
      if (Number(item.maxLimitAmount) < Number(item.minLimitAmount)) {
        returnFn = true;
      }
    });

    if (returnFn) return;
    else
      ElMessageBox.confirm(t('确定要修改限额吗？'), t('警告'), {
        center: true
      }).then(async () => {
        loading.value = true;

        const transformPayload = (data: RiskManagementDataAPI.AutoFreeze[]) => {
          return data.map(item => ({
            id: item?.id,
            isDisable: item.isDisable,
            sourceCode: item.sourceCode,
            sourceName: item.sourceName,
            eventCode: item.eventCode,
            eventName: item.eventName,
            isDelete: item.isDelete,
            betBeforeTime: parseInt(item.betBeforeTime || 0),
            betAfterTime: parseInt(item.betAfterTime || 0),
            minLimitAmount: parseInt(item.minLimitAmount || 0),
            maxLimitAmount: parseInt(item.maxLimitAmount || 0),
            event_name: item.eventName,
            userCreateAfter: 0,
            labels: '',
            excepLimitUser: 0
          }));
        };

        const res = await API.updateRiskFreezeConfigList([
          ...transformPayload(orderAutoFreezeList),
          ...transformPayload(delOrderAutoFreezeList)
        ]);
        loading.value = false;
        if (res.code) {
          message(res.msg, { type: 'error' });
          return;
        } else {
          message(res.msg, { type: res.code ? 'error' : 'success' });
          isEditRiskControls.value = false;
          orderAutoFreezeList.length = 0;
          delOrderAutoFreezeList.length = 0;
          onSearchFreezeOrder();
        }
      });
  };

  const confirmRiskControlsClick = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          confirmRejectOrder();
        }
        break;
      case 1:
        {
          confirmOrderPlacement();
        }
        break;
      case 2:
        {
          confirmAutoFreeze();
        }
        break;
      case 3:
        {
          confirmAutoLabel();
        }
        break;
    }
  };

  const addControlLabel = () => {
    switch (currentRiskControlLabelId.value) {
      case 0:
        {
          rejectOrderList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            betBeforeTime: undefined,
            betAfterTime: undefined,
            isDelete: undefined
          });
        }
        break;
      case 1:
        {
          orderPlacementList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            betBeforeTime: undefined,
            betAfterTime: undefined,
            minLimitAmount: undefined,
            maxLimitAmount: undefined,
            isDelete: undefined
          });
        }
        break;
      case 2:
        {
          orderAutoFreezeList.push({
            sourceCode: undefined,
            sourceName: undefined,
            eventCode: undefined,
            eventName: undefined,
            betBeforeTime: undefined,
            betAfterTime: undefined,
            minLimitAmount: undefined,
            maxLimitAmount: undefined,
            isDelete: undefined
          });
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
          const item = rejectOrderList.pop();
          delrejectOrderList.push({ ...item, isDelete: 1 });
        }
        break;
      case 1:
        {
          const item = orderPlacementList.pop();
          delOrderPlacementList.push({
            ...item,
            isDelete: 1
          });
        }
        break;
      case 2:
        {
          const item = orderAutoFreezeList.pop();
          delOrderAutoFreezeList.push({
            ...item,
            isDelete: 1
          });
        }
        break;
      case 3:
        {
          const item = riskControlList.pop();
          delRiskControlList.push({ ...item, delFlag: 1 });
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
          }
          break;
      }
    }
  );

  onMounted(async () => {
    dispatchGetLabelList();
    onSearchRejectOrder();
  });

  return {
    currentRiskControlLabelId,
    loading,
    changeType,
    isEditRiskControls,
    toggle,
    cancelRiskControlsEdit,
    confirmRiskControlsClick,
    autoLabelColumns,
    riskControlList,
    deleteControlLabel,
    addControlLabel,
    labelList,
    orderPlacementColumns,
    rejectOrderColumns,
    rejectOrderList,
    orderPlacementList,
    pandaMatchList,
    autoFreezeColumns,
    orderAutoFreezeList
  };
}
