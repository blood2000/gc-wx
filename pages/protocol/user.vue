<template>
  <!-- <web-view src="../assets/protocol/protocol.html"></web-view> -->
  <view class="web-box">
		<view class="status-bar"></view>
		<web-view src="http://124.71.47.217:8092/static/privacy.html"></web-view>
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

.text-box {
  padding: 10rpx 30rpx;
}

.text-box > p {
  margin: 10pt 0;
  font-family: "Microsoft YaHei";
  font-size: 12pt;
  color: #333;
  font-weight: bold;
}

.text-box > .content {
  color: #666;
  font-weight: normal;
}

.text-box .fw {
  color: #333;
  font-weight: bold;
}

.text-box .table-box {
  box-sizing: border-box;
  padding: 10pt 30pt;
  width: 100%;
  font-size: 11pt;
  overflow-x: auto;
}
</style>