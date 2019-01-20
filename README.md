
<br>

<p align="center">
<img src="https://github.com/zyzisyz/VPR-wx-client/blob/master/images/freeneb.png" alt="CSLT">
</p>
<p align="center">
<img src="https://img.shields.io/badge/powered%20by-CSLT-green.svg?style=flat-square">
<img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square">
</p>
<br>

## Brief Introduction

星云听 is a WeChat min-program for **speaker verification** based on [FreeNeb](www.freeneb.com/) VPR models, it provides two content options, including **digital-strings** and **short-text**.

## Code Structure Overview

This project consists of 2 parts: Client and Server.

1. **Client**: provides a web interface to record speaker's voice
2. **Server**: provides the speaker verification service

### 1. Client

pages:

1. index: index page of this app.
2. numbers: page to enroll and verify speaker's voice by digital-strings
3. shorttext: page to enroll and verify speaker's voice by short-text

### 2. Server

**The server source code is private.**

I will build and open our API (freeneb) for speaker recognition soon.

### Git Branch

1. **master** contains the source code published in WeChat.
2. **dev** is developing branch.
3. **v1** contains the original source code for speaker identification.
4. **v2** contains the original source code for speaker verification.
5. **v3** contains the source code for speaker verification, based on three vpr model (FreeNeb, Speakin and Microsoft).

## QR code

Scan this QR code in Wecaht to use this app.

<p align="center">
<img src="https://github.com/zyzisyz/VPR-wx-client/blob/dev/images/QR-code.jpg" alt="QR-code">
</p>

# Update Log

[2019-01-20 update]: In this weekend, I removed speakin's API and refactored my code. And I remodified nginx configuration: the wav data can be found in wolf server. Here is the server network topology diagram:

## Contact

zyz (zyziszy@foxmail.com)
