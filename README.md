
<br>

<p align="center">
<img src="https://github.com/zyzisyz/vpr-wx-client2.0/blob/master/images/cslt.jpg" alt="CSLT">
</p>
<p align="center">
<img src="https://img.shields.io/badge/powered%20by-CSLT-green.svg?style=flat-square">
<img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square">
</p>
<br>

## Brief Introduction

星云听 is a WeChat min-program for **speaker verification** based on 3 VPR models, including: [FreeNeb (fnvpr)](www.freeneb.com/
), [SpeakIn](http://www.speakin.mobi/pages/index.html) and [Microsoft](https://azure.microsoft.com/en-us/services/cognitive-services/speaker-recognition/). And it provides two ways to enroll and verify speaker’s voice, including **numbers** and **short text**.

*(PS：Microsoft speaker verification API is unstable so we didn't put it in current version）*

## Code Structure Overview

This project consists of 2 parts: Client and Server.

1. **Client**: provide a web interface to record speaker voice
2. **Server**: provide speaker recognition service

### 1. Client

This repo contains the source code of WeChat client, which includes 3 pages:

1. index: index page of this app.
2. numbers: page to enroll and verify speaker's voice by number.
3. shorttext: page to enroll and verify speaker's voice by shorttext.

### 2. Server

**The server source code is private.**

I will build and open our API (freeneb) for speaker recognition soon.

### Git Branch

1. **master** contains the source code published in WeChat.
2. **dev** is developing branch.
3. **v1** contains the original source code for speaker identification.
4. **v2** contains the original source code for speaker verification.

## QR code

Scan this QR code in Wecaht to use this app.

<p align="center">
<img src="https://github.com/zyzisyz/vpr-wx-client2.0/blob/master/images/QR-code.jpg" alt="QR-code">
</p>

## Contact

zyz (zyziszy@foxmail.com)
