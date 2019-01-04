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
    speakin_result: "",
    cslt_result: "",
    ms_result: "",
    recorder_img: '../../images/record.png',
    n: 3,
    text: "独上高楼，望尽天涯路",
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

  stop_record_enroll() {
    let that = this
    var tmp_wav = ''
    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.setData({
        wav_file_path: res.tempFilePath,
        recorder_img: '../../images/record.png'
      })
      tmp_wav = res.tempFilePath;
      const {
        tempFilePath
      } = res
      console.log('停止录音', res.tempFilePath)
      console.log('tmp_wav', tmp_wav)

      var url = 'https://colphin.freeneb.com/shorttext_enroll'
      console.log(this.tempFilePath)
      console.log('停止录音', tmp_wav)

      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none",
          duration: 1000
        });
      } else {

        wx.uploadFile({
          url: url,
          filePath: tmp_wav,

          name: 'file',
          formData: {
            name: this.data.name + '_' + this.data.count
          },
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: "上传成功...",
              icon: "none",
              duration: 500
            });
            if (that.data.count < 2) {
              var temp = that.data.count + 1

              that.setData({
                count: temp,
                n: 3 - temp
              })
            } else {
              that.setData({
                count: 0,
                n: 3 - temp,
                isVerify: true,
              })
              wx.setStorageSync('t_name', that.data.name)
              wx.setStorageSync('t_isverify', that.data.isVerify)
            }
          },

          fail: function (res) {
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
    this.updatetext()
  },

  stop_record_verify() {
    let that = this
    var tmp_wav = ''
    recorderManager.stop();
    recorderManager.onStop((res) => {
      that.setData({
        wav_file_path: res.tempFilePath,
      })
      tmp_wav = res.tempFilePath;
      const {
        tempFilePath
      } = res
      console.log('停止录音', res.tempFilePath)
      console.log('tmp_wav', tmp_wav)

      var url = 'https://colphin.freeneb.com/shorttext_verify'
      console.log(this.tempFilePath)
      console.log('停止录音', tmp_wav)
      wx.showToast({
        title: "处理中...",
        icon: "loading",
      });
      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none",
          duration: 1000
        });
      } else {

        wx.uploadFile({
          url: url,
          filePath: tmp_wav,

          name: 'file',
          formData: {
            name: this.data.name
          },
          success: function (res) {
            console.log(res)
            var result = JSON.parse(res.data)
            console.log("result", result)

            that.setData({
              hiddenmodal: false,
              cslt_result: result.CSLT,
              speakin_result: result.SpeakIN,
              ms_result: result.MS,
            });
            wx.hideToast()
          },

          fail: function (res) {
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
    this.updatetext()
  },

  updatetext() {
    var rand = Math.floor(Math.random() * 10)
    var temp = texts[rand]
    this.setData({
      text: temp
    })
  },

  //长按录音
  Enroll_RecordStart: function () {
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

  Enroll_RecordStop: function () {
    this.stop_record_enroll()
    this.setData({
      recorder_img: '../../images/record.png',
      isRecording: false,
    })
  },

  Verify_RecordStart: function () {
    this.start_record()
    this.setData({
      isRecording: true,
    })
  },
  Verify_RecordStop: function () {
    this.stop_record_verify()
    this.setData({
      recorder_img: '../../images/record.png',
      isRecording: false,
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
      cslt_result: "",
      speakin_result: "",
    })
  },
  cancelM: function () {
    this.setData({
      hiddenmodal: true,
      cslt_result: "",
      speakin_result: "",
    })
  }
})