<template>
  <div class="indexlayout-main-conent">
    <a-card :bordered="false">
      <a-form
        :wrapper-col="{ xs: { span: 24 }, sm: { span: 12 }, md: { span: 10 } }"
        :label-col="{ xs: { span: 24 }, sm: { span: 7 } }"
      >
        <a-form-item label="题目" v-bind="validateInfos.title">
          <a-textarea v-model:value="modelRef.title" placeholder="请输入" />
        </a-form-item>

        <a-form-item label="分类" v-bind="validateInfos.classifyId">
          <a-select v-model:value="modelRef.classifyId" placeholder="请选择" allowClear>
            <a-select-option v-for="item in classifyList" :key="item.id" :value="item.id">{{
              item.title
            }}</a-select-option>
            <a-select-option value="2">select2</a-select-option>
            <a-select-option value="3">select3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="答案" v-bind="validateInfos.answer">
          <a-textarea v-model:value="modelRef.answer" placeholder="请输入" />
        </a-form-item>

        <a-form-item label="公司" v-bind="validateInfos.company">
          <a-input v-model:value="modelRef.company" placeholder="请输入" />
        </a-form-item>

        <a-form-item label="作者" v-bind="validateInfos.author">
          <a-input v-model:value="modelRef.author" placeholder="请输入" />
        </a-form-item>

        <a-form-item :wrapper-col="{ xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 } }">
          <a-button type="primary" @click="handleSubmit" :loading="submitLoading"> 提交 </a-button>
          <a-button @click="resetFields" style="margin-left: 10px"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, Ref, ref } from 'vue';
  import { useStore } from 'vuex';
  import { getAllClassify, createTopic, getTopicDetailById, updateTopic } from './service';
  import { Props, validateInfos } from 'ant-design-vue/lib/form/useForm';
  import { message, Form } from 'ant-design-vue';
  const useForm = Form.useForm;

  import useI18nAntdFormVaildateInfos from '@/composables/useI18nAntdFormVaildateInfos';
  import { FormDataType } from './data.d';
  import { StateType as FormStateType } from './store';
  import { useRoute, useRouter } from 'vue-router';

  interface FormBasicPageSetupData {
    resetFields: (newValues?: Props) => void;
    validateInfos: validateInfos;
    modelRef: FormDataType;
    submitLoading: Ref<boolean>;
    handleSubmit: (e: MouseEvent) => void;
  }

  export default defineComponent({
    name: 'FormBasicPage',
    setup() {
      const store = useStore<{ FormBasic: FormStateType }>();
      const route = useRoute();
      console.log('router', route.query.id, typeof route.query.id);
      const classifyList: Ref<any> = ref([]);
      const topicId: Ref<number> = ref(0);
      // 表单值
      const modelRef = reactive<FormDataType>({
        title: '',
        classifyId: undefined,
        answer: '',
        company: '',
        author: '',
      });
      // 表单验证
      const rulesRef = reactive({
        title: [
          {
            required: true,
            message: '必填',
          },
        ],

        classifyId: [
          {
            required: true,
            message: '请选择',
          },
        ],
        answer: [],
        company: [],
        author: [],
      });

      const getClassifyData = async () => {
        const res = await getAllClassify();
        if (+res.code === 0) {
          classifyList.value = res.data;
        }
      };

      const queryTopicDetailById = async () => {
        // @ts-ignore
        const res = await getTopicDetailById(route.query.id);
        console.log('res', res);
        if (+res.code === 0) {
          topicId.value = res.data.id;
          modelRef.title = res.data.title;
          modelRef.classifyId = res.data.classify_id;
          modelRef.answer = res.data.answer.answer;
          modelRef.company = res.data.company;
          modelRef.author = res.data.author;
        }
      };

      // 新增 题目
      const addTopic = async (payload) => {
        const res = await createTopic(payload);
        if (+res.code === 0) {
          message.success('提交成功');
          resetFields();
        }
      };

      // 更新题目
      const renewalTopic = async (payload) => {
        const res = await updateTopic(payload);
        if (+res.code === 0) {
          message.success('提交成功');
          resetFields();
        }
      };

      // 获取表单内容
      const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
      // 重置 validateInfos 如果用到国际化需要此步骤
      //const validateInfosNew = useI18nAntdFormVaildateInfos(validateInfos);

      // 登录loading
      const submitLoading = ref<boolean>(false);
      // 登录
      const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        submitLoading.value = true;
        try {
          const fieldsValue = await validate<FormDataType>();
          fieldsValue.classify_id = fieldsValue.classifyId;
          delete fieldsValue.classifyId;
          console.log('fieldsValue', fieldsValue);
          if (route.query.id) {
            fieldsValue.id = topicId.value;
            renewalTopic(fieldsValue);
            console.log('updateTopic');
          } else {
            addTopic(fieldsValue);
            console.log('addTopic');
          }
        } catch (error) {
          // console.log('error', error);
        }
        submitLoading.value = false;
      };

      if (route.query.id) {
        queryTopicDetailById();
      }

      onMounted(() => {
        getClassifyData();
      });

      return {
        resetFields,
        validateInfos,
        modelRef,
        submitLoading,
        classifyList,
        handleSubmit,
      };
    },
  });
</script>
