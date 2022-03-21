const apiUrl = {
  login: '/fmswxmp/login/wx_login',//微信授权登录
  login_test: '/fmswxmp/login/wxlogin',//微信授权登录
  dispatchList: '/fmswxmp/basic/appointCarOrder/v1/pagingDriverAppointCarOrder',//运输服务单列表
  receive: '/fmswxmp/basic/appointCarOrder/v1/receive',//接单
  cancel: '/fmswxmp/basic/appointCarOrder/v1/cancel',//取消
  load: '/fmswxmp/basic/appointCarOrder/v1/load',//出车
  unLoad: '/fmswxmp/basic/appointCarOrder/v1/unload',//回车
  vehicleOrderDetail: '/fmswxmp/basic/appointCarOrder/v1/detailAppointCarOrder',//派车单详情，地址后加code /${code}
  uploadImg: '/fmswxmp/system/common/v1/upload',//出车、回车凭证上传
  receiveAgain: '/fmswxmp/basic/appointCarOrder/v1/keepOnGenAppointCarOrder',//再次接单，地址加/{code}/{flag}

}

export default apiUrl