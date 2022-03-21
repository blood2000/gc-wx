<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    const token = uni.getStorageSync("token");
    console.log(process.env.NODE_ENV);
    
    if (!token) {
      uni.reLaunch({
        url: "pages/login/login", //跳转到登录页面--wx
        success() {
          // 手动关闭启动页(由于App.onLaunch方法和页面渲染是同时进行的，只有通过延长启动页的方法才能避免页面闪烁)
          if (process.env.NODE_ENV !== "development") {
            plus.navigator.closeSplashscreen();
          }
        },
      });
    } else {
      uni.redirectTo({
        url: "pages/tranServe/index",
      });
      if (process.env.NODE_ENV !== "development") {
        plus.navigator.closeSplashscreen();
      }
    }
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
@import "./common/common.css";
@import "./common/login.css";
@import "./common/fms.css";
/*每个页面公共css */
page {
  height: 100%;
  background: #f2f2f2;
}
</style>
