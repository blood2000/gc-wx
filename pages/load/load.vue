<!-- 出车 -->
<template>
  <div class="content">
    <div class="fms-box">
      <div class="box-title1">
        拍照凭证 <span v-if="edit">（最多上传9张）</span>
      </div>
      <div class="fms-img-box">
        <!-- 用户上传图片，触发实现 -->

        <block v-for="(item, index) in imgSuccessList" :key="index">
          <div class="img-box" :class="activeIndex === index ? 'active' : ''">
            <div class="img" @click="imgPreview(index)">
              <img :src="item" alt="图片" />
            </div>
            <div
              v-show="edit"
              class="close-icon"
              @click="deleteImg(index)"
            ></div>
          </div>
        </block>

        <div
          v-if="imgSuccessList.length < 9 && edit"
          class="load-temp img-box"
          @click="importTem"
        >
          <uni-icons type="camera" color="#a2a2a2" size="30"></uni-icons>
        </div>
        <div class="no-img" v-if="!imgSuccessList && !edit">无</div>
      </div>
    </div>
    <div class="btn-box fixed-bottom" v-if="edit">
      <div class="as-btn" @click="submit">提交</div>
    </div>
    <img-preview
      v-if="showPreview"
      :src="previewSrc"
      @close="close"
      @pre="pre"
      @next="next"
    ></img-preview>
  </div>
</template>

<script>
import { uniRequest, uniUpload } from "../../config/request";
import ImgPreview from "../../components/ImgPreview.vue";
export default {
  data() {
    return {
      appointCarOrderCode: "", //派车单号
      edit: true, //是否编辑
      imgSuccessList: [], //已上传的图片列表
      imgSrcList: [],
      // localImageList: [],
      // localImageFiles: [],
      attrs: [],
      showPreview: false,
      previewSrc: "",
      activeIndex: -1,
      loactionInfo: {
        latitude: '',
        longitude: '',
      },
    };
  },

  components: { ImgPreview },

  computed: {},

  onLoad(option) {
    let params = JSON.parse(option.params);
    console.log(params);
    this.appointCarOrderCode = params.code;
    this.edit = params.edit;
    console.log(this.appointCarOrderCode);
    if (this.edit === 0) {
      const config = {
        url: "vehicleOrderDetail",
        method: "GET",
        params: {
          code: this.appointCarOrderCode,
        },
      };
      uniRequest(config).then((res) => {
        console.log("派车单详情-->", res);
        this.imgSuccessList = res.data.data.transInfo.loadAttrs;
      });
      uni.setNavigationBarTitle({
        title: "出车凭证",
      });
    } else {
      uni.setNavigationBarTitle({
        title: "出车",
      });
    }
    this.getLocation();
  },

  methods: {
    getLocation() {
      let that = this;
      wx.getLocation({
        type: "wgs84",
        success(res) {
          console.log('定位信息', res);
          that.loactionInfo.latitude = res.latitude || -1;
          that.loactionInfo.longitude = res.longitude || -1;
          
        },
      });
    },
    importTem() {
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: (res) => {
          // console.log("本地图片文件", res.tempFiles);
          this.imgSrcList = res.tempFilePaths;
          this.uploadImg();
        },
      });
    },
    // 上传图片
    uploadImg() {
      let limitLen = 9 - this.imgSuccessList.length;
      let len =
        limitLen > this.imgSrcList.length ? this.imgSrcList.length : limitLen;

      uni.showLoading();
      for (let i = 0; i < len; i++) {
        // this.imgSuccessList.push(this.imgSrcList[i]);
        // uni.hideLoading();
        const config = {
          url: "uploadImg",
          file: this.imgSrcList[i],
        };
        uniUpload(config)
          .then((res) => {
            uni.hideLoading();
            console.log("图片上传", res);
            this.imgSuccessList.push(res.data.code);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // 删除图片
    deleteImg(index) {
      this.imgSuccessList.splice(index, 1);
    },
    // 查看大图
    imgPreview(index) {
      this.showPreview = true;
      this.activeIndex = index;
      this.previewSrc = this.imgSuccessList[index];
    },
    close() {
      this.showPreview = false;
    },
    pre() {
      this.activeIndex > 0 && this.activeIndex--;
      this.previewSrc = this.imgSuccessList[this.activeIndex];
    },
    next() {
      this.activeIndex < this.imgSuccessList.length - 1 && this.activeIndex++;
      this.previewSrc = this.imgSuccessList[this.activeIndex];
    },
    submit() {
      if (this.imgSuccessList.length === 0) {
        uni.showToast({
          title: "请上传凭证!",
          duration: 1500,
          icon: "error",
        });
        return;
      }
      const config = {
        url: "load",
        method: "POST",
        data: {
          appointCarOrderCode: this.appointCarOrderCode,
          attrs: this.imgSuccessList,
          latitude: this.loactionInfo.latitude,
          longitude: this.loactionInfo.longitude,
        },
      };
      uniRequest(config).then((res) => {
        console.log("出车请求->", res);
        uni.showModal({
          title: "提示",
          content: res.data.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.content {
  padding: 40rpx 0;
}
.close-icon {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 32rpx;
  height: 32rpx;
  background: url("../../static/delete.png");
  background-size: 32rpx 32rpx;
}

.active {
  box-shadow: 2rpx 4rpx 20rpx 0 rgba(22, 15, 15, 0.6);
}
</style>