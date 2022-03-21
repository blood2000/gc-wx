<!-- 回车 -->
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
    <div class="detail-box">
      <div class="item-line input-line">
        <div class="item-left">运输净重</div>
        <div class="item-right item-input-box" v-if="edit">
          <input
            type="text"
            class="item-input"
            placeholder="请输入"
            v-model="weight"
            @input="weightInput"
          />
          <span>吨</span>
        </div>
        <div class="item-right item-input-box" v-else>
          <input type="text" class="item-input" :value="weight" disabled />
        </div>
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
import Vue from "vue";
import formFilter from "../../utils/filter";
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
      weight: "", //净重
      temp: "",
      showPreview: false,
      previewSrc: "",
      activeIndex: -1,
      settlementWay: 2,
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
      uni.setNavigationBarTitle({
        title: "回车凭证",
      });
    } else {
      uni.setNavigationBarTitle({
        title: "回车",
      });
    }
    const config = {
      url: "vehicleOrderDetail",
      method: "GET",
      params: {
        code: this.appointCarOrderCode,
      },
    };
    uniRequest(config).then((res) => {
      console.log("派车单详情-->", res);
      if (this.edit === 0) {
        this.imgSuccessList = res.data.data.transInfo.unloadAttrs;
        this.weight = res.data.data.transInfo.unloadWeight || 0;
      }

      this.settlementWay = res.data.data.settlementInfo.settlementWay;
    });
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
        uniUpload(config).then((res) => {
          console.log("图片上传", res);
          uni.hideLoading();
          this.imgSuccessList.push(res.data.code);
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
    // 净重输入
    weightInput(e) {
      setTimeout(() => {
        let value = e.detail.value;
        if (value != "" && formFilter.priceFilter(value)) {
          this.temp = value;
          // Vue.set(this.temp, "price", value);
        } else {
          if (value != "") {
            this.weight = this.temp;
            // Vue.set(this.editMsg, "price", this.temp.price);
          }
        }
      }, 0);
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
      if (!this.weight && this.settlementWay === 2) {
        uni.showToast({
          title: "请输入净重",
          duration: 1500,
          icon: "error",
        });
        return;
      }
      const config = {
        url: "unLoad",
        method: "POST",
        data: {
          appointCarOrderCode: this.appointCarOrderCode,
          attrs: this.imgSuccessList,
          weight: this.weight,
          latitude: this.loactionInfo.latitude,
          longitude: this.loactionInfo.longitude,
        },
      };
      uniRequest(config).then((res) => {
        console.log("回车请求->", res);
        if (res.data.data === 1) {
          uni.showModal({
            title: "提示",
            content: "回车成功，是否再次接单?",
            success: (res) => {
              if (res.confirm) {
                //点击确认
                this.receiveAgain(1);
              } else if (res.cancel) {
                this.receiveAgain(0);
              }
            },
          });
        } else {
          uni.showModal({
            title: "提示",
            content: "回车成功",
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
        }
      });
    },
    //再次接单
    receiveAgain(flag) {
      const config = {
        url: "receiveAgain",
        method: "POST",
        params: {
          code: this.appointCarOrderCode,
          flag: flag,
        },
      };
      uniRequest(config).then((res) => {
        console.log("再次接单", res);
        uni.navigateBack({
          delta: 1,
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