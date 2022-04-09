<template>
  <div class="indexlayout-main-conent">
    <a-card :bordered="false">
      <template #title>
        <a-button type="primary" @click="() => setCreateFormVisible(true)">新增</a-button>
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
        :pagination="false"
      >
        <template #icon="{ text }">
          <a-image :width="30" :src="text" />
        </template>
        <template #title="{ text }">
          <a-tag :color="getOneInArray()">{{ text }}</a-tag>
          <!-- {{ text }} -->
        </template>

        <template #action="{ record }">
          <a-button
            type="link"
            @click="() => detailUpdateData(record.id)"
            :loading="detailUpdateLoading.includes(record.id)"
            >编辑</a-button
          >
          <a-button
            type="link"
            @click="() => deleteTableData(record.id)"
            :loading="deleteLoading.includes(record.id)"
            >删除</a-button
          >
        </template>
      </a-table>

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
  import {
    getClassify,
    createClassify,
    removeClassify,
    getClassifyById,
    updateClassify,
  } from './service';

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
    },
    setup(): ListTablePageSetupData {
      const store = useStore<{ ListTable: ListStateType }>();
      const list = ref([]);
      // 列表数据

      // 列表分页
      const pagination = computed<PaginationConfig>(
        () => store.state.ListTable.tableData.pagination
      );

      function getOneInArray() {
        const colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
        let color = colors[Math.floor(Math.random() * colors.length)];
        return color;
      }

      // 列表字段
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          width: 80,
          align: 'center',
        },
        {
          title: '图标',
          dataIndex: 'icon',
          slots: { customRender: 'icon' },
        },
        {
          title: '名称',
          dataIndex: 'title',
          slots: { customRender: 'title' },
        },
        {
          title: '备注',
          dataIndex: 'desc',
        },
        {
          title: '是否可见',
          dataIndex: 'visible',
          align: 'center',
          customRender: ({ text, index }: { text: any; index: number }) => (text ? '是' : '否'),
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
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

      const getAllClassify = async () => {
        const res = await getClassify();
        list.value = res.data;
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
        console.log('values', values);
        createSubmitLoading.value = true;
        // const res: boolean = await store.dispatch('ListTable/createTableData', values);
        const res = await createClassify(values);
        console.log('res=>', res);
        if (+res.code === 0) {
          resetFields();
          setCreateFormVisible(false);
          message.success('新增成功！');
          getAllClassify();
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
        const res = await updateClassify(values);
        if (+res.code === 0) {
          updataFormCancel();
          message.success('编辑成功！');
          getAllClassify();
        }
        updateSubmitLoading.value = false;
      };

      // 编辑弹框 data
      const getDataById = async (id) => {
        return await getClassifyById(id);
      };
      const updateData = ref({});
      //   const updateData = computed<Partial<TableListItem>>(() => store.state.ListTable.updateData);
      const detailUpdateLoading = ref<number[]>([]);
      const detailUpdateData = async (id: number) => {
        detailUpdateLoading.value = [id];
        const res = await getDataById(id);
        if (+res.code === 0) {
          res.data.visible = String(res.data.visible);
          updateData.value = res.data;
          setUpdateFormVisible(true);
        }
        detailUpdateLoading.value = [];
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
            // const res: boolean = await store.dispatch('ListTable/deleteTableData', id);
            const res: boolean = await removeClassify(id);
            console.log('del-res', res);
            if (+res.code === 0) {
              message.success('删除成功！');
              getAllClassify();
            }
            deleteLoading.value = [];
          },
        });
      };

      onMounted(() => {
        getList(1);
        getAllClassify();
      });

      return {
        columns,
        list,
        pagination,
        loading,
        getList,
        createFormVisible,
        setCreateFormVisible,
        createSubmitLoading,
        createSubmit,
        detailUpdateLoading,
        detailUpdateData,
        updateData,
        updateFormVisible,
        updataFormCancel,
        updateSubmitLoading,
        updateSubmit,
        deleteLoading,
        deleteTableData,
        getOneInArray,
      };
    },
  });
</script>
