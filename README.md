# 江寓房间信息爬取

## 安装

- 下载 repo 后 cd 到文件夹下运行(确保已安装 nodejs)

  ```node
  cd ...
  npm install
  ```

  将下载 puppeteer npm 包，包含完整 Chromium 所以较大

  ```node
  node jiangyu.js
  ```

## puppeteer

- 可以设置为无头模式(默认为显示运行)

  ```js
  headless: true,//true为无头
  args: ["--window-size=1920,1080"]//可设置浏览器窗口尺寸
  ```

## 抓取数据储存在 rooms.csv 文件内

## example.js 和 scraper.js 为其他示例程序，供参考
