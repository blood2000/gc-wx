<!-- 卡片组件 -->
<template>
  <view class="card-list" @click="toDetail">
    <!-- 卡片头部 -->
    <view class="card-header">
      <view class="card-header-left">{{ cardInfo.title }}</view>
      <view class="card-header-right">
        <view class="card-header-right-text me-text-beyond">
          {{ cardInfo.teamName }}
        </view>
      </view>
    </view>
    <view class="card-second">
      <view class="card-second-left">
        指派车辆: <span>{{ cardInfo.vehicleNumber }} </span>
      </view>
      <view class="card-second-right">
        {{ cardInfo.appointCarOrderTime }}
      </view>
    </view>
    <view class="card-third">
      <view class="addr-box start-addr">
        <view class="start-icon">
          <img src="../static/start_address.png" alt="装货" />
        </view>
        <view class="addr-alias"> {{ cardInfo.loadAddressAlias }} </view>
        <view class="addr-detail">
          {{ cardInfo.loadFormattedAddress }}{{ cardInfo.loadAddressAlias }}
        </view>
        <!-- <view class="addr-detail"> {{cardInfo.loadFormattedAddress}} </view> -->
      </view>
      <view class="addr-box end-addr">
        <view class="start-icon">
          <img src="../static/end_address.png" alt="装货" />
        </view>
        <view class="addr-alias"> {{ cardInfo.unloadAddressAlias }} </view>
        <view class="addr-detail">
          {{ cardInfo.unloadFormattedAddress }}{{ cardInfo.unloadAddressAlias }}
        </view>
      </view>
    </view>
    <view class="card-remark me-text-beyond" v-if="cardInfo.remark">
      {{ cardInfo.remark }}
    </view>
    <view class="card-btn-box" v-if="status === 0">
      <!-- <view class="as-card-btn left-btn" @click.stop="cancel">取消</view> -->
      <view class="as-card-btn" @click.stop="accept">接单</view>
    </view>

    <view class="card-btn-box" v-if="status === 1">
      <view class="as-card-btn" @click.stop="load(1)">出车</view>
    </view>

    <view class="card-btn-box" v-if="status === 2">
      <view class="as-card-btn left-btn" @click.stop="load(0)"> 出车凭证 </view>
      <view class="as-card-btn" @click.stop="unLoad(1)">回车</view>
    </view>
    <view class="card-btn-box" v-if="status === 3">
      <view class="as-card-btn left-btn" @click.stop="load(0)"> 出车凭证 </view>
      <view class="as-card-btn" @click.stop="unLoad(0)">回车凭证</view>
    </view>
  </view>
</template>

<script>
import format from "../utils/format.js";
export default {
  data() {
    return {
      appointCarOrderCode: "",
    };
  },

  props: {
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: Number,
      required: false,
    },
  },

  computed: {},

  onLoad() {
    console.log("yyyyyyy");
  },

  onShow() {
    console.log("this.cardInfo");
    this.dispatchDate = format.dateFormat(
      new Date(),
      "{y}-{m}-{d} {h}:{i}:{s}"
    );
    console.log(this.dispatchDate);
  },

  methods: {
    toDetail() {
      this.$emit("toDetail", this.cardInfo);
    },

    // 接单
    accept() {
      this.$emit("receive", this.cardInfo.appointCarOrderCode);
    },
    // 接单
    cancel() {
      this.$emit("cancel", this.cardInfo.appointCarOrderCode);
    },

    // 出车
    load(leap) {
      let params = {
        code: this.cardInfo.appointCarOrderCode,
        edit: leap,
      };
      this.$emit("load", params);
    },
    // 回车
    unLoad(leap) {
      let params = {
        code: this.cardInfo.appointCarOrderCode,
        edit: leap,
      };
      this.$emit("unLoad", params);
    },
  },
};
</script>
<style lang='scss' scoped>
/* 卡片组件 */

.card-list {
  position: relative;
  box-sizing: border-box;
  width: 92%;
  // height: 480rpx;
  margin:10rpx auto 40rpx;
  padding: 80rpx 20rpx 20rpx;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 6rpx 20rpx 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-header {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100%;
  height: 80rpx;
  display: flex;
  justify-content: space-between;
}

.card-header-left {
  padding: 20rpx 20rpx 0;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.card-header-right {
  padding: 0 10rpx;
  min-width: 160rpx;
  max-width: 300rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 80rpx;
  color: #ff8727;
  background: #fbf1ea;
  border-radius: 0 0 0 20rpx;
}

.card-second {
  margin: 10rpx 0;
  padding: 10rpx 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-second-left {
  font-size: 24rpx;
  span {
    padding-left: 10rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
}

.card-second-right {
  color: #999;
  font-size: 26rpx;
}

.card-third {
  margin-bottom: 20rpx;
}

.addr-box {
  position: relative;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  height: 70rpx;
  color: #333;
  font-size: 28rpx;
  .start-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .addr-alias,
  .addr-detail {
    // max-width: 44%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .addr-alias {
    max-width: 44%;
  }

  .addr-detail {
    flex: 1;
    color: #979797;
    font-size: 24rpx;
    margin-left: 20rpx;
  }
}

// .start-addr::after {
//   position: absolute;
//   content: "";
//   top: 60rpx;
//   left: 18rpx;
//   width: 4rpx;
//   height: 18rpx;
//   background: #c4d7ff;
// }

.card-remark {
  height: 68rpx;
  line-height: 68rpx;
  padding: 0 20rpx;
  background: #F4F5F7;
  color: #ACACAC;
  font-size: 24rpx;
  border-radius: 6rpx;
}

.card-btn-box {
  padding: 30rpx 20rpx 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.as-card-btn {
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  padding: 0 30rpx;
  border-radius: 10rpx;
  background: #3A65FF;
  color: #fff;
  font-size: 28rpx;
}

.left-btn {
  margin-right: 20rpx;
}
</style>