const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var s = this;
var texts = [
  "独上高楼，望尽天涯路",
  "衣带渐宽终不悔",
  "为伊消得人憔悴",
  "众里寻他千百度",
  "蓦然回首，那人却在灯火阑珊处",
  "床前明月光，疑是地上霜",
  "江畔何人初见月，江月何年初照人",
  "对酒当歌，人生几何",
  "天生我材必有用，千金散尽还复来",
  "此情可待成追忆，只是当时已惘然"
]

Page({
  data: {
    count: 0,
    name: "",
    isVerify: !true,
    isRecoding: false,
    wav_file_path: "",
    hiddenmodal: true,
    score: -9999,
    threshold: 0,
    recorder_img: '../../images/record.png',
    n: 3,
    text: "独上高楼，望尽天涯路",
    array: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    index: 10,
  },

  onShow: function () {
    this.setData({
      name: wx.getStorageSync('t_name'),//若无储存则为空
      isVerify: wx.getStorageSync('t_isverify'),
    })
  },

  start_record() {
    const options = {
      duration: 6000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 48000, //编码码率
      format: 'aac', //音频格式，有效值 aac/mp3
      //frameSize: 50, //指定帧大小，单位 KB
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
    this.setData({
      recorder_img: '../../images/recording.png'
    })
  },

  updatetext() {
    var rand = Math.floor(Math.random() * 10)
    var temp = texts[rand]
    this.setData({
      text: temp
    })
  },

  //长按录音
  RecordStart: function () {
    this.updatetext()
    if (this.data.count == 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log("当前时间戳为：" + timestamp);
      this.setData({
        name: timestamp,
      })
    }
    this.setData({
      isRecording: true
    })
    this.start_record()
  },

  RecordStop: function () {
    this.setData({
      recorder_img: '../../images/record.png',
      isRecording: false,
    })
    let that = this
    recorderManager.stop();

    recorderManager.onStop((res) => {
      that.setData({
        wav_file_path: res.tempFilePath,
      })
      var tmp_wav = res.tempFilePath;
      const {
        tempFilePath
      } = res
      console.log('停止录音', res.tempFilePath)
      console.log('tmp_wav', tmp_wav)
      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none",
          duration: 1000
        });
      } else {
        wx.showToast({
          title: "处理中...",
          icon: "loading",
        });
        wx.uploadFile({
          url: 'https://colphin.freeneb.com/vpr',
          filePath: tmp_wav,
          name: 'file',
          formData: {
            name: 't' + this.data.name + "_" + this.data.count
          },
          success: function (res) {
            wx.hideToast()
            console.log(res)
            var result = JSON.parse(res.data)
            console.log("result: ", result)

            if (that.data.count < 3) {
              if (result.silence == true) {
                wx.showToast({
                  title: "没有听到你的声音...",
                  icon: "fail",
                  duration: 600
                });
              } else {
                wx.showToast({
                  title: "上传成功...",
                  icon: "none",
                  duration: 400
                });
                that.setData({
                  hiddenmodal: true,
                  count: that.data.count + 1,
                  n: that.data.n - 1,
                  isVerify: false,
                });
              }
              if (that.data.n == 0) {
                that.setData({
                  isVerify: true,
                })
                wx.setStorageSync('t_name', that.data.name)
                wx.setStorageSync('t_isverify', true)
              }
            } else {
              if (result.score > that.data.threshold) {
                wx.showToast({
                  title: "认证通过 (RT:" + that.data.RT + "ms)",
                  icon: "success",
                  duration: 1200
                });
              } else {
                wx.showToast({
                  title: "认证失败 (RT:" + that.data.RT + "ms)",
                  icon: "fail",
                  duration: 1200
                });
                /*
                that.setData({
                  hiddenmodal: false,
                  freeneb_result: "拒绝 (RT: " + result.RT + ")\n 阈值: " + that.data.threshold + " 分数: " + result.score,
                  count: that.data.count + 1,
                })
                */
              }
            }
          },

          fail: function (res) {
            wx.hideToast()
            console.log(res);
            wx.showToast({
              title: "录音失败，请重试...",
              icon: "none",
              duration: 2000
            });
          }
        });
      }
    })
  },

  //重置
  reload: function () {
    this.setData({
      count: 0,
      isVerify: false,
      n: 3,
    })
    wx.showToast({
      title: "重置中...",
      icon: "loading",
      duration: 500
    })
    wx.setStorageSync('t_name', "")
    wx.setStorageSync('t_isverify', false)
    this.updatetext()
  },
  confirmM: function () {
    this.setData({
      hiddenmodal: true,
      freeneb_result: "",
    })
  },
  cancelM: function () {
    this.setData({
      hiddenmodal: true,
      freeneb_result: "",
    })
  },

  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '星云听',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      threshold: this.data.array[e.detail.value]
    })
    console.log('picker发送选择改变，threshold值为', this.data.threshold)
  },
})