const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      title: '林影心语',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  }
})
