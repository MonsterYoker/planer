//获取应用实例
var util = require('../../utils/util.js')
const ratio = Math.round((750 / (wx.getSystemInfoSync().windowWidth)) * 100) / 100;
var app = getApp()
Page ({
  /**
   * 页面的初始数据
   */
  data: {
    effective: true,
    showModal: false,
    colorArrays: ["#90C652", "#D8AA5A", "#0A9A84", "#12AEF3", "#FC9F9D", "#E29AAD", "#61BC69", "#85B8CF"],
    currentID:0,
    index: 0,
    curIpt1: '',
    curIpt2: '',
    editFlag: false,
    newItem: true,
    currentDay: 0,
    lists: [],
    currentLocation: [0, 0],
    multiArray: [['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'], ['1', '3', '5', '7', '9', '11']],
    orderArray: ['2','4','6','8','10','12']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var currentDay = CaculateWeekDay();
    currentDay = (currentDay == 0) ? 650 : ((currentDay - 1) * 100 + 50);
    this.setData({
      currentDay: currentDay
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    initData(this);
  },
  /**
  * 生命周期函数--切换到后台
  */
  onHide: function () {
    this.setData ({
      showModal: false,
      editFlag: false
    })
    wx.setStorageSync('schedule', this.data.lists);
  },
  /**
  * 弹窗控制
  */
  edit() {
    this.setData({
      editFlag: true
    })
  },
  endEdit() {
    this.setData({
      editFlag: false
    })
  },
  /**
  * 新建课程
  */
  newCardView(e) {
    this.getSelectLocation(e);
    if (this.data.effective) {
      this.edit();
    }
  },
  /**
  * 编辑课程
  */
  editCardView(e) {
    this.setData({
      newItem: false
    })
    this.getSelectLocation(e);
    this.edit();
    this.itemFound(this.data.currentLocation);
  },
  /**
  * 删除课程
  */
  deleteCardView(e) {
    this.setData({
      showModal: true
    });
    this.getSelectLocation(e);
  },
  /**
  * 获取位置
  */
  getSelectLocation(e) {
    if (!this.data.editFlag) {
      var location = [parseInt(e.detail.x * ratio), parseInt(e.detail.y * ratio)];
      if (location[0] >= 50) {
        var week = parseInt((location[0] - 50) / 100);
        var order = parseInt((location[1] - 50) / 160);
        this.setData({
          'currentLocation[0]': week,
          'currentLocation[1]': order,
          effective: true
        })
      } else {
        this.setData ({
          effective: false
        })
      }
    }
  },
  /**
  * 元素匹配
  */
  itemFound(index) {
    var arr = index;
    var lists = this.data.lists;
    lists.forEach ( item => {
      if (item.week == arr[0] && item.order == this.data.multiArray[1][arr[1]]) {
        this.setData ({
          currentID: item.id,
          curIpt1: item.name,
          curIpt2: item.address
        })
      }
    })
  },
  /**
  * 增添课程名称
  */
  iptChange1: function (e) {
    this.setData({
      curIpt1: e.detail.value
    })
  },
  /**
  * 增添上课地点
  */
  iptChange2: function (e) {
    this.setData({
      curIpt2: e.detail.value
    })
  },
  /**
  * 提交表单
  */
  formSubmit() {
    let cnt1 = this.data.curIpt1, cnt2 = this.data.curIpt2, newLists = this.data.lists, week = this.data.currentLocation[0], order = this.data.multiArray[1][this.data.currentLocation[1]], newItem = this.data.newItem, currentID = this.data.currentID;
    if (cnt1||cnt2) {
      if(newItem) {
        newLists.push({ id: newLists.length, name: cnt1, address: cnt2, week: week, order: order });
      } else {
        newLists[currentID].name = cnt1;
        newLists[currentID].address = cnt2;
      };
      this.setData({
        newItem: true,
        lists: newLists,
        curIpt1: '',
        curIpt2: '',
        editFlag: false
      })
    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 400
      });  
    }
    console.log(this.data.lists)
  },
  /**
  * 重置表单
  */
  formReset() {
    this.setData({
      curIpt1: '',
      curIpt2: '',
      editFlag: false
    })
  },
  /**
  * 删除课程的函数
  */
  deleteItem(index) {
    var arr = index;
    var lists = this.data.lists;
    if (lists.length) {
      lists.forEach(item => {
        if (item.week == arr[0] && item.order == this.data.multiArray[1][arr[1]]) {
          for (var i = item.id; i < lists.length - 1; i++) {
            if (i==0) {
              lists[i].id = 0;
            } else {
              lists[i] = lists[i + 1];
              lists[i].id = lists[i].id - 1;
            }
          }
          lists.splice(i, 1);
        }
      })
      this.setData({
        lists: lists
      })
    };
    wx.setStorageSync('schedule', this.data.lists);
  },
  tipToast() {
    wx.showModal({
      title: '操作说明',
      content: '1.长按空白处在当前位置新建课程\n2.点击已创建的课程对其编辑\n3.长按已创建的课程将其删除'
    })
  },
  preventTouchMove: function () {

  },
  confirmDelete: function () {
    this.setData({
      showModal: false
    })
    this.deleteItem(this.data.currentLocation);
  },
  cancelDelete: function () {
    this.setData({
      showModal: false
    })
  }

})
/**
* 视图刷新
*/
function initData(page) {
  var arr = wx.getStorageSync('schedule');
  if(arr) {
    page.setData({
      lists: arr
    })
  }
}

function CaculateWeekDay() {
  var currentDate = util.formatTT(new Date());
  var myDate = new Date(Date.parse(currentDate.join('/')));
  return(myDate.getDay())
}

 


