const express = require('express')
const fs = require('fs')
const path = require('path')

// 设置SSR环境变量
process.env.SSR = 'true'

// 导入Vue相关模块
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const app = express()

// 读取客户端构建文件的HTML模板
const template = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8')

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')))

// 动态导入路由
let router

app.use(async (req, res, next) => {
  // 跳过静态文件
  if (req.path.startsWith('/css/') || req.path.startsWith('/js/') || req.path.startsWith('/img/') || req.path.startsWith('/fonts/')) {
    return next()
  }
  try {
    // 延迟导入路由以确保环境变量已设置
    if (!router) {
      router = require('./src/router').default
    }

    // 创建SSR应用实例
    const ssrApp = createSSRApp({
      template: `
        <div id="app">
          <router-view />
        </div>
      `,
      setup() {
        return {}
      }
    })

    // 使用路由
    ssrApp.use(router)

    // 渲染应用为HTML字符串
    const appHtml = await renderToString(ssrApp)

    // 将渲染后的HTML注入到模板中
    const finalHtml = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)

    // 返回完整的HTML页面
    res.send(finalHtml)
  } catch (error) {
    res.status(500).send('Internal Server Error')
  }
})

// 启动服务器
const port = process.env.PORT || 3000
app.listen(port, () => {
  
})
