<template>
  <!-- <web-view src="../assets/protocol/protocol.html"></web-view> -->
   <view class="web-box">
		<view class="status-bar"></view>
		<web-view src="http://124.71.47.217:8092/static/protocol.html"></web-view>
	</view>
</template>

<script>

export default {
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.text-content {
  padding: 0 30rpx 10pt;
  color: #333;
}
.text-content > p {
  margin: 10pt 0;
}
</style>
