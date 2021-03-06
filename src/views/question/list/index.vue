<template>
  <div class="indexlayout-main-conent">
    <a-card :bordered="false">
      <template #title>
        <!-- <a-button type="primary" @click="() => setCreateFormVisible(true)">新增</a-button> -->
        <h4>All Question</h4>
      </template>
      <template #extra>
        <a-radio-group defaultValue="all">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="header">头部</a-radio-button>
          <a-radio-button value="footer">底部</a-radio-button>
        </a-radio-group>
        <a-input-search placeholder="请输入" style="width: 270px; margin-left: 16px" />
      </template>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :pagination="{
          ...pagination,
          onChange: (page) => {
            getAllList(page);
          },
        }"
      >
        <template #name="{ text, record }">
          <a :href="record.href" target="_blank">{{ text }}</a>
        </template>
        <template #type="{ record }">
          <a-tag v-if="record.type === 'header'" color="green">头部</a-tag>
          <a-tag v-else color="cyan">底部</a-tag>
        </template>
        <template #answer="{ record }">
          <!-- :loading="detailUpdateLoading.includes(record.id)" -->
          <a-button type="link" @click="() => viewDetail(record.id)">查看</a-button>
        </template>
        <template #action="{ record }">
          <!-- :loading="detailUpdateLoading.includes(record.id)" -->
          <a-button type="link" @click="() => detailUpdateData(record.id)">编辑</a-button>
          <a-button
            type="link"
            @click="() => deleteTableData(record.id)"
            :loading="deleteLoading.includes(record.id)"
            >删除</a-button
          >
        </template>
      </a-table>

      <PreviewTopic ref="topicDrawer" :topicId="topicId"></PreviewTopic>

      <create-form
        :visible="createFormVisible"
        :onCancel="() => setCreateFormVisible(false)"
        :onSubmitLoading="createSubmitLoading"
        :onSubmit="createSubmit"
      />

      <update-form
        v-if="updateFormVisible === true"
        :visible="updateFormVisible"
        :values="updateData"
        :onCancel="() => updataFormCancel()"
        :onSubmitLoading="updateSubmitLoading"
        :onSubmit="updateSubmit"
      />
    </a-card>
  </div>
</template>
<script lang="ts">
  import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from 'vue';
  import { useStore } from 'vuex';
  import { message, Modal } from 'ant-design-vue';
  import { Props } from 'ant-design-vue/lib/form/useForm';
  import CreateForm from './components/CreateForm.vue';
  import UpdateForm from './components/UpdateForm.vue';
  import { StateType as ListStateType } from './store';
  import { PaginationConfig, TableListItem } from './data.d';
  import { queryAllList, deleteTopic } from './service';
  import { useRouter } from 'vue-router';
  import PreviewTopic from './components/PreviewTopic.vue';

  interface ListTablePageSetupData {
    columns: any;
    list: ComputedRef<TableListItem[]>;
    pagination: ComputedRef<PaginationConfig>;
    loading: Ref<boolean>;
    getList: (current: number) => Promise<void>;
    createFormVisible: Ref<boolean>;
    setCreateFormVisible: (val: boolean) => void;
    createSubmitLoading: Ref<boolean>;
    createSubmit: (
      values: Omit<TableListItem, 'id'>,
      resetFields: (newValues?: Props | undefined) => void
    ) => Promise<void>;
    detailUpdateLoading: Ref<number[]>;
    detailUpdateData: (id: number) => Promise<void>;
    updateData: ComputedRef<Partial<TableListItem>>;
    updateFormVisible: Ref<boolean>;
    updataFormCancel: () => void;
    updateSubmitLoading: Ref<boolean>;
    updateSubmit: (
      values: TableListItem,
      resetFields: (newValues?: Props | undefined) => void
    ) => Promise<void>;
    deleteLoading: Ref<number[]>;
    deleteTableData: (id: number) => void;
  }

  export default defineComponent({
    name: 'ListTablePage',
    components: {
      CreateForm,
      UpdateForm,
      PreviewTopic,
    },
    setup() {
      const store = useStore<{ ListTable: ListStateType }>();
      const router = useRouter();
      const topicDrawer = ref(null);
      const allData: Ref<any> = ref({});
      const topicId: Ref<number> = ref(0);

      // 列表数据
      const list = computed<TableListItem[]>(() => allData.value?.list);

      // 列表分页
      //   const pagination = computed<PaginationConfig>(
      //     () => store.state.ListTable.tableData.pagination
      //   );

      const pagination = computed<PaginationConfig>(() => {
        return {
          current: allData.value.page,
          pageSize: allData.value.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          total: allData.value.totalCount,
        };
      });

      console.log('pagination', pagination.value);

      // 列表字段
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          width: 80,
          customRender: ({ text, index }: { text: any; index: number }) =>
            (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
        },
        {
          title: '分类',
          dataIndex: 'classify_id',
          slots: { customRender: 'classify_id' },
        },
        {
          title: '名称',
          dataIndex: 'title',
          slots: { customRender: 'title' },
        },
        {
          title: '答案',
          key: 'answer',
          align: 'center',
          width: 100,
          slots: { customRender: 'answer' },
        },
        {
          title: '收藏',
          dataIndex: 'collect',
        },
        {
          title: '浏览量',
          dataIndex: 'view',
          slots: { customRender: 'view' },
        },
        {
          title: '作者',
          dataIndex: 'author',
          slots: { customRender: 'author' },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          slots: { customRender: 'action' },
        },
      ];

      // 获取数据
      const loading = ref<boolean>(true);
      const getList = async (current: number): Promise<void> => {
        loading.value = true;
        await store.dispatch('ListTable/queryTableData', {
          per: pagination.value.pageSize,
          page: current,
        });
        loading.value = false;
      };

      const getAllList = async (current?: number) => {
        const res = await queryAllList({
          pageSize: pagination.value.pageSize,
          page: current || 1,
        });
        console.log('list2', res);
        allData.value = res.data;
      };

      // 新增弹框 - visible
      const createFormVisible = ref<boolean>(false);
      const setCreateFormVisible = (val: boolean) => {
        createFormVisible.value = val;
      };
      // 新增弹框 - 提交 loading
      const createSubmitLoading = ref<boolean>(false);
      // 新增弹框 - 提交
      const createSubmit = async (
        values: Omit<TableListItem, 'id'>,
        resetFields: (newValues?: Props | undefined) => void
      ) => {
        createSubmitLoading.value = true;
        const res: boolean = await store.dispatch('ListTable/createTableData', values);
        if (res === true) {
          resetFields();
          setCreateFormVisible(false);
          message.success('新增成功！');
          getList(1);
        }
        createSubmitLoading.value = false;
      };

      // 编辑弹框 - visible
      const updateFormVisible = ref<boolean>(false);
      const setUpdateFormVisible = (val: boolean) => {
        updateFormVisible.value = val;
      };
      const updataFormCancel = () => {
        setUpdateFormVisible(false);
        store.commit('ListTable/setUpdateData', {});
      };
      // 编辑弹框 - 提交 loading
      const updateSubmitLoading = ref<boolean>(false);
      // 编辑弹框 - 提交
      const updateSubmit = async (
        values: TableListItem,
        resetFields: (newValues?: Props | undefined) => void
      ) => {
        updateSubmitLoading.value = true;
        const res: boolean = await store.dispatch('ListTable/updateTableData', values);
        if (res === true) {
          updataFormCancel();
          message.success('编辑成功！');
          getList(pagination.value.current);
        }
        updateSubmitLoading.value = false;
      };

      // 编辑弹框 data
      const updateData = computed<Partial<TableListItem>>(() => store.state.ListTable.updateData);
      // const detailUpdateLoading = ref<number[]>([]);
      const detailUpdateData = async (id: number) => {
        // detailUpdateLoading.value = [id];
        // const res: boolean = await store.dispatch('ListTable/queryUpdateData', id);
        // if (res === true) {
        //   setUpdateFormVisible(true);
        // }
        // detailUpdateLoading.value = [];
        console.log('id', id);
        router.push({
          path: '/pagesample/question/add',
          query: {
            id,
          },
        });
      };

      // 删除 loading
      const deleteLoading = ref<number[]>([]);
      // 删除
      const deleteTableData = (id: number) => {
        Modal.confirm({
          title: '删除',
          content: '确定删除吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            deleteLoading.value = [id];
            const res = await deleteTopic(id);
            if (+res.code === 0) {
              message.success('删除成功！');
              getAllList(pagination.value.current);
            }
            deleteLoading.value = [];
          },
        });
      };

      const viewDetail = (id) => {
        topicId.value = id;
        (topicDrawer.value as any)?.showDrawer(id);
      };

      onMounted(() => {
        getList(1);
        getAllList(1);
        console.log('ref', topicDrawer.value);
      });

      return {
        columns,
        list,
        pagination,
        loading,
        getList,
        getAllList,
        createFormVisible,
        setCreateFormVisible,
        createSubmitLoading,
        createSubmit,
        detailUpdateData,
        updateData,
        updateFormVisible,
        updataFormCancel,
        updateSubmitLoading,
        updateSubmit,
        deleteLoading,
        deleteTableData,
        viewDetail,
        topicDrawer,
        topicId,
      };
    },
  });
</script>
