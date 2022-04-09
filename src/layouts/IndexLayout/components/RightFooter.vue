<template>
    <div class="indexlayout-right-footer">
      <div class="footer-links">
        <a
          href="https://github.com/SuYxh"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        <a href="https://juejin.cn/user/2084329779636094" target="_blank" rel="noreferrer">
          掘金
        </a>
        <a href="https://www.yuque.com/books/share/a89a772b-7c37-4737-9fe7-18d34dc7cabe?# 《Front-End》" target="_blank" rel="noreferrer">
          语雀
        </a>
      </div>
      <div>Copyright © 2022 Jarvis.CC, All Rights Reserved</div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'RightFooter',
    components: {
    }
})
</script>
<style lang="less" scoped>
.indexlayout-right-footer {
  height: 50px;
  margin-bottom: 30px;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  color: #808695;
  .footer-links {
    margin-bottom: 10px;
    a {
      margin-right: 30px;
      color: #808695;
      text-decoration: none;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: #515a6e;
      }
    }
  }
}
</style>