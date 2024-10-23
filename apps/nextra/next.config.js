const { join, resolve } = require('path')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})
 
// If you have other Next.js configurations, you can pass them as the parameter:
module.exports = withNextra({ 
  basePath: '/documentation',
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: join(__dirname, '../../'),
  }
 })