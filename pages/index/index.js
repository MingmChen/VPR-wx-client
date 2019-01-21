Page({
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '星云听',
      path: 'pages/index/index',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },

  numbers: function() {
    wx.navigateTo({
      url: '/pages/number/number',
    });
  },
  shorttext: function() {
    wx.navigateTo({
      url: '/pages/shorttext/shorttext',
    });
  },
})