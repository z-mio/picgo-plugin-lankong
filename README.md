## picgo-plugin-lankong

[![下载](https://img.shields.io/npm/dm/picgo-plugin-lankong.svg?color=brightgreen)](https://npmcharts.com/compare/picgo-plugin-lankong?minimal=true)
[![版本](https://img.shields.io/npm/v/picgo-plugin-lankong.svg?color=brightgreen)](https://www.npmjs.com/package/picgo-plugin-lankong)
[![许可](https://img.shields.io/badge/license-mit-brightgreen.svg)](https://github.com/hellodk34/picgo-plugin-lankong/blob/master/License)

这是一个为 [兰空图床](https://github.com/lsky-org/lsky-pro) 付费版（V2）适配开发的 PicGo 图片上传插件。基于 `PicGo V2.3.0` 开发。

> Lsky Pro 是一个用于在线上传、管理图片的图床程序，中文名：兰空图床，你可以将它作为自己的云上相册，亦可以当作你的写作贴图库。  
> 兰空图床始于 2017 年 10 月，最早的版本由 ThinkPHP 5 开发，后又经历了数个版本的迭代，在 2021 年末启动了新的重写计划并于 2022 年 3 月份发布全新的 2.0 版本。

以上引用来自 [lsky pro v2 docs](https://docs.lsky.pro/docs/v2/)

## 版本日志

[click me to view changelog](./changelog.md)

---

# 安装和使用

## 1. 在线安装(**推荐**)

打开 PicGo 详细窗口，选择插件设置，搜索 **lankong** (author 是 `hellodk`) 安装。

![20220323110227](https://img.github.luxe/2022/9383b937aef0b.png)

## 2. 离线安装

克隆该项目，解压缩到路径 `/path/to/picgo-plugin-lankong`

进入以下目录

```
Windows: %APPDATA%\picgo\
Linux: $XDG_CONFIG_HOME/picgo/ or ~/.config/picgo/
macOS: ~/Library/Application\ Support/picgo/
```

在对应系统的 PicGo 程序配置文件路径下执行 `npm install /path/to/picgo-plugin-lankong`，然后重启应用即可。

## 3. 使用方法

![兰空picgo插件lankong 新版设置截图.jpg](https://image.940304.xyz/i/2022/08/20/6300edb4539f7.jpg)

- 仅支持兰空图床付费版（V2）。
- 填写图床的 `server url`，注意不要以 `/` 结束
  - `https://image.example.com` ✅️
  - `https://image.example.com/` ❌️
- 填写 `Auth Token`（需要以 `Bearer <token>` 形式配置到插件里）。
- `Storage ID`（storage_id），必填。
- `Album ID`（album_id），选填，仅登录用户有效。
- `Public`（is_public），是否公开图片，默认否。
- `Ignore certificate error` 开关，默认关闭，请保持关闭，除非你遇到 `certificate has expired` 等证书报错才需要考虑将其开启。

## 补充说明 token 的获取方式

### 1. 使用 cURL(**推荐**)

```
curl --location --request POST 'https://your.domain/api/v1/tokens' \
--form 'email="your_email@address"' \
--form 'password="your_passwd"'
```

此命令适用于付费版（V2）。本插件已不再支持免费版。

### 2. 使用 postman 等软件

兰空图床 V2 token 的获取方式如下
   1. 登录到一个 V2 版本的兰空图床，比如 https://image.example.com 进入 API 接口页面 https://image.example.com/api 查看获取一个 token 的方式
   2. 使用 postman 之类的 api 调试工具发起一个 http post 请求即可生成一个 token，请求时的细节如下
      1. 请求 url: `https://image.example.com/api/v1/tokens`
      2. 请求方法: POST
      3. 设置请求头 `Accept` 的值为 `application/json`
      4. 请求体中使用 json 语法填入邮箱和密码
          ```
          {
            "email": "your_username@example.com",
            "password":"your_password"
          }
          ```
      5. 请求成功后得到返回信息中的 `token`，使用 `Bearer ` 拼接拿到的 token 作为 `Auth Token` 填入 PicGo 设置中。注意 Bearer 和返回的 token 之间有个空格，请严格按照格式填写，程序不会校验这个细节

如果觉得项目有用，欢迎点个免费的 star ⭐️️ 激励一下我。感谢！

# 开源许可证

Released under the [MIT License](https://github.com/hellodk34/picgo-plugin-lankong/blob/main/License).

# 欢迎随意打赏

如果您觉得我的小小工作提升了您的 workflow，欢迎随意打赏。

<table width="100%">
    <tr>
        <th>支付宝</th>
        <th>微信</th>
    </tr>
    <tr>
        <td><img alt="若图片裂开科学即可" src="https://image.940304.xyz/i/2022/08/20/6300eff29cd57.jpg"></td>
        <td><img alt="若图片裂开科学即可" src="https://image.940304.xyz/i/2022/08/20/6300effcca409.jpg"></td>
    </tr>
</table>
