import { t } from '@/plugins/i18n';
import { handleTableWidth } from '@/utils/getTableWidth';
import { TYPE_NAME } from '../utils/map';

export const columns: TableColumnList = [
  {
    label: t('菜单中文名'),
    prop: 'name',
    className: 'first_table',
    headerRenderer: d => handleTableWidth(d, t('菜单中文名'), 'auto'),
    minWidth: 200,
    formatter({ name }) {
      return <div class="min-w-20 text-left">{name}</div>;
    }
  },
  {
    label: t('菜单英文名'),
    prop: 'enName',
    minWidth: 150,
    headerRenderer: d => handleTableWidth(d, t('菜单英文名')),
    formatter: ({ enName }) => enName
  },
  {
    label: t('菜单类型'),
    prop: 'type',
    minWidth: 220,
    headerRenderer: d => handleTableWidth(d, t('菜单类型')),
    formatter: ({ type }) => TYPE_NAME[type] ?? '-'
  },
  {
    label: t('前端路径'),
    prop: 'path',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('前端路径'))
  },
  {
    label: t('后端路径'),
    prop: 'routerPath',
    align: 'left',
    headerRenderer: d => handleTableWidth(d, t('后端路径'))
  },
  // {
  //   label: t('父级ID'),
  //   prop: 'parentId',
  //   headerRenderer: d => handleTableWidth(d, t('父级ID'))
  // },
  {
    label: t('菜单排序'),
    prop: 'sort',
    headerRenderer: d => handleTableWidth(d, t('菜单排序'))
  },
  {
    label: t('菜单展示'),
    prop: 'type',
    headerRenderer: d => handleTableWidth(d, t('菜单展示')),
    formatter: ({ type }) => {
      return (
        <el-text type={type === 1 ? 'danger' : 'info'}>
          {type === 0 ? t('是') : t('否')}
        </el-text>
      );
    }
  },
  {
    label: t('建立时间'),
    prop: 'createdAt',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('建立时间'), 'auto')
  },
  {
    label: t('修改时间'),
    prop: 'updatedAt',
    minWidth: 200,
    headerRenderer: d => handleTableWidth(d, t('修改时间'), 'auto')
  },
  // {
  //   label: t('修改人'),
  //   prop: 'updatedBy',
  //   headerRenderer: d => handleTableWidth(d, t('修改人'), 'auto')
  // },
  {
    label: t('操作'),
    slot: 'operation',
    width: 180
  }
];
