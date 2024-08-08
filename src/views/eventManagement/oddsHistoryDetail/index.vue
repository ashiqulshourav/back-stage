<template>
  <div class="main">
    <MatchTitle />

    <SelectContainer />

    <!-- <MatchDetail :matchInfo="matchInfo"></MatchDetail> -->

    <el-button @click="changeColumn">change Column</el-button>
    <VxeTableBar
      :vxeTableRef="vxeTableRef"
      :columns="columns()"
      title="分页表格"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <vxe-grid
          ref="vxeTableRef"
          headerAlign="center"
          v-loading="loading"
          border
          height="460"
          :show-overflow="true"
          size="small"
          :column-config="{ resizable: true }"
          :columns="dynamicColumns"
          :scroll-y="{ enabled: true }"
          :pagerConfig="pagerConfig"
          :data="tableData"
          @page-change="handlePageChange"
        />
      </template>
    </VxeTableBar>
  </div>
</template>

<script setup lang="ts">
import { VxeTableBar } from '@/components/ReVxeTableBar';
import { VxeTableDefines } from 'vxe-table';
import { t } from '@/plugins/i18n';

import { useEventQueryHook } from './utils/hook';
import { usePublicHooks } from '@/hooks';
import MatchTitle from './component/MathcTitle.vue';
import SelectContainer from './component/SelectContainer.vue';

defineOptions({ name: 'EVENTMANAGEMENT_EVENTQUERY' });
const { tableHeaderStyle } = usePublicHooks();
const vxeTableRef = ref();
const tableData = ref([]);
const loading = ref(true);
const columns1 = ref<VxeTableDefines.ColumnInfo<any>[]>([]);

const pagerConfig = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20]
});

const columns = () => {
  return [
    { type: 'seq', field: 'seq', title: '序号', width: 300 },
    {
      field: 'name',
      title: '名称1',
      children: [
        {
          field: 'test',
          width: 300,
          title: 123
        },
        {
          field: 'test1',
          title: 'adfasdf'
        }
      ]
    },
    {
      field: 'name',
      title: '名称2',
      children: [
        {
          field: 'test',
          title: 123
        },
        {
          field: 'test1',
          title: 'adfasdf'
        }
      ]
    },
    {
      field: 'role',
      title: '角色',
      width: 450,
      showOverflow: false,
      formatter({ cellValue }) {
        return 'hello world' + cellValue;
      }
    },
    { field: 'sex', title: '性别', with: 400 }
  ];
};

async function onSearch() {
  loading.value = true;
  // 模拟数据
  const mockList = [];
  for (let index = 0; index < 5000; index++) {
    mockList.push({
      id: index,
      name: 'Test' + index,
      role: 'Developer123122312321',
      sex: '男'
    });
  }
  pagerConfig.total = 50000;
  tableData.value = mockList;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const handlePageChange = ({ currentPage, pageSize }) => {
  pagerConfig.currentPage = currentPage;
  pagerConfig.pageSize = pageSize;
  onSearch();
};

onSearch();

setTimeout(() => {
  nextTick(() => {
    // 获取所有列配置
    const $table = vxeTableRef.value;
    if ($table) {
      loading.value = true;
      columns1.value = $table.getColumns();
      setTimeout(() => {
        loading.value = false;
      }, 800);
    }
  });
}, 100);

const changeColumn = () => {
  columns1.value[0].visible = !columns1.value[0].visible;
  console.log('pageList.vue文件 96==============行打印=', columns1.value);
  vxeTableRef.value.refreshColumn();
};

// const {
//   loading,
//   pagination,
//   onSearch,
//   form,
//   matchEventList,
//   handleCurrentChange,
//   handlePageSizeChange,
//   matchInfo,
//   exportFile
// } = useEventQueryHook();
</script>

<style lang="scss">
.export_dialog {
  .el-message-box__btns {
    flex-direction: row;
  }
}
</style>
