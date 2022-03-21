<!-- 出车 -->
<template>
  <div class="content">
    <!--  -->
    <div class="detail-box">
      <div class="item-line item-title">基本信息</div>
      <div class="item-line">
        <div class="item-left">派车单号</div>
        <div class="item-right">{{ detailInfo.appointCarOrderNo }}</div>
      </div>
      <div class="item-line">
        <div class="item-left">企业名称</div>
        <div class="item-right">{{ detailInfo.companyName }}</div>
      </div>
      <div class="item-line">
        <div class="item-left">发货人</div>
        <div class="item-right">{{ detailInfo.shipmentName }}</div>
      </div>
      <div class="item-line">
        <div class="item-left">发货人电话</div>
        <div class="item-right">{{ detailInfo.shipmentPhone }}</div>
      </div>
    </div>
    <div class="detail-box">
      <div class="item-line item-title">承运信息</div>
      <div class="item--msg-box">
        <div class="item-msg-title">{{ detailInfo.carryInfo.teamName }}</div>
        <div class="item-msg">
          <div class="msg msg-name">{{ detailInfo.carryInfo.driverName }}</div>
          <div class="msg msg-tel">{{ detailInfo.carryInfo.driverPhone }}</div>
        </div>
      </div>
    </div>
    <div class="detail-box">
      <div class="item-line item-title">运输信息</div>
      <div class="item-line">
        <div class="item-left">货物类型</div>
        <div class="item-right">{{ detailInfo.goodsSmallTypeName }}</div>
      </div>
      <div class="item-date remark-box">
        <div>接单时间</div>
        <div>{{ detailInfo.transInfo.receiveTime || "-" }}</div>
      </div>
      <div class="item--msg-box">
        <div class="item-msg">
          <div class="msg-box msg-start-addr">
            <div class="title1 msg-title">
              {{ detailInfo.transInfo.loadAddress || "-" }}
            </div>
            <div class="msg-content">
              {{ detailInfo.transInfo.loadFormattedAddress || "-" }}
              {{ detailInfo.transInfo.loadAddress || "-" }}
            </div>
            <div class="msg-content">
              <div class="msg-content-left">
                {{ detailInfo.transInfo.loadLinkManName || "-" }}
              </div>
              <div>{{ detailInfo.transInfo.loadLinkManPhone || "-" }}</div>
            </div>
          </div>

          <div class="item-date remark-box" v-if="detailInfo.status >= 20">
            <div>出车时间</div>
            <div>{{ detailInfo.transInfo.loadTime || "-" }}</div>
          </div>

          <div class="splite-line"></div>

          <div class="msg-box msg-end-addr">
            <div class="title1 msg-title">
              {{ detailInfo.transInfo.unloadAddress || "-" }}
            </div>
            <div class="msg-content">
              {{ detailInfo.transInfo.unloadFormattedAddress || '-' }}
              {{ detailInfo.transInfo.unloadAddress || '-' }}
            </div>
            <div class="msg-content">
              <div class="msg-content-left">
                {{ detailInfo.transInfo.unloadLinkManName || '-' }}
              </div>
              <div>{{ detailInfo.transInfo.unloadLinkManPhone || '-' }}</div>
            </div>
          </div>
          <div class="remark-box" v-if="detailInfo.status === 30">
            <div class="item-date">
              <div>回车时间</div>
              <div>{{ detailInfo.transInfo.unloadTime }}</div>
            </div>
            <div class="item-date">
              <div>货物净重</div>
              <div>{{ detailInfo.transInfo.unloadWeight || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-box">
      <div class="item-line item-title">运费信息</div>
      <div class="item-line">
        <div class="item-left">结算方式</div>
        <div class="item-right">
          {{ settlementWay[detailInfo.settlementInfo.settlementWay] }}
        </div>
      </div>
      <!-- <div class="item-line" v-if="detailInfo.settlementInfo.settlementWay === 1">
        <div class="item-left">运费总额</div>
        <div class="item-right">
          {{ detailInfo.settlementInfo.driverRealFreight }}
        </div>
      </div> -->
      <div class="item-line" v-if="detailInfo.settlementInfo.settlementWay === 2">
        <div class="item-left">货物单价</div>
        <div class="item-right">
          {{ detailInfo.settlementInfo.driverRealFreight }}
        </div>
      </div>
    </div>
    <div class="detail-box" v-if="detailInfo.status >= 20">
      <div class="item-line item-title">出车凭证</div>
      <div class="item-img-box">
        <block
          v-for="(item, index) in detailInfo.transInfo.loadAttrs"
          :key="index"
        >
          <div class="item-img" @click="imgPreview(item)">
            <img :src="item" alt="凭证" />
          </div>
        </block>
        <div class="no-img" v-if="!detailInfo.transInfo.loadAttrs">
          暂无凭证
        </div>
      </div>
    </div>
    <div class="detail-box" v-if="detailInfo.status == 30">
      <div class="item-line item-title">回车凭证</div>
      <div class="item-img-box">
        <block
          v-for="(item, index) in detailInfo.transInfo.unloadAttrs"
          :key="index"
        >
          <div class="item-img" @click="imgPreview(item)">
            <img :src="item" alt="凭证" />
          </div>
        </block>
        <div class="no-img" v-if="!detailInfo.transInfo.unloadAttrs">
          暂无凭证
        </div>
      </div>
    </div>
    <img-preview
      v-if="showPreview"
      :src="previewSrc"
      @close="close"
    ></img-preview>
  </div>
</template>

<script>
import { uniRequest } from "../../../config/request";
import ImgPreview from "../../../components/ImgPreview.vue";
export default {
  data() {
    return {
      code: "", //派车单号
      detailInfo: {},
      showPreview: false,
      previewSrc: "",
      settlementWay: {
        1: "车次",
        2: "净重",
      },
    };
  },

  components: { ImgPreview },

  computed: {},

  onLoad(option) {
    this.code = option.code;
  },
  onShow() {
    const config = {
      url: "vehicleOrderDetail",
      method: "GET",
      params: {
        code: this.code,
      },
      jumpUrl: '../../login/login'
    };
    uniRequest(config).then((res) => {
      console.log("派车单详情-->", res);
      this.detailInfo = res.data.data;
    });
  },

  methods: {
    // 查看大图
    imgPreview(src) {
      this.showPreview = true;
      // this.activeIndex = index;
      this.previewSrc = src;
    },
    close() {
      this.showPreview = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.content {
  padding: 40rpx 0;
  overflow-y: auto;
}
.msg-name {
  height: 70rpx;
  line-height: 70rpx;
  background: url(../../../static/name.png) center no-repeat;
  background-size: 38rpx 38rpx;
  background-position: 2rpx center;
}

.msg-tel {
  height: 70rpx;
  line-height: 70rpx;
  background: url(../../../static/telno.png) center no-repeat;
  background-size: 38rpx 38rpx;
  background-position: 2rpx center;
}

.msg-start-addr {
  background: url(../../../static/start_address.png) center no-repeat;
  background-size: 38rpx 38rpx;
  background-position: 2rpx 16rpx;
}

.msg-end-addr {
  background: url(../../../static/end_address.png) center no-repeat;
  background-size: 38rpx 38rpx;
  background-position: 2rpx 16rpx;
}
</style>