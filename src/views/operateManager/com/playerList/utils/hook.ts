// import editForm from '../form.vue';
import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addLabelsType, recordFormType, searchFormType, updateUserFormType } from './types';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';

export function userPlayerListHook(venueType: number) {
  const dataList = reactive<UserAPI.operateUserList[]>([]);
  const selectedDataList = reactive<UserAPI.operateUserList[]>([]);
  const recordList = reactive<UserAPI.recordType[]>([]);
  const loading = ref(true);
  const isEditUser = ref(false);
  const isOpenRecord = ref(false);
  const isMultiLabelAdd = ref(false);
  const isMultiLabelDel = ref(false);
  const route = useRoute();
  const isAddLabel = reactive<{
    risk: boolean,
    attr: boolean
  }>({risk: false, attr: false});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const recordPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive<searchFormType>({} as searchFormType);
  const updateUserForm = reactive<updateUserFormType>({} as updateUserFormType);
  const recordForm = reactive<recordFormType>({} as recordFormType);
  const addLabelForms = reactive<addLabelsType>({} as addLabelsType);
  const riskLabels = reactive<UserAPI.labelType[]>([]);
  const attributeLabels = reactive<UserAPI.labelType[]>([]);

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleRecordTableWidthChange(val: number) {
    recordPagination.pageSize = val;
    onSearchRecord();
  }

  function handleRecordCurrentChange(val: number) {
    recordPagination.currentPage = val;
    onSearchRecord();
  }

  function handleSelectionChange(val: UserAPI.operateUserList[]) {
    selectedDataList.length = 0;
    selectedDataList.push(...val);
  }

  const handleUpdateUser = (row: UserAPI.operateUserList) => {
    if (addLabelForms.attr)
      addLabelForms.attr.length = 0;
    if (addLabelForms.risk)
      addLabelForms.risk.length = 0;
    isAddLabel.attr = false;
    isAddLabel.risk = false;
    Object.assign(updateUserForm, row);
    attributeLabels.length = 0;
    if (row.attributeLabelList)
      attributeLabels.push(...row.attributeLabelList);
    riskLabels.length = 0;
    if (row.riskControlLabelList)
      riskLabels.push(...row.riskControlLabelList);
    isEditUser.value = true;
  };

  const handleUserLabelDel = async (
    id: string[],
    labelId: number[],
  ) => {
    if (id.length === 0 || labelId.length === 0) {
      return;
    }
    if (id.length === 1) {
      ElMessageBox.confirm(`${t("您确定要删除吗?")} `, '系统提示', { type: 'warning', center: true }).then( async () => {
        dispatchDelLabels(id, labelId);
      });
    }
    
  };
  const dispatchDelLabels = async (
    id: string[],
    labelId: number[],
  ) => {  
    try {
      const res = await API.updateUserLabelDel({ id, labelId });
      if (res.code) return message(res.msg, { type: 'error' });
      if(id.length === 1)
        ElMessage.success(res.msg);
      dispatchGetUserLabels();
      onSearch();
    } catch (error) {
      console.log(error);
    } 
  }

  const handleAddRiskLabels = (ids: string[]) => {
    ElMessageBox.confirm(`${t("您确定要增加吗?")} `, '系统提示', { type: 'warning', center: true }).then(() => {
      dispatchAddLabels(ids, addLabelForms.risk);
      addLabelForms.risk.length = 0;
      isAddLabel.risk = false;
    });
  }

  const handleAddAttrLabels = (ids: string[]) => {
    ElMessageBox.confirm(`${t("您确定要增加吗?")} `, '系统提示', { type: 'warning', center: true }).then(() => {
      dispatchAddLabels(ids, addLabelForms.attr);
      addLabelForms.attr.length = 0;
      isAddLabel.attr = false;
    });
  }

  const handleMultiAddLabels = () => {
    let ids:string[] = [];
    selectedDataList.forEach(item => {
      ids.push(item.id);
    })
    ElMessageBox.confirm(`${t("您确定要增加吗?")} `, '系统提示', { type: 'warning', center: true }).then(() => {
      dispatchAddLabels(ids, addLabelForms.risk);
      dispatchAddLabels(ids, addLabelForms.attr);
      ElMessage.success("Operation successful");
      addLabelForms.risk.length = 0;
      addLabelForms.attr.length = 0;
      isMultiLabelAdd.value = false;
    });
  }

  const handleMultiDelLabels = async () => {
    let ids:string[] = [];
    selectedDataList.forEach(item => {
      ids.push(item.id);
    })
    ElMessageBox.confirm(`${t("您确定要删除吗？")} `, '系统提示', { type: 'warning', center: true }).then(() => {
      dispatchDelLabels(ids, addLabelForms.risk);
      dispatchDelLabels(ids, addLabelForms.attr);
      ElMessage.success("Operation successful");
      addLabelForms.risk.length = 0;
      addLabelForms.attr.length = 0;
      isMultiLabelDel.value = false;
    });
  }

  const dispatchAddLabels = async (id: string[], labelId: number[]) => {
    if (id.length === 0 || labelId.length === 0) {
      return;
    }
    try {
      const res = await API.addLabels({id, labelId});
      if (res.code) return message(res.msg, { type: 'error' });
      if (!res.data) {
        return message("Operation failed", { type: 'error' });
      }
      dispatchGetUserLabels();
      onSearch();
      if (id.length === 1)
        ElMessage.success(res.msg);
    } catch (error) {
      console.log(error);
    }
  }; 

  const dispatchGetUserLabels = async () => {
    try {
      const res = await API.operateUserList({
        ids: [updateUserForm.id],
        pageSize: 10,
        pageNum: 1,
      });
      if (res.code) return message(res.msg, { type: 'error' });
      riskLabels.length = 0;
      riskLabels.push(...res.data.pageData[0].riskControlLabelList);
      attributeLabels.length = 0;
      attributeLabels.push(...res.data.pageData[0].attributeLabelList);
    } catch (error) {
      console.log(error);
    }
  } 

  const handelOpenRecord = (labelType: number) => {
    recordForm.id = updateUserForm.id;
    recordForm.labelType = labelType;
    onSearchRecord();
    isOpenRecord.value = true;
  }

  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res =
        await API.operateUserList({
          ...removeEmptyStringKeys(form),
          venueType:venueType,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage
        });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.pageData);
      pagination.total = res.data.count;
    } catch (error) {
      loading.value = false;
    }
  }
  
  async function onSearchRecord(type?: string) {
    if (type === 'reload') recordPagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.getLabelRecord({
        ...removeEmptyStringKeys(recordForm),
        pageSize: recordPagination.pageSize,
        pageNum: recordPagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      recordList.length = 0;
      recordList.push(...res.data.records);
      recordPagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  const getLabelColor = (label: number, type: string) => {
    if (type === 'risk') {
      switch (label) {
        case 1:
          return 'rgba(163, 0, 20, 1)';
        case 2:
          return 'rgba(255, 92, 0, 1)';
        case 3:
          return 'rgba(255, 153, 0, 1)';
      }
    } else {
      switch (label) {
        case 1:
          return 'rgba(24, 145, 255, 1)';
        case 2:
          return 'rgba(25, 190, 107, 1)';
        case 3:
          return 'rgba(46, 64, 80, 1)';
      }
    }
  };

  onMounted(() => {
    if (route.query.tagId) {
      let labelType: any = route.query.labelType as string; 
      labelType = Number(labelType);
      let tagId: any = route.query.tagId as string; 
      tagId = Number(tagId);
      labelType === 1 ? form.riskControlLabelList?.push(tagId) : form.attributeLabelList?.push(tagId);
    }
    onSearch();
  });

  return {
    loading,
    dataList,
    selectedDataList,
    recordList,
    isEditUser,
    isOpenRecord,
    isAddLabel,
    isMultiLabelAdd,
    isMultiLabelDel,
    recordPagination,
    pagination,
    onSearch,
    onSearchRecord,
    resetForm,
    form,
    recordForm,
    riskLabels,
    attributeLabels,
    updateUserForm,
    addLabelForms,
    getLabelColor,
    handleUpdateUser,
    handleMultiAddLabels,
    handleMultiDelLabels,
    handleUserLabelDel,
    handleTableWidthChange,
    handelOpenRecord,
    handleCurrentChange,
    handleRecordTableWidthChange,
    handleRecordCurrentChange,
    handleSelectionChange,
    handleAddRiskLabels,
    handleAddAttrLabels
  };
}
