import { handleTableWidth } from '@/utils/getTableWidth';

export const columns: TableColumnList = [
  {
    label: '届',
    prop: 'index',
    fixed: true,
    width: 100,
    type: 'index',
    headerRenderer: d => handleTableWidth(d, '届')
  },
  {
    label: '王欣',
    prop: 't1',
    fixed: true,
    width: 250,
    formatter: ({isEdit, t1}) => {
      return isEdit ? (
        <input
          type="text"
          class="border"
          v-modal="newEvent.t1"
        />
      ) : t1; 
    },
    headerRenderer: d => handleTableWidth(d, '王欣'),
  },
  {
    label: '小鸟菜菜绪',
    prop: 't2',
    fixed: true,
    width: 250,
    formatter: ({isEdit, t2}) => {
      return isEdit ? (
        <input
          type="text"
          class="border"
          v-modal="newEvent.t1"
        />
      ) : t2; 
    },
    headerRenderer: d => handleTableWidth(d, '小鸟菜菜绪')
  },
  {
    label: '结算时间',
    prop: 'eventTime',
    width: 300,
    
    headerRenderer: d => handleTableWidth(d, '结算时间'),

  },
  {
    label: '操作人',
    prop: 'manager',
    width: 200,
    formatter: ({manager}) => {
      return manager ? manager : '-'; 
    },
    headerRenderer: d => handleTableWidth(d, '操作人')
  },
  {
    label: '状态',
    prop: 'settleType',
    width: 250,
    formatter: ({settleType}) => {
      return settleType === 1 ? "⼈⼯結算" : settleType === 0 ? "" : '-'; 
    },
    headerRenderer: d => handleTableWidth(d, '状态')
  },
  {
    label: '操作',
    prop: 'operation',
    width: 263,
    formatter: ({isEdit}) => {
      return isEdit ? (
        <>
          <el-button
            type="primary"
            class="mt-4"
          >
            新增節
          </el-button >
          <el-button
            type="primary"
            class="mt-4"
          >
            新增節
          </el-button>
        </>
      ) : '-'; 
    },
    headerRenderer: d => handleTableWidth(d, '操作')
  },
];