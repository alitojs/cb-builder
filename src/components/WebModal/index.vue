<template>
  <a-modal
    class="modalStyle"
    :width="500"
    :visible="visible"
    @cancel="onClose"
    @ok="confirmClick"
    maskClosable
    title="title"
  >
    <a-spin :spinning="spinning">
      <div class="modalContent">
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: "Modal",
  emits: ["confirm"],
  data() {
    return {
      spinning: false,
      visible: false,
    };
  },
  methods: {
    // 打开弹框
    open() {
      this.visible = true;
    },
    // 弹窗关闭事件
    onClose() {
      this.spinning = false;
      this.visible = false;
    },
    // 确认按钮点击事件
    confirmClick() {
      this.$emit("confirm");
      this.spinning = false;
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="less">
.modalStyle {
  .modalContent {

  }
}
</style>
