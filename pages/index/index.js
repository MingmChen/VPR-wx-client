const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()


Page({

  numbers: function () {
      wx.navigateTo({
        url: '/pages/number/number',
      });
  },
  shorttext: function () {
    wx.navigateTo({
      url: '/pages/shorttext/shorttext',
    });
  },

  about: function () {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
})