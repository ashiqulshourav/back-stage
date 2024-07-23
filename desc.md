### 确认弹窗

```js
ElMessageBox.confirm(t('确定要关闭整场比赛么？'), t('警告'), {
  confirmButtonText: t('确认'),
  cancelButtonText: t('取消'),
  center: true
  // dangerouslyUseHTMLString: true,
  // draggable: true
})
  .then(async () => {
    /*  const res = await API.closeSaleStatus({ matchId: props.matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    router.go(-1); */
  })
  .catch(e => {
    console.log(e);
  });
```

### 内容弹窗

```js
import { addDialog, closeDialog } from '@/components/ReDialog';

//- passwordInput

<div class="flex justify-center mt-4">
      <el-button type="info" @click="() => closeDialog()">{{
        t('取消')
      }}</el-button>
      <el-button
        type="primary"
        @click="confirmClick"
        :disabled="!btnDisabled"
        >{{ t('确认') }}</el-button
      >
    </div>
  </div>

<script lang="ts" setup>
    const emits = defineEmits(['closeDialog']);
    const closeDialog = (type = false) => {
    emits('closeDialog', type);
    };
</script>
/* 弹窗 */

addDialog({
  title: t('请输入U盾密码'),
  class: 'reset_dialog',
  width: '25%',
  center: true,
  closeOnClickModal: false,
  hideFooter: true,
  contentRenderer: ({ options, index }) =>
    h(PasswordInput, {
      onCloseDialog: (_: boolean) => {
        closeDialog(options, index);
        setTimeout(() => {
          const params: any = { orderIds: [data.id] };
          API.orderCancel(params).then(res => {
            if (res.code) {
            } else {
              onSearch();
            }
            message(res.msg, { type: res.code ? 'error' : 'success' });
          });
        }, 500);
      }
    })
});
```

### 按钮权限使用

```js
import { hasAuth } from '@/router/utils';

<div v-if="hasAuth('INSERT')"></div>;

<div v-auth="['UPDATE']"></div>;
```

### U 盾验证弹窗

```js
const { openPasswordInput } = usePasswordInputHook();
const r = await openPasswordInput();
if (!r) return;
```

### 数字输入框

```js
<el-input
          v-model="form.matchId"
          :placeholder="t('赛事ID')"
          v-enter="search"
          clearable
          :formatter="v => formatNumber(v)"
          class="!w-[150px]"
        />
```

### 日期组件

```js

import CustomDate from '@/components/Form/Custom_date.vue';
  <CustomDate
    :placeholder="t('其他日期')"
    :disableDate="disableDate"
    v-model:val="form.startTime"
    @changeDate="changeDate"
    :isShowShortCuts="true"
    :isSingle="true"
/>
```

### 按钮图标

```js
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
  <el-button
    type="primary"
    :icon="useRenderIcon(Search)"
    :loading="loading"
    @click="search"
  >
    {{ t('筛选') }}
  </el-button>
```

### 环境变量获取

```js
import.meta.env.VITE_BUILD_TYPE === 'pro';
```

### css 边框

```js
border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]
```


### input 输入框处理(保证值跟显示内容完全一致)

```js
 <el-input
            v-model="warningData.alarmPercent"
            :parser="(v:string) => formatWarningNum(v, 3)"
            :formatter="(v:string) => formatWarningNum(v,3)"
   />
```
