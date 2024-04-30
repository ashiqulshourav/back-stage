import dayjs from 'dayjs';
import {statusMap} from '../utils/map'
export const columns: TableColumnList = [
  {
    label: t('序号'),
    type: 'index',
    minWidth: 100
  },
  {
    label: t('创建时间'),
    minWidth: 150,
    prop: 'createdAt',
    formatter: ({ createdAt }): string =>
      createdAt ? dayjs(createdAt).format('MM-DD HH:mm:ss') : ''
  },
  {
    label: t('文件名称'),
    prop: 'fileName',
    minWidth: 300
  },
  {
    label: t('文件大小'),
    prop: 'fileSize',
    minWidth: 150,
    formatter: ({ fileSize }) =>
      ( fileSize ? (fileSize / 1024)?.toFixed(1) + 'KB' : 0)?.toString()
  },
  {
    label: t('页面来源'),
    prop: 'pageFrom',
    minWidth: 150
  },
  {
    label: t('状态'),
    minWidth: 200,
    prop: 'status',
    formatter: ({ status }): string => statusMap[status]
  },
  {
    label: t('操作人'),
    minWidth: 200,
    prop: 'updateBy'
  },
  {
    label: t('操作'),
    minWidth: 200,
    slot: 'operation',
    fixed: 'right'
  }
];
