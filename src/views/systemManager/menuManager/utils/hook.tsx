import { message } from '@/utils/message';
import editForm from '../form.vue';
import { usePublicHooks } from '@/hooks';
import { columns } from '../component/TableColumnList';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { SearchFormType } from './types';
import { ElMessageBox } from 'element-plus';

export function useRoleHook() {
  const dataList = reactive<RoleAPI.ChildResourceList[]>([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const parentList = reactive<Partial<RoleAPI.ChildResourceList>[]>([]);

  const form = reactive<SearchFormType>({
    name: '',
    createdBy: '',
    status: ' ',
    startCreatedAt: '',
    endCreatedAt: ''
  });

  //- 初始化
  const onSearch = async () => {
    try {
      loading.value = true;
      const res = await API.getAllResource();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data);
      filterParentList(dataList);
    } catch (error) {
      loading.value = false;
    }
  };

  const filterParentList = (list: RoleAPI.ChildResourceList[]) => {
    list.forEach(item => {
      if (item.childResourceList.length > 0)
        filterParentList(item.childResourceList);
      if (item.type === 0) {
        parentList.push({
          id: item.id,
          name: item.name,
          enName: item.enName
        });
      }
    });
  };

  //- 角色弹窗
  function openRoleDialog(title: string, row?: RoleAPI.ChildResourceList) {
    addDialog({
      title,
      width: '30%',
      hideFooter: true,
      closeOnClickModal: false,
      alignCenter: true,
      contentRenderer: ({ options, index }) =>
        h(editForm, {
          row: {
            id: row?.id ?? '',
            name: row?.name ?? '',
            enName: row?.enName ?? '',
            type: row?.type ?? '',
            parentId: row?.parentId ?? '',
            sort: row?.sort ?? '',
            path: row?.path ?? '',
            routerPath: row?.routerPath ?? ''
          },
          parentList: parentList,
          onCloseDialog: (closeType?: string) => {
            if (closeType) onSearch();
            closeDialog(options, index);
          }
        })
    });
  }

  //- 删除角色
  const handleDelete = (row: RoleAPI.querySysAccountListData) => {
    if (row.userCount > 0) {
      ElMessageBox.confirm(t('角色底下还有用户，不可删除'), t('操作无效'), {
        confirmButtonText: t('朕知道了'),
        showCancelButton: false,
        center: true
      });
    } else {
      ElMessageBox.confirm(
        `<div class="text-center">
       <p>${'确定要删除角色'}${row.name}</br></p>
      <p>${t('角色删除后不可恢复')}</p>
      </div>`,
        t('警告'),
        {
          confirmButtonText: t('提交'),
          cancelButtonText: t('取消'),
          center: true,
          dangerouslyUseHTMLString: true
        }
      ).then(async () => {
        const res = await API.deleteRole({ roleId: row.id });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        if (!res.code) onSearch();
      });
    }
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    columns,
    dataList,
    onSearch,
    openRoleDialog
  };
}
