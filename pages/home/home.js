// pages/home/home.js
import {
  getMultiData,
  getGoodsData
} from '../../service/home'
Page({
  data: {
    banners: [],
    recommend: [],
    goods: {
      'pop': {
        page: 0,
        list: []
      },
      'new': {
        page: 0,
        list: []
      },
      'sell': {
        page: 0,
        list: []
      }
    },
    currentType: 'pop',
    showBackTop:false,
    isTabFixed:false,
    tabScrollTop:0
  },
  onLoad: function (options) {
    //1.请求轮播图以及推荐数据
    this._getMultiData()
    //2.请求商品数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  //-----------------网络请求------------------
  _getMultiData() {
    getMultiData().then(res => {
      //2.取出轮播图和推荐数据
      // console.log(res);
      const banners = res.data.data.banner.list
      const recommend = res.data.data.recommend.list
      this.setData({
        banners,
        recommend
      })
    })
  },
  _getGoodsData(type) {
    const page = this.data.goods[type].page + 1
    getGoodsData(type, page).then(res => {
      //2.1取出数据
      const list = res.data.data.list
      // console.log(list);
      //2.2将数据设置到对应type的list中
      const oldList = this.data.goods[type].list;
      oldList.push(...list) //将list里每一项拿出来push到oldList中
      //2.3将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`; //es6语法，字符串的拼接
      const pageKey = `goods.${type}.page`;
      this.setData({
        //必须加上[]，不然会当做字符串，而不是变量
        [typeKey]: oldList,
        [pageKey]: pageKey
      })
    })
  },
  //----------------事件监听-------------------
  getItemIndex(event) {
    //取出index
    const index = event.detail.index
    console.log(index);
    //设置currentType
    switch (index) {
      case 0:
        this.setData({
          currentType: 'pop'
        })
        break;
      case 1:
        this.setData({
          currentType: 'new'
        })
        break;
      case 2:
        this.setData({
          currentType: 'sell'
        })
        break;
    }
  },
  onReachBottom() {
    //滑动到底部，上拉加载更多
    this._getGoodsData(this.data.currentType)
  },
  onPageScroll(options) {
    //1.取出scrollTop
    const scrollTop = options.scrollTop
    //2.修改showBackTop属性
    //官方：不要在滚动的函数回调中频繁的调用this.setData
    const flag = scrollTop >= 1000//当scrollTop 大于1000 时，showBackTop为true
    if(flag != this.data.showBackTop) {
      this.setData({
        showBackTop: flag
      })
    } 

    //3.修改isTabFixed属性
    const flag2 = scrollTop >= this.data.tabScrollTop;
    if(flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed:flag2
      })
    }
  },
  handleImageLoad() {
    //获取组件到顶部的距离
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      // console.log(rect);
      this.data.tabScrollTop = rect.top
    }).exec()
  }
})