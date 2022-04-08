<template>
  <a-drawer
    title="题目详情"
    placement="right"
    width="600"
    :closable="false"
    v-model:visible="visible"
    :after-visible-change="afterVisibleChange"
  >
    <a-descriptions v-if="showContent">
      <a-descriptions-item label="题目" :span="12">{{ topicData.title }}</a-descriptions-item>
      <a-descriptions-item label="分类" :span="12">{{ classifyName }}</a-descriptions-item>
      <a-descriptions-item label="答案" :span="12">{{
        topicData.answer.answer
      }}</a-descriptions-item>
      <a-descriptions-item label="公司" :span="12">{{ topicData.company }}</a-descriptions-item>
      <a-descriptions-item label="作者" :span="12">
        {{ topicData.author }}
      </a-descriptions-item>
    </a-descriptions>

  <a-button v-if="showContent" type="primary" shape="round" size="large" @click="detailUpdateData">
    编辑
  </a-button>
  </a-drawer>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, Ref, useAttrs } from 'vue';
import { useRouter } from 'vue-router';
  import { getTopicDetailById, getClassify } from '../service';
  export default defineComponent({
    setup() {
      const router = useRouter()
      const visible = ref<boolean>(false);
      const topicId: Ref<number> = ref(0);
      const topicData: Ref<any> = ref({});
      const classifyData: Ref<any[]> = ref([]);

      const classifyName = computed(() =>
        classifyData.value?.filter((i) => i.id === topicData.value?.classify_id)?.[0]?.['title']
      );
      const showContent = computed(() => JSON.stringify(topicData.value) !== '{}');
      const queryClassify = async () => {
        // @ts-ignore
        const res = await getClassify();
        console.log('queryClassify', res);
        if (+res.code === 0) {
          classifyData.value = res.data;
        }
      };

      const queryTopicDetailById = async () => {
        // @ts-ignore
        const res = await getTopicDetailById(topicId.value);
        if (+res.code === 0) {
        console.log('queryTopicDetailById', res);
          topicData.value = res.data;
        }
      };

      const afterVisibleChange = (bool: boolean) => {
        console.log('visible', bool);
      };

      const showDrawer = (id) => {
        topicId.value = id;
        console.log('id', id);
        queryTopicDetailById();
        visible.value = true;
      };

        const detailUpdateData = async () => {
        // detailUpdateLoading.value = [id];
        // const res: boolean = await store.dispatch('ListTable/queryUpdateData', id);
        // if (res === true) {
        //   setUpdateFormVisible(true);
        // }
        // detailUpdateLoading.value = [];
        router.push({
          path: '/pagesample/question/add',
          query: {
            id: topicData.value.id,
          },
        });
      };

      queryClassify();

      return {
        visible,
        afterVisibleChange,
        showDrawer,
        classifyName,
        showContent,
        topicData,
        detailUpdateData
      };
    },
  });
</script>
