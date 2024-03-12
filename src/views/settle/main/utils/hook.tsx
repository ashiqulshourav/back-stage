import { addDialog, closeDialog } from '@/components/ReDialog';
import type { PaginationProps } from '@pureadmin/table';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';
import { useSettingStoreHook } from '@/store/settings';
import { useMatchStore } from '@/store/match';
import { SearchFormType } from './type';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from './tableColumnList';
import { SPORT_NAME_TYPE } from './map';

export const useSettileHook = () => {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  const matchStore = useMatchStore();
  const form = ref<SearchFormType>({} as SearchFormType);
  const settingStore = useSettingStoreHook();
  const classifyNavList = reactive(SPORT_ID_MAP.slice(0, 9));

  //- 取消注单
  const cancelBetOrder = row => {
    return new Promise<void>(resolve => {
      const remark = ref('');
      addDialog({
        title: t('取消比赛'),
        width: '20%',
        footerButtons: [
          {
            label: t('取消'),
            btnClick: ({ dialog: { options, index } }) => {
              closeDialog(options, index);
            }
          },
          {
            type: 'primary',
            loading: false,
            label: t('确认'),
            btnClick: async ({ dialog: { options, index } }) => {
              if (!remark.value) {
                return message(t('请输入取消原因'), { type: 'error' });
              }
              const params = {
                remark: remark.value,
                matchId: row.matchId,
                sportName:
                  SPORT_ID_MAP.find(item => item.value === row.sportId)
                    ?.label ?? t('电竞')
              };
              options.footerButtons[1].loading = true;
              const res = await API.cancelBetOrder(params);
              options.footerButtons[1].loading = false;

              message(res.msg, {
                type: res.code ? 'error' : 'success'
              });
              closeDialog(options, index);
              if (!res.code) resolve();
            }
          }
        ],
        contentRenderer: () => (
          <el-form>
            <el-form-item label={t('取消原因:')} required>
              <el-input
                type="textarea"
                rows={4}
                v-model={remark.value}
                placeholder={t('请输入取消原因')}
              />
            </el-form-item>
          </el-form>
        )
      });
    });
  };

  //- 跳转详情页面
  const goDetailPage = () => {};

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: settingStore.settlePageInfo.page ?? 1
  });

  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    onSearch();
  };

  /** 搜索初始化 */
  const onSearch = async (type?: 'reload') => {
    try {
      if (type === 'reload') pagination.currentPage = 1;
      const data = removeEmptyStringKeys(form.value ?? {});
      matchStore.set_settleRequestLoading(true);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementList({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId:
            settingStore.settlePageInfo.matchType ?? SPORT_NAME_TYPE.football
        });

      matchStore.set_settleRequestLoading(false);
      if (res.code) return message(res.msg, { type: 'error' });

      res.data.list.forEach(item => {
        item.isShowCancelBtn =
          item.status === 'nover' || item.status === 'nobegin';
      });
      dataList.length = 0;
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      matchStore.settleRequestLoading = false;
    }
  };

  const changeNavType = () => {};

  onMounted(() => onSearch());

  return {
    form,
    onSearch,
    columns,
    dataList,
    pagination,
    handleTableWidthChange,
    handleCurrentChange,
    classifyNavList,
    changeNavType,
    goDetailPage
  };
};
