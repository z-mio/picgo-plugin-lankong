import https from 'https'
import { ImgType } from './lib/interface'

const UPLOADER = '兰空图床付费版'

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.uploader.register(UPLOADER, {
      handle,
      name: UPLOADER,
      config: config
    })

        // 注册同步删除 remove 事件
    ctx.on('remove', onDelete)
  }

  async function onDelete (files, guiApi) {
    let userConfig = ctx.getConfig('picBed.' + UPLOADER)
    const syncDelete = userConfig.syncDelete
        // 如果同步删除按钮关闭则不执行
    if (!syncDelete) {
      return
    }
        // 仅支持付费版（V2），不再支持免费版
    const deleteList = files.filter(each => each.type === UPLOADER)
    if (deleteList.length === 0) {
      return
    }

    for (let i = 0; i < deleteList.length; i++) {
      const item = deleteList[i]
      const deleteParam = GenDeleteParam(item, userConfig)
      let body = await ctx.Request.request(deleteParam)

      body = typeof body === 'string' ? JSON.parse(body) : body
      if (body.status === 'success' || body.status === true) {
        ctx.emit('notification', {
          title: `${item.imgUrl} 同步删除成功`,
          body: body.message
        })
      } else {
        ctx.emit('notification', {
          title: `${item.imgUrl} 同步删除失败`,
          body: body.message
        })
        throw new Error(body.message)
      }
    }
  }

  const GenDeleteParam = (img: ImgType, userConfig) => {
    const token = userConfig.token
    const ignoreCertErr = userConfig.ignoreCertErr
    const serverUrl = userConfig.server
    const currentImageKey = img.id

    const v2Headers = {
      'Accept': 'application/json',
      'User-Agent': 'PicGo',
      'Connection': 'keep-alive',
      'Authorization': token || undefined
    }

        // 如果忽略证书错误开关打开则带上 http agent 访问, 否则不需要带（以提高性能）
    if (ignoreCertErr) {
      let requestAgent = new https.Agent({
                // 此处需要取反 忽略证书错误 拒绝未授权证书选项
        rejectUnauthorized: !ignoreCertErr
      })
      return {
        method: 'DELETE',
        url: `${serverUrl}/api/v2/images/${currentImageKey}`,
        agent: requestAgent,
        headers: v2Headers
      }
    } else {
      return {
        method: 'DELETE',
        url: `${serverUrl}/api/v2/images/${currentImageKey}`,
        headers: v2Headers
      }
    }

  }

  const postOptions = (userConfig, fileName, image) => {

    const serverUrl = userConfig.server
    if (serverUrl.endsWith('/')) {
      throw new Error('Server url cannot ends with /')
    }
    const token = userConfig.token
    const ignoreCertErr = userConfig.ignoreCertErr

    const v2Headers = {
      'Content-Type': 'multipart/form-data',
      'User-Agent': 'PicGo',
      'Connection': 'keep-alive',
      'Accept': 'application/json',
      'Authorization': token || undefined
    }
    const storageId = userConfig.storageId
    const albumId = userConfig.albumId
    let isPublic = userConfig.isPublic

    const v2FormData = {
      file: {
        value: image,
        options: {
          filename: fileName
        }
      },
      storage_id: storageId,
      album_id: albumId,
      is_public: isPublic ? 1 : 0
    }
    if (!storageId) {
      delete v2FormData.storage_id
    }
    if (!albumId) {
      delete v2FormData.album_id
    }

        // 如果忽略证书错误开关打开则带上 http agent 访问, 否则不需要带（以提高性能）
    if (ignoreCertErr) {
      const requestAgent = new https.Agent({
        rejectUnauthorized: !ignoreCertErr
      })
      return {
        method: 'POST',
        url: `${serverUrl}/api/v2/upload`,
        agent: requestAgent,
        headers: v2Headers,
        formData: v2FormData
      }
    } else {
      return {
        method: 'POST',
        url: `${serverUrl}/api/v2/upload`,
        headers: v2Headers,
        formData: v2FormData
      }
    }
  }
  const handle = async (ctx) => {
    let userConfig = ctx.getConfig('picBed.' + UPLOADER)
    if (!userConfig) {
      throw new Error('Can\'t find uploader config')
    }
    const imgList = ctx.output
    for (let i in imgList) {
      let image = imgList[i].buffer
      if (!image && imgList[i].base64Image) {
        image = Buffer.from(imgList[i].base64Image, 'base64')
      }
      const postConfig = postOptions(userConfig, imgList[i].fileName, image)
      let body = await ctx.Request.request(postConfig)

      body = typeof body === 'string' ? JSON.parse(body) : body
      const condition = body.status === 'success' || body.status === true

      if (condition) {
        delete imgList[i].base64Image
        delete imgList[i].buffer
                // 付费版返回 data.public_url，且提供 id
        imgList[i]['imgUrl'] = body.data.public_url
        imgList[i]['id'] = body.data.id
      } else {
        ctx.emit('notification', {
          title: 'upload failed',
          body: body.message
        })
        throw new Error(body.message)
      }
    }
    return ctx
  }

  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.' + UPLOADER)
    if (!userConfig) {
      userConfig = {}
    }
    return [
      {
        name: 'server',
        type: 'input',
        default: userConfig.server,
        required: true,
        message: '示例: https://example.com（不要以 / 结尾）',
        alias: 'Server'
      },
      {
        name: 'token',
        type: 'input',
        default: userConfig.token,
        required: true,
        message: '认证 token 信息（Authorization: Bearer <token>）',
        alias: 'Auth token'
      },
      {
        name: 'storageId',
        type: 'input',
        default: userConfig.storageId,
        required: true,
        message: '储存ID（storage_id）',
        alias: 'Storage ID'
      },
      {
        name: 'albumId',
        type: 'input',
        default: userConfig.albumId,
        required: false,
        message: '相册ID（album_id，可选，仅登录用户有效）',
        alias: 'Album ID'
      },
      {
        name: 'isPublic',
        type: 'confirm',
        default: userConfig.isPublic || false,
        message: '是否公开图片（is_public），默认否',
        required: true,
        alias: 'Public'
      },
      {
        name: 'ignoreCertErr',
        type: 'confirm',
        default: userConfig.ignoreCertErr || false,
        message: '是否忽略证书错误, 如果上传失败提示证书过期请设为true',
        required: true,
        alias: 'Ignore certificate error'
      },
      {
        name: 'syncDelete',
        type: 'confirm',
        default: userConfig.syncDelete || false,
        message: '是否同步删除（仅付费版支持）',
        required: true,
        alias: 'Sync Delete'
      }
    ]
  }
  return {
    uploader: UPLOADER,
    config: config,
    register
        // guiMenu
  }
}
