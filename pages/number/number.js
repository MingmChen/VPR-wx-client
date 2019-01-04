const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var s = this

Page({
  data: {
    count: 0,
    name: "",
    isVerify: !true,
    isRecording: false,
    wav_file_path: "",
    numbers: "2341 7890",
    hiddenmodal: true,
    speakin_result: "",
    cslt_result: "",
    recorder_img: '../../images/record.png',
    n: 3,
  },
  onShow: function () {
    this.setData({
      name: wx.getStorageSync('n_name'),//若无储存则为空
      isVerify: wx.getStorageSync('n_isverify'),
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

      var url = 'https://colphin.freeneb.com/number_enroll'
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
              wx.setStorageSync('n_name', that.data.name)
              wx.setStorageSync('n_isverify', that.data.isVerify)
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

      var url = 'https://colphin.freeneb.com/number_verify'
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
      this.updataNums()
    })
  },

  updataNums() {
    // 定义存放生成随机数的数组 
    var array = new Array();
    // 循环N次生成随机数 
    for (var i = 0; ; i++) {
      // 只生成10个随机数 
      if (array.length < 10) {
        generateRandom(10);
      } else {
        break;
      }
    }
    // 生成随机数的方法 
    function generateRandom(count) {
      var rand = parseInt(Math.random() * count);
      for (var i = 0; i < array.length; i++) {
        if (array[i] == rand) {
          return false;
        }
      }
      array.push(rand);
    }
    var tmp = ""
    for (var i = 0; i < 8; i++) {
      tmp += array[i]
      if (i == 3)
        tmp += " "
    }
    this.setData({
      numbers: tmp
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
    this.updataNums()
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
    this.updataNums()
    wx.setStorageSync('n_name', "")
    wx.setStorageSync('n_isverify', false)
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
  /*
  onUnload: function () {
    wx.setStorageSync('isVerify', this.data.isVerify);
    wx.setStorageSync('name', this.data.name);
    wx.setStorageSync('number', this.number);
  },
  */
})