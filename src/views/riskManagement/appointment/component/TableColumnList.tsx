export const columns: TableColumnList = [
  {
    label: t('联赛等级'),
    prop: 'id',
    minWidth: 100
  },
  {
    label: t('联赛数量'),
    prop: 'level',
    minWidth: 150,
    formatter: ({ level }) => {
      switch (level) {
        case 1:
          return (
            <el-text class="risk-tag-red" style="">
              {level}
            </el-text>
          );
        case 2:
          return <el-text class="risk-tag-orange">{level}</el-text>;
        case 3:
          return <el-text class="risk-tag-yellow">{level}</el-text>;
        default:
          return '-';
      }
    }
  },
  {
    label: t('预约开关'),
    prop: 'name',
    slot: 'name',
    minWidth: 150
  },
  {
    label: t('操作人'),
    minWidth: 150,
    slot: 'userCount'
  },
  {
    label: t('最近操作时间'),
    prop: 'remark',
    minWidth: 150
  }
];
