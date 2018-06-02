var util = require('../../utils/util.js')
var app = getApp()
Page ({
  /**
   * 页面的初始数据
   */
  data: {
    todos: [],   //存储待办事项
    dones: [],   //存储完成事项
    progress: 0  //进度条数据绑定
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () { 
    initData(this);    //刷新视图
    this.perc();
  },
  
  /**
   * 编辑事件
   */
  edit(e) {
    var id = e.currentTarget.dataset.id;    //获取当前id
    wx.navigateTo({                         // 跳转 navigateTo
      url: '../addItem/addItem?id=' + id
    })
  },
  /**
   * 添加事件
   */
  add() {
    wx.navigateTo({                         //直接跳转
      url: '../addItem/addItem'
    })
  },
  /**
   * 修改显示位置
   */
  setDone(e) {
    var arr = wx.getStorageSync('shortPlan');       //获取缓存
    let i = e.target.dataset.id;                   //获取id
    let originDone = arr[i].done;                  //抓取定义的标志
    var data = [];
    originDone = !originDone;                      //取反
    if (arr.length) {
      arr.forEach(item => {
        if (item.id == i) {
          item.done = originDone;
        }
        data.push(item);
      })
    };
    wx.setStorageSync('shortPlan', data);
    initData(this);                                 //刷新视图
    this.perc();
  },
  /**
   * 删除事件
   */
  toDelete(e) {
    var arr = wx.getStorageSync('shortPlan');            //读取缓存
    let i = e.target.dataset.id;                         //获取id
    var data = [];                                       //临时变量
    arr.splice(i, 1);                                    //删除元素
    arr.forEach(item => {
      if (item.id >= i) {                                //修改id
        item.id--;
      }
      data.push(item);                                   //保存修改
    })
    wx.setStorageSync('shortPlan', data);                //写回缓存
    initData(this);                                      //刷新视图
    this.perc();
  },
  /**
   * 帮助
   */
  help() {
    wx.showModal ({
      title: '操作说明',
      content: '待办事项为空:\n1.点击右下角新建按钮新建计划\n已有待办事项:\n2.点击计划左侧单选框切换完成状态\n3.点击计划的文本部分修改计划\n4.点击右侧删除按钮删除计划'
    })
  },
  /**
 * 计算百分比
 */
  perc() {
    var finish = this.data.dones.length;
    var all = this.data.dones.length + this.data.todos.length;
    var percent = 0;
    if (all == 0) {
      percent = 100;
    }
    percent = Math.round((finish * 100) / all);
    this.setData({
      progress: percent
    })
  }
})
/**
 * 处理初始化页面列表数据
 */
function initData(page) {
  var arr = wx.getStorageSync('shortPlan');
  var temp1 = new Array();
  var temp2 = new Array();
  let i = 0, j = 0, k = 0;
  for(i = 0; i < arr.length; i++) {
    if(arr[i].done) {                     //事项分类
      temp1[j] = new Array();                         
      temp1[j] = arr[i];
      j++;
    } else {
      temp2[k] = new Array();
      temp2[k] = arr[i];
      k++;
    }
  }
  page.setData({
    todos: temp2,
    dones: temp1
  })
}