/* 确认弹窗 */

/*  const changeAllSaleStatus = () => {
    ElMessageBox.confirm(t('确认要调整开售状态吗?'), t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning',
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(async () => {
        // const res = await API.updateSaleStatus({
        //   isSale: row.isSale,
        //   matchId: row.matchId
        // });
        // if (res.code) return message(res.msg, { type: 'error' });
        // message(res.msg, { type: 'success' });
        // onSearch();
      })
      .catch(() => (allSaleSatatus.value = 0));
  }; */

/* 
  <el-popover
    placement="top-start"
    title="Title"
    :width="200"
    trigger="hover"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button class="m-2">Hover to activate</el-button>
    </template>
  </el-popover>
   */

/* 
  import { useDark } from './utils';
  // const { isDark } = useDark();
   */

/* 功能插件 */

/* 
sports_map 文件
1、 比赛分类映射 : sports_map SPORT_ID_MAP
2、 足球角球映射 ： MATCH_EVENT_CODE
3、 滚球映射： MATCH_STATUS
4、 开售状态： OPENING_STATUS
5、 红黄牌： YELLOW_OR_RED
6、 玩法映射: PLAY_MATCH
7、 反波胆内容格式化：BoDanSort

formatMatch 文件
1、当前部分解析 parseMatchScore
2、国家展示 parseCountry

formatNumnber 文件
1、输入数字场地限制
2、最大输入数字限制

formatDate
1、 时间 转换秒数  ：dateGetSecond 

getTableWidth 
  处理表格列的宽度

message 文件
确认消息弹窗

print 内容打印

utilFn.ts 文件
删除fomr表单 空字段 ： removeEmptyStringKeys()

hook文件夹
switch 样式切换 switchStyle
tableHeaderStyle 表格头部样式内容
 */
