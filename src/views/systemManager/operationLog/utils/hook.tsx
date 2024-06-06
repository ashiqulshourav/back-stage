import { message } from '@/utils/message';
import type { PaginationProps, TableColumns } from '@pureadmin/table';
import { columns } from '../component/TableColumnList';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { utils, writeFile } from 'xlsx';

export function useOperationLog() {
  const dataList = reactive<OperationLogDataAPI.OperationLogList[]>([]);
  const loading = ref(true);
  const exportLoading = ref(false);
  const operationTypeList = reactive<string[]>([]);
  const logTypeList = reactive<string[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 50,
    currentPage: 1,
    background: true
  });
  const form = reactive({
    operateMenu: '',
    operateLog: '',
    operateType: '',
    requestLog: '',
    userName: '',
    beginTime: '',
    endTime: ''
  });

  function handleTableWidthChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  //- 初始化列表渲染
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    loading.value = true;
    const o = JSON.parse(JSON.stringify(removeEmptyStringKeys(form)));
    o.operateMenu && (o.operateMenu = o.operateMenu.join('-'));
    try {
      const res = await API.getOperateLogList({
        ...o,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      });
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  // export to excel
  const exportFile = async () => {
    exportLoading.value = true;
    message(t('导出报表开始'), { type: 'warning' });

    const res = await API.operationLogExport({
      ...removeEmptyStringKeys(form),
      pageNum: 1,
      pageSize: 50000,
      export: true
    });

    message(res.msg, { type: res.code ? 'error' : 'success' });
    exportLoading.value = false;
  }

  //- 导出excel表格
  const exportFileClick = async () => {
    exportLoading.value = true;
    message(t('导出报表开始'), { type: 'warning' });
    const o = JSON.parse(JSON.stringify(removeEmptyStringKeys(form)));
    o.operateMenu && (o.operateMenu = o.operateMenu.join('-'));
    const r = await API.getOperateLogList({
      ...o,
      pageNum: 1,
      pageSize: 50000
    });
    if (r.code) return message(r.msg, { type: 'error' });

    const res: string[][] = r.data.list.map(item => {
      const arr: any = [];
      columns.forEach(column => {
        arr.push(
          item[column.prop as keyof OperationLogDataAPI.OperationLogList] ?? '-'
        );
      });
      return arr;
    });
    const titleList: string[] = [];
    columns.forEach((column: TableColumns) => {
      titleList.push(column?.label ?? '');
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, '数据报表');
    writeFile(workBook, `${t('操作日志报表')}.xlsx`);
    message(t('导出报表成功'), { type: 'success' });
    exportLoading.value = false;
  };

  //- 获取下拉菜单列表
  const getOperateTypes = async () => {
    const res = await API.getOperateType();
    if (res.code) return message(res.msg, { type: 'error' });
    logTypeList.length = 0;
    logTypeList.push(...res.data);
  };

  onMounted(() => {
    onSearch();
    getOperateTypes();
  });
  return {
    loading,
    columns,
    dataList,
    pagination,
    operationTypeList,
    form,
    exportLoading,
    logTypeList,
    exportFileClick,
    onSearch,
    handleTableWidthChange,
    handleCurrentChange,
    exportFile,
  };
}
