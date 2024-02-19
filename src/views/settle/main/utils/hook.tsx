import { addDialog, closeDialog } from '@/components/ReDialog';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { message } from '@/utils/message';

export const useSettileHook = () => {
  //- 取消注单
  const cancelBetOrder = row => {
    return new Promise<void>(resolve => {
      const remark = ref('');
      addDialog({
        title: t('取消注单'),
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
                sportName: SPORT_ID_MAP.find(item => item.value === row.sportId)
                  .label
              };
              options.footerButtons[1].loading = true;
              const res = await API.cancelBetOrder(params);
              options.footerButtons[1].loading = false;

              message(res.code ? res.msg : t('取消注单成功'), {
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

  return {
    cancelBetOrder
  };
};
