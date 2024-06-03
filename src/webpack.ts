import path from 'path'
import type { Config } from 'payload/config'
import type { Configuration as WebpackConfig } from 'webpack'

export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
  webpackConfig => {
    const existingWebpackConfig =
      typeof config.admin?.webpack === 'function'
        ? config.admin.webpack(webpackConfig)
        : webpackConfig

    const mockModulePath = path.resolve(__dirname, './mocks/mockFile.js')

    const newWebpack = {
      ...existingWebpackConfig,
      externals: ['express'],
      resolve: {
        ...(existingWebpackConfig.resolve || {}),
        fallback: {
          buffer: require.resolve('buffer'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('stream-http'),
          vm: require.resolve('vm-browserify'),
          zlib: require.resolve('browserify-zlib'),
          querystring: require.resolve('querystring-es3'),
          assert: require.resolve('assert/'),
          fs: false, // Tells Webpack to not resolve 'fs' if it's not critical
          net: false, // Tells Webpack to not resolve 'net'
          async_hooks: false, // Ignore 'async_hooks'
        },
        alias: {
          ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
          // Add additional aliases here like so:
          [path.resolve(__dirname, './yourFileHere')]: mockModulePath,
        },
      },
    }

    return newWebpack
  }
