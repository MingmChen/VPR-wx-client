const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var s = this;

Page({

  data: {
    name: "",
    wavepath:"",
    record_state:"长按录音",
  },

  input: function(e) {
    this.setData({
      name: e.detail.value,
    })
  },

  //开始录音的时候
  start: function() {

    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'aac', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });


    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //停止录音
  stop: function() {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
    })
  },

  //播放声音
  play: function() {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  upload: function(e) {

    var url = 'https://colphin.freeneb.com/upload'
    console.log(this.tempFilePath);
    var that = this

    var name = this.data.name

    if (!name) {
      wx.showModal({
        title: '提示',
        content: "给你的录音取个名字呗",
        showCancel: false,
        success: function(res) {}
      });
      wx.hideToast();
      return;
    } else {
      wx.uploadFile({
        url: url,
        filePath: this.tempFilePath,
        name: 'file',
        formData: {
          name:this.data.name
        }, 
        success: function(res) {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: that.data.name+"的声音增加成功",
            showCancel: false,
            success: function (res) { }
          });
          wx.hideToast();
          that.setData({
            name:""
          })
        },

        fail: function(res) {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: "服务请求失败,请确保网络是否正常或者是否有录音",
            showCancel: false,
            success: function(res) {}
          });
          wx.hideToast();
        }
      });
    }
  },

  cancel: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    });
  },
  //确认  
  confirm: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  //长按录音
  longTap:function(){
    console.log('longTap....')
  },  

  touchStart: function () {
    console.log('touchStart....')
    this.start();
    this.setData({
      record_state:'录音中'
    })
  }, 


  touchEnd: function() {
    console.log('touchEnd....')
    this.stop()
    this.setData({
      record_state: '长按录音'
    })
  },  
})