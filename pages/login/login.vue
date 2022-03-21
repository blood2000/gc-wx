<template>
  <view class="content">
    <view class="login-center">
      <view class="logo">
        <img src="../../static/wx_logo.png" alt="" />
      </view>
      <view class="app-name">至简管车司机助手</view>
      <view class="userinfo">
        <!-- <block v-if="!hasUserInfo"> -->
        <block>
          <!-- <button class="wx-btn" v-if="canIUseGetUserProfile" @click="getUserProfile"> -->
          <!-- <button class="wx-btn" v-if="!hasUserInfo" @click="getUserProfile">
						微信登录
					</button> -->
          <button
            v-if="isSubscribe"
            class="wx-btn"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            微信授权
          </button>
          <button
            v-else
            class="wx-btn"
            @click="forPrompt"
          >
            微信授权
          </button>
        </block>
        <!-- <block wx:else>
					<image @click="bindViewTap" class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover"></image>
					<text class="userinfo-nickname">{{ userInfo.nickName }}</text>
				</block> -->
      </view>
      <!-- <uni-popup ref="popup" type="message">
		    <uni-popup-message :type="msgType" :message="msg" :duration="2000"></uni-popup-message>
		</uni-popup> -->
      <div class="subscribe" @click="subscribe">
        <div class="as-check">
          <uni-icons
            v-show="isSubscribe"
            type="checkmarkempty"
            color="#1678ff"
            size="14"
          ></uni-icons>
        </div>
        <div>允许服务号向您发送消息</div>
      </div>
      <div class="protocol">
        授权即代表您已同意 <span @click="toProtocol">《服务协议》 </span>及<span
          @click="toPrivacy"
        >
          《隐私政策》
        </span>
      </div>
    </view>
  </view>
</template>

<script>
// import showToast from "../../components/popup/showToast.vue";
import urlConfig from "../../config/urlConfig.js";
import { mapState, mapMutations } from "vuex";
import { uniRequest } from "../../config/request.js";
export default {
  data() {
    return {
      title: "login",
      isSubscribe: false,
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: false,
      isGetTel: false,
      code: "",
      data: {},
    };
  },
  computed: {
    ...mapState({
      headerInfo: (state) => state.user.headerInfo,
    }),
  },
  components: {
    // showToast,
  },
  onLoad() {
    //uni.clearStorage();
    console.log(this.headerInfo);
    // uni.navigateTo({
    //   url: "../index/index",
    // });
  },

  onShow() {
    console.log("login show");
    this.wxLogin();
    // const me = this;
    // console.log("login show");
    // if (me.telno) return;
    // me.telno = uni.getStorageSync("telno");
    // this.getUserProfile();
  },
  methods: {
    wxLogin() {
      let that = this;
      wx.login({
        success(res) {
          console.log(res);
          if (res.code) {
            that.code = res.code;
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
      if (wx.getUserProfile) {
        this.canIUseGetUserProfile = true;
      }
    },
    subscribe() {
      this.isSubscribe = !this.isSubscribe;
      if (!this.isSubscribe) {
        return;
      }
      let tmpId1 = "Cp7GF_YB8Y9lUo4lZ3R7dq-k2EGw3026Fp3M3cN2P_c";
      let that = this;
      wx.requestSubscribeMessage({
        tmplIds: [tmpId1],
        success(res) {
          console.log("订阅询问", res[tmpId1]);
          //取消
          if (res[tmpId1] === "reject") {
            that.isSubscribe = false;
          }
        },
        fail(error) {
          console.log("订阅失败", error);
        },
      });
    },
    forPrompt() {
      if (!this.isSubscribe) {
        uni.showToast({
          title: "请勾选允许服务号向您发送消息!",
          icon: "none",
          duration: 1500,
        });
      }
    },
    getPhoneNumber(e) {
      console.log(e);
      // uni.navigateTo({
      //   url: "../tranServe/index",
      // });
      // return;
      

      let that = this;
      // encryptedData: res.encryptedData,
      // ivStr: res.iv,
      if (!e.detail.encryptedData) {
        return;
      }
      
      that.data.encryptedData = e.detail.encryptedData;
      that.data.ivStr = e.detail.iv;
      that.data.code = that.code;
      that.data.appId = "wx763fd03600fb1e0c";
      console.log("微信iv、encrypted ==>>", that.data);
      // const baseUrl = urlConfig.BASE_URL;
      const config = {
        url: "login_test",
        method: "POST",
        data: that.data,
        noToken: true,
      };
      uniRequest(config).then((res) => {
        console.log("微信授权-->", 123);
        if (res.data.data.code === 200) {
          let avatarUrl = uni.getStorageSync("avatar");
          let token = res.data.data.data.access_token;
          uni.setStorageSync("token", token);

          uni.redirectTo({
            url: "../tranServe/index",
          });
        } else {
          uni.showModal({
            title: "提示",
            content: res.data.data.msg,
            showCancel: false,
            success: (res) => {
              this.wxLogin();
            },
          });
        }
      });
      // wx.request({
      //   url: baseUrl + "/kydsz/user/kydwx_login",
      //   method: "POST",
      //   data: that.data,
      //   header: {
      //     "Content-Type": "application/json",
      //     ...urlConfig.defaultHeaders,
      //   },
      //   success: (res) => {
      //     console.log("微信登录-->", res);
      //     if (res.data.code === 200) {
      //       let avatarUrl = uni.getStorageSync("avatar");
      //       let token = res.data.data.access_token;
      //       uni.setStorageSync("token", token);

      //       uni.switchTab({
      //         url: "../index/index",
      //       });
      //     } else {
      //       uni.showModal({
      //         title: "提示",
      //         content: res.data.msg,
      //         showCancel: false,
      //       });
      //     }
      //   },
      // });
    },
    getUserProfile(e) {
      let that = this;
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res);
          this.isGetTel = true;
          this.userInfo = res.userInfo;
          this.$store.commit("setUserInfo", res.userInfo);
          uni.setStorageSync("avatar", res.userInfo.avatarUrl);
          this.hasUserInfo = true;
          this.data = {
            code: that.code,
            appId: "wx0c5ac8f3a338efe4",
            ...res.userInfo,
          };
          // data = { ...data, ...res.userInfo };
        },
      });
    },

    //跳转用户协议
    toProtocol() {
      uni.navigateTo({
        url: "../protocol/service",
      });
    },
    toPrivacy() {
      uni.navigateTo({
        url: "../protocol/user",
      });
    },
  },
};
</script>

<style>
.content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #ffffff;
}

.userinfo-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}

.prop {
  box-sizing: border-box;
  padding: 40rpx;
  width: 80%;
  height: 100px;
  background: #333;
  position: fixed;
  top: 30%;
  left: 10%;
  color: #fff;
  font-size: 24rpx;
  z-index: 200;
  word-break: break-word;
}

.main {
  box-sizing: border-box;
  position: absolute;
  padding: 100rpx 70rpx 0;
  top: 450rpx;
  left: 0;
  width: 100%;
  /* height: 1082rpx; */
  min-height: 500rpx;
  background: #ffffff;
  border-radius: 50rpx 50rpx 30rpx 30rpx;
}

.title1 {
  color: #333;
  font-size: 48rpx;
  font-weight: bold;
}

.title2 {
  color: #aaa;
  font-size: 28rpx;
}

.login-type {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0 8rpx;
  font-size: 28rpx;
  color: #333;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.protocol {
  margin-top: 40rpx;
  width: 100%;
  padding-left: 40rpx;
  color: #686868;
  font-size: 28rpx;
}

.protocol > span {
  color: #1678ff;
}

.subscribe {
  width: 100%;
  margin-top: 40rpx;
  padding-left: 40rpx;
  color: #686868;
  font-size: 26rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
}

.as-check {
  box-sizing: border-box;
  height: 30rpx;
  width: 30rpx;
  border: 1rpx solid #686868;
  text-align: center;
  line-height: 28rpx;
  margin-right: 20rpx;
  color: #1678ff;
}
</style>
