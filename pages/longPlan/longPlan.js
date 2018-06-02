// pages/longPlan/longPlan.js
var util = require('../../utils/util.js');
const days = [31,0,31,30,31,30,31,31,30,31,30,31];
const specialDays = [28,29];
const visualFlag = [true,false,false];
var app = getApp();
Page({
  data: {
    animationData: {},
    cardInfoList: [{
      cardUrl: 1,
      cardInfo: {
        cardTitle: '目标一',
        cardInfoMes: '\n\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0不是梦想离我们太远\n\xa0\xa0\xa0\xa0而是我们为之付出太少'
      },
      cardDate: '2018-05-31',
      cardCount: 0,
      cardID: 0,
      cardVisual:true
    }, {
      cardUrl: 2,
      cardInfo: {
        cardTitle: '目标二',
        cardInfoMes: '\xa0\xa0\xa0\xa0\xa0\xa0人生没有地图\n\xa0\xa0我们一路走\n\xa0\xa0\xa0\xa0一路被辜负\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0一路点燃希望\n\xa0\xa0\xa0\xa0一路寻找答案'
      },
      cardDate: '2018-06-01',
      cardCount: 0,
      cardID: 1,
      cardVisual: false
    }, {
      cardUrl: 3,
      cardInfo: {
        cardTitle: '目标三',
        cardInfoMes: '\n\xa0\xa0在成功面前，戒骄戒躁学会谦恭\n\xa0\xa0在委屈面前，宠辱不惊学会包容\n\xa0\xa0在等待面前，泰然自若学会忍耐\n\xa0\xa0在痛苦面前，浴火重生学会坚强'
      },
      cardDate: '2018-06-02',
      cardCount: 0,
      cardID: 2,
      cardVisual: false
    }],
    cardEdit: false,
    currentDate: '',
    endDate: '',
    disable: true
  },
  onLoad: function () {
    var time = util.formatTT(new Date());
    var timee = util.formatTT(new Date());
    var times = '';
    var timese = '';
    times = time.join("-");
    timee[0] = timee[0]+1;
    timese = timee.join("-");
    this.setData({
      currentDate: times,
      endDate: timese
    })
    if ((time % 4 == 0 && time % 100 != 0) || time[0] % 400 == 0) {
      days[1] = specialDays[1];
    } else {
      days[1] = specialDays[0];
    }
  },
  onShow: function () {
    initData(this);
    updateCardCount(this);
  },
  onHide: function () {
    wx.setStorageSync('longPlan', this.data.cardInfoList);
  },
  //事件处理函数
  slidethis: function (e) {
    if ((!this.data.cardEdit) && this.data.disable) {
      this.setData ({
        disable: false
      })
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
      });
      var self = this;
      this.animation = animation;
      this.animation.translateY(-480).translateX(0).rotate(-10).step();
      this.animation.translateY(35).translateX(20).rotate(0).step();
      this.setData({
        animationData: this.animation.export()
      });
      setTimeout(function () {
        var cardInfoList = self.data.cardInfoList;
        var slidethis = self.data.cardInfoList.shift();
        self.data.cardInfoList.push(slidethis);
        self.setData({
          cardInfoList: self.data.cardInfoList,
          animationData: {},
          disable: true
        });
        var up1 = "cardInfoList[" + 0 + "].cardVisual";
        var up2 = "cardInfoList[" + 1 + "].cardVisual";
        var up3 = "cardInfoList[" + 2 + "].cardVisual";
        self.setData({
          [up1]: visualFlag[0],
          [up2]: visualFlag[1],
          [up3]: visualFlag[2]
        });
      }, 200)
    }
  },
  edit () {
    this.setData ({
      cardEdit: true
    })
  },
  endEdit () {
    this.setData({
      cardEdit: false
    })
  },
  iptChange (e) {
    var up = "cardInfoList[" + 0 + "].cardInfo.cardInfoMes"
    this.setData({
      [up]: e.detail.value
    })
    this.endEdit();
  },
  bindDateChange (e) {
    var up = "cardInfoList[" + 0 + "].cardDate"
    this.setData({
      [up]: e.detail.value
    })
    this.endEdit();
    updateCardCount(this);
  },
  bindChangeCancel () {
    this.endEdit();
  },
  help () {
    wx.showModal({
      title: '操作说明',
      content: '1.点击倒计时区域修改倒计时\n2.点击目标一包含的区域修改小目标\n3.点击其他卡片区域翻页\n4.提示：不要快速翻页，会卡死'
    })
  }
})

function updateCardCount (page) {
  var temp = new Array();
  var cardCount = [0,0,0];
  var time = util.formatTT(new Date());
  var i = 0;
  var j = 0;
  for (i = 0; i < 3; i++) {
    temp[i] = page.data.cardInfoList[i].cardDate.split("-");
    for (j = 0; j < 3; j++) {
      temp[i][j] = parseInt(temp[i][j]);
    }
  };
  for (i = 0; i < 3; i++) {
    if(time[0] < temp[i][0]) {
      for (j = time[1]; j < 12; j++) {
        cardCount[i] = cardCount[i] + days[j];
      }
      if ((temp[i][0] % 4 == 0 && temp[i][0] % 100 != 0) || temp[i][0] % 400 == 0) {
        days[1] = specialDays[1];
      } else {
        days[1] = specialDays[0];
      }
      for (j = 0; j < temp[i][1] - 1; j++) {
        cardCount[i] = cardCount[i] + days[j];
      }
      cardCount[i] = cardCount[i] + (days[time[1] - 1] - time[2]) + temp[i][2];
    } else {
      if (time[1] == temp[i][1]) {
        cardCount[i] = temp[i][2] - time[2];
      } else if (time[1] < temp[i][1]) {
        for (j = time[1]; j < temp[i][1]-1; j++) {
          cardCount[i] = cardCount[i] + days[j];
        }
        cardCount[i] = cardCount[i] + (days[time[1] - 1] - time[2]) + temp[i][2];
      } else {
        cardCount[i] = 0;
      }     
    }
    if (cardCount[i] < 0) {
      cardCount[i] = 0;
    }
    var up = "cardInfoList[" + i + "].cardCount";
    page.setData({
    [up]: cardCount [i]
    })
  };
}

function initData(page) {
  var arr = wx.getStorageSync('longPlan');
  if (arr) {
    page.setData({
      cardInfoList: arr
    })
  }
}