<!--  -->
<template>
  <div class="img-preview" :class="showModal ? 'modal' : ''" @click="close">
    <div class="preview-main" :class="showModal ? 'big' : ''" >
      <image :src="src" mode="aspectFit"></image>
      <!-- <div class="pre" @click="pre">
        <uni-icons type="arrowleft" color="#ccc" size="24"></uni-icons>
      </div>
      <div class="next" @click="next">
        <uni-icons type="arrowright" color="#ccc" size="24"></uni-icons>
      </div> -->
    </div>
    <!-- <div class="close" @click="close">
      <uni-icons type="closeempty" color="#ccc" size="26"></uni-icons>
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      showModal: false,
    };
  },

  components: {},

  computed: {},

  props: {
    src: {
      type: String,
      required: false,
    },
  },

  mounted() {
    setTimeout(() => {
      this.showModal = true;
    }, 10);
  },

  methods: {
    close() {
      this.showModal = false;
      this.$emit('close');
    },
    pre() {
      this.$emit('pre');
    },
    next() {
      this.$emit('next');
    },
  }
}

</script>
<style lang='scss' scoped>
.img-preview {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background .15s linear;
}

.modal {
  background: rgba(0,0,0,.4);
}

.preview-main {
  position: relative;
  width: 0;
  height: 0;
  // box-shadow: 0 0 20rpx 0 rgba(0,0,0,.4);
  // background: #fff;
  transition: all .15s linear;
}

.big {
  width: 100%;
  height: 100%;
}

.pre, .next {
  position: absolute;
  top: 0;
  width: 50rpx;
  height: 400rpx;
  // background: rgba(0,0,0,.4);
  text-align: center;
  line-height: 400rpx;
}

.pre {
  left: -60rpx;
}
.next {
  right: -60rpx;
}

.close {
  width: 80rpx;
  height: 80rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>