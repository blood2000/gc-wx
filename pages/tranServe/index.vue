<template>
  <view class="content">
    <!-- <view class="header">
      <view class="header-main"></view>
      <view class="header-radius"></view>
    </view> -->
    <!-- <div class="tab-header" :style="{ height: tabHeight + 'rpx' }"> -->
    <div class="tab-header">
      <image src="../../static/header-bg.png" mode=""></image>
      <view class="header-title">运输服务</view>
      <view class="main-header">
        <view class="slider-box" :class="'slider' + activeIndex">
          <view
            class="slider-item"
            v-for="(item, index) in sliderTabs"
            :key="index"
            :class="activeIndex === index ? 'active' : ''"
            @click="changeTab(index)"
          >
            {{ item.name }}
            <view class="count" v-if="item.count > 0">{{ item.count > 99 ? '99+' : item.count }}
              <span v-if="item.count > 99">+</span>
            </view>
            <!-- <uni-badge text="25" type="error" ></uni-badge> -->
          </view>
        </view>
        <view class="input-box">
          <uni-icons type="search" color="#878787" size="18"></uni-icons>
          <input
            class="my-search-input"
            type="text"
            placeholder="请输入备注信息、装卸货地址、车队名"
            confirm-type="search"
            v-model="searchKey"
            @confirm="initList"
          />
        </view>
      </view>
    </div>
    <!-- <view class="main">
      
      
    </view> -->
    <mescroll-uni
      class="main"
      :fixed="false"
      ref="mescrollRef"
      @down="downCallback"
      :down="{ auto: false }"
      :up="upOption"
      @up="upCallback"
    >
      <view class="no-list" v-if="noList">暂无数据</view>
      <block v-for="(item, index) in curList" :key="index">
        <card-list
          :cardInfo="item"
          :status="activeIndex"
          @toDetail="toDetail"
          @receive="receive"
          @cancel="cancel"
          @load="load"
          @unLoad="unLoad"
        ></card-list>
      </block>
      <view class="no-more" v-if="noMore">已经到底了</view>
    </mescroll-uni>
  </view>
</template>

<script>
import CardList from "../../components/CardList.vue";
import format from "../../utils/format.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { uniRequest } from "../../config/request";
export default {
  data() {
    return {
      title: "首页",
      tabHeight: 370,
      activeIndex: 0,
      sliderTabs: [
        { status: 0, name: "未接单", count: 0 },
        { status: 10, name: "已接单", count: 0 },
        { status: 20, name: "已出车", count: 0 },
        { status: 30, name: "已回车", count: 0 },
      ],
      searchKey: "",
      tags: [],
      transList: [],
      curList: [],
      noList: false,
      noMore: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      appointCarOrderCode: "", //出车id
    };
  },
  components: { CardList },
  mixins: [MescrollMixin], // 使用mixin

  onLoad() {
    console.log("index load");
    this.initList();
  },
  computed: {
    upOption() {
      let obj = {
        textNoMore: " ",
        auto: false,
        noMoreSize: 4,
        page: {
          size: this.pageSize,
        },
      };
      return obj;
    },
  },
  onShow() {
    // this.initList();
  },
  methods: {
    changeTab(index) {
      this.activeIndex = index;
      this.upOption.textNoMore = "";
      this.initList();
    },
    mockData() {
      let obj = {
        id: 0,
        title: "货源小类",
        company: "我的车队我的车队我的车队",
        vehicleNumber: "闽A12345",
        appointCarOrderTime: "2021-10-22",
        loadAddressAlias: "地址别名地址别名地址别名",
        loadFormattedAddress: "福建省福州市台江区",
        unloadAddressAlias: "地址别名地址别名地址别名",
        unloadFormattedAddress: "福建省福州市台江区",
        remark: "备注",
      };
      let transList = [];
      if (this.activeIndex === 3) {
        return transList;
      }
      for (let i = 0; i < this.pageSize; i++) {
        obj.id = (this.pageNum - 1) * this.pageSize + i;
        transList.push(JSON.parse(JSON.stringify(obj)));
      }
      console.log(this.pageNum);
      return transList;
    },

    initList() {
      this.pageNum = 1;
      this.total = 0;
      this.curList = [];
      this.noList = false;
      this.noMore = false;
      this.getList();
    },
    getList() {
      const config = {
        url: "dispatchList",
        method: "POST",
        data: {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          commonField: this.searchKey,
          status: this.sliderTabs[this.activeIndex].status,
        },
      };
      uniRequest(config).then((res) => {
        console.log('运输服务列表', res);
        this.transList = res.data.data.rows;
        this.total = res.data.data.total;
        this.tags = res.data.data.tags;
        this.getTagCount();
        // this.transList = this.mockData();  //测试数据生成
        this.getCurList();
      });
    },

    getTagCount() {
      this.sliderTabs.map((item) => {
        item.count = 0;
        this.tags.map((tItem) => {
          if (item.status === tItem.status) {
            item.count = tItem.count;
          }
        });
      });
    },

    getCurList() {
      this.curList.push(...this.transList);
      if (this.curList.length === 0) {
        this.noList = true;
      } else {
        this.noList = false;
      }
      let hasNext = this.curList.length < this.total;
      if (!hasNext && this.curList.length > 3) {
        this.noMore = true;
      } else {
        this.noMore = false;
      }
      console.log(this.curList, hasNext);

      this.mescroll.endSuccess(this.transList.length, hasNext);
    },

    downCallback() {
      console.log("downCallback");
      // this.mescroll.resetUpScroll()
      this.initList();
    },
    upCallback(option) {
      console.log(option);
      this.pageNum++;
      this.getList();
    },

    toDetail(param) {
      console.log(param);
      if (this.activeIndex === 0) {
        return;
      }
      let code = param.appointCarOrderCode;
      uni.navigateTo({
        url: `detail/detail?code=${code}`,
      });
    },

    receive(id) {
      console.log(id);
      const config = {
        url: "receive",
        method: "POST",
        data: {
          appointCarOrderCode: id,
        },
      };
      uniRequest(config).then((res) => {
        console.log("接单请求", res);
        let that = this;
        uni.showModal({
          title: "提示",
          content: "接单成功",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //点击确认
              that.initList();
            }
          },
        });
      });
    },
    // 取消
    cancel(id) {
      const config = {
        url: "cancel",
        method: "POST",
        data: {
          appointCarOrderCode: id,
        },
      };
      uniRequest(config).then((res) => {
        console.log("取消请求", res);
        uni.showModal({
          title: "提示",
          content: "取消成功",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.initList();
            }
          },
        });
      });
    },
    // 出车
    test() {
      // this.appointCarOrderCode = obj.code;
      
      uni.navigateTo({
        url: `../load/load`,
      });
    },
    // 出车
    load(obj) {
      // this.appointCarOrderCode = obj.code;
      let params = JSON.stringify(obj);
      uni.navigateTo({
        url: `../load/load?params=${params}`,
      });
    },
    // 回车
    unLoad(obj) {
      // this.appointCarOrderCode = obj.code;
      let params = JSON.stringify(obj);
      uni.navigateTo({
        url: `../unLoad/unLoad?params=${params}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  flex-direction: column;
}

.no-list {
  background: url('../../static/no-data.png') no-repeat;
  background-size: 248rpx 219rpx;
  background-position: center top;
}
</style>

