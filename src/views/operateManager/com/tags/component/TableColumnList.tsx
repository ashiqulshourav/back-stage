export const columns: TableColumnList = [
  {
    label: t('标签ID'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('标签级别'),
    prop: 'level',
    minWidth: 150,
    formatter: ({ level }) => {
      switch (level) {
        case 1:
          return (
            <el-text class="risk-tag-blue" style="">
              {level}
            </el-text>
          );
        case 2:
          return <el-text class="risk-tag-green">{level}</el-text>;
        case 3:
          return <el-text class="risk-tag-black-blue">{level}</el-text>;
        default:
          return '-';
      }
    }
  },
  {
    label: t('标签名称'),
    prop: 'name',
    minWidth: 150,
    formatter: ({ level, name }) => {
      switch (level) {
        case 1:
          return (
            <el-text class="risk-tag-blue" style="">
              {name}
            </el-text>
          );
        case 2:
          return <el-text class="risk-tag-green">{name}</el-text>;
        case 3:
          return <el-text class="risk-tag-black-blue">{name}</el-text>;
        default:
          return '-';
      }
    }
  },
  {
    label: t('用户人数'),
    // prop: 'userCount',
    minWidth: 150,
    slot: 'userCount'
  },
  {
    label: t('备注'),
    prop: 'remark',
    minWidth: 150
  },

  {
    label: t('操作'),
    fixed: 'right',
    width: 240,
    slot: 'operation'
  }
];
