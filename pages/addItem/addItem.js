var util = require("../../utils/util.js");
var newItem = true;
const currentDate = util.formatTT(new Date());
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputFinished: false,
    curIpt1: '',
    curIpt2: '',
    lists: [],
    id: 0,
    order: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var id = e.id;
    var arr = wx.getStorageSync('shortPlan');
    if (id) {
      this.setData({
        id: id
      })
      newItem = false;
    } else {
      this.setData({
        id: arr.length
      })
      newItem = true;
    };
    getData(id, this);
    this.setData ({
      order: parseInt(this.data.id)+1
    })
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (e) {

  },
  /**
   * 抓取输入的内容
   */
  iptChange1(e) {
    this.setData({
      curIpt1: e.detail.value,
      inputFinished: true
    })
  },
  /**
   * 抓取输入的内容
   */
  iptChange2(e) {
    this.setData({
      curIpt2: e.detail.value,
      inputFinished: true
    })
  },
  /**
   * 表单重置
   */
  formReset() {
    this.setData({
      curIpt1: '',
      curIpt2: ''
    })
  },
  /**
   * 表单提交
   */
  formSubmit: function(e) {
    let cnt1 = this.data.curIpt1, cnt2 = this.data.curIpt2, id = this.data.id, lists = this.data.lists;
    if (cnt1) {
      if (newItem) {
        lists.push({ id: id, subject: cnt1, content: cnt2, done: false, date: currentDate});
      } else {
        lists[id].subject = cnt1;
        lists[id].content = cnt2;
      } 
      this.setData({
        lists: lists,
        curIpt1: '',
        curIpt1: '',
      })
      wx.setStorageSync('shortPlan', this.data.lists)
      wx.navigateBack();
    } else {
      wx.showToast({
        title: '主题不能为空',
        icon: 'none',
        duration: 400
      })
    }
  }
})
/**
 * 根据跳转的url中的id获取编辑信息回填
 */
function getData(id, page) {
  var id = id;
  var arr = wx.getStorageSync('shortPlan');
  if (arr.length) {   
    arr.forEach((item) => {
      if (item.id == id) {
        page.setData({
          curIpt1: item.subject,
          curIpt2: item.content
        })
      }
    })
    page.setData ({
      lists: arr
    })
  }
}
