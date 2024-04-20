// import editForm from '../form.vue';
import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { addLabelsType, recordFormType, searchFormType, updateUserFormType } from './types';
import { ElMessage } from 'element-plus';

export function userPlayerListHook() {
  const dataList = reactive<UserAPI.operateUserList[]>([]);
  const selectedDataList = reactive<UserAPI.operateUserList[]>([]);
  const recordList = reactive<UserAPI.recordType[]>([]);
  const loading = ref(true);
  const isEditUser = ref(false);
  const isOpenRecord = ref(false);
  const isMultiLabelAdd = ref(false);
  const isMultiLabelDel = ref(false);
  const isOperationSuccess = ref(false);
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

  function handleSelectionChange(val) {
    selectedDataList.length = 0;
    Object.assign(selectedDataList, val);
  }

  const handleUpdateUser = (row: UserAPI.operateUserList) => {
    isEditUser.value = true;
    Object.assign(updateUserForm, row);
    riskLabels.length = 0;
    Object.assign(riskLabels, row.riskControlLabelList);
    attributeLabels.length = 0;
    Object.assign(attributeLabels, row.attributeLabelList);
  };

  const handleUserLabelDel = async (
    id: number[],
    labelId: number[],
  ) => {
    if (id.length === 0 || labelId.length === 0) {
      return;
    }
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
  };
  
  const handleAddRiskLabels = (ids: number[]) => {
    dispatchAddLabels(ids, addLabelForms.risk);
    addLabelForms.risk.length = 0;
  }

  const handleAddAttrLabels = (ids: number[]) => {
    dispatchAddLabels(ids, addLabelForms.attr);
    addLabelForms.attr.length = 0;

  }

  const handleMultiAddLabels = () => {
    let ids = [];
    selectedDataList.forEach(item => {
      ids.push(item.id);
    })
    dispatchAddLabels(ids, addLabelForms.risk);
    dispatchAddLabels(ids, addLabelForms.attr);
    ElMessage.success("Operation successful");
    addLabelForms.risk.length = 0;
    addLabelForms.attr.length = 0;

    isOperationSuccess.value = true;
    isMultiLabelAdd.value = false;
  }

  const handleMultiDelLabels = async () => {
    let ids = [];
    selectedDataList.forEach(item => {
      ids.push(item.id);
    })
    handleUserLabelDel(ids, addLabelForms.risk);
    handleUserLabelDel(ids, addLabelForms.attr);
    ElMessage.success("Operation successful");

    addLabelForms.risk.length = 0;
    addLabelForms.attr.length = 0;

    isOperationSuccess.value = true;
    isMultiLabelDel.value = false;
  }

  const dispatchAddLabels = async (id: number[], labelId: number[]) => {
    if (id.length === 0 || labelId.length === 0) {
      return;
    }
    try {
      const res = await API.addLabels({id, labelId});
      if (res.code) return message(res.msg, { type: 'error' });
      if (id.length === 1)
        ElMessage.success(res.msg);
      dispatchGetUserLabels();
      onSearch();
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
      Object.assign(riskLabels, res.data.pageData[0].riskControlLabelList);
      attributeLabels.length = 0;
      Object.assign(attributeLabels, res.data.pageData[0].attributeLabelList);
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
      const res = await API.operateUserList({
        ...removeEmptyStringKeys(form),
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      Object.assign(dataList, res.data.pageData);
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

  const resetForm = formEl => {
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
    console.log(route.query.tagId);
    if (route.query.tagId) {
      let labelType: any = route.query.labelType as string; 
      labelType = Number(labelType);
      let tagId: any = route.query.tagId as string; 
      tagId = Number(tagId);
      labelType === 1 ? form.riskControlLabelList.push(tagId) : form.attributeLabelList.push(tagId);
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
    isOperationSuccess,
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
