import { message } from '@/utils/message';
import editForm from '../form.vue';
import { columns } from '../component/TableColumnList';
import { addDialog, closeDialog } from '@/components/ReDialog';
import { ElMessageBox } from 'element-plus';

export function useMenuManagerHook() {
  const dataList = reactive<RoleAPI.ChildResourceList[]>([]);
  const loading = ref(true);
  const parentList = reactive<Partial<RoleAPI.ChildResourceList>[]>([]);

  //- 初始化
  const onSearch = async () => {
    try {
      loading.value = true;
      const res = await API.getAllResource();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data);
      filterParentList(dataList, '一级页面');
      checkHasQueryRole();
    } catch (error) {
      loading.value = false;
    }
  };

  //- 查询是否有query
  const checkHasQueryRole = () => {
    parentList.forEach(item => {
      const index = item.childResourceList.findIndex(
        _ => _.enName === 'query' || _.type === 0 || _.type === 2
      );
      if (index < 0) {
        const params = {
          name: '页面查看',
          enName: 'query',
          type: 1,
          parentId: item.id,
          sort: 1,
          path: '/query',
          routerPath: '/query'
        };
        API.menuInsert(params);
      }
    });
  };

  const filterParentList = (list: RoleAPI.ChildResourceList[], parentName) => {
    list.forEach(item => {
      if (item.childResourceList.length > 0)
        filterParentList(item.childResourceList, item.name);
      if (item.type === 0 || item.type === 2) {
        parentList.push({
          id: item.id,
          name: item.name,
          enName: item.enName,
          tableName: parentName + '-' + item.name,
          childResourceList: item.childResourceList
        });
      }
    });
    list.sort((a, b) => a.sort - b.sort);
  };

  //- 删除菜单
  const delMenu = (id: string) => {
    ElMessageBox.confirm(t('确定要删除菜单么？'), t('警告'), {
      confirmButtonText: t('确认'),
      cancelButtonText: t('取消'),
      center: true
    })
      .then(async () => {
        const res = await API.menuDel({ id });
        message(res.msg, { type: res.code ? 'error' : 'success' });
        !res.code && onSearch();
      })
      .catch(e => {
        console.log(e);
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

  const cellRowClick = (_row, _column, e) => {
    if (
      e.currentTarget.firstElementChild.firstElementChild.firstElementChild
        .tagName === 'DIV'
    ) {
      e.currentTarget.firstElementChild.firstElementChild.firstElementChild.click();
    } else {
      e.currentTarget.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.click();
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
    openRoleDialog,
    cellRowClick,
    delMenu
  };
}
