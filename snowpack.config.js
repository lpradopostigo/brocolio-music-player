const envMode = process.env.NODE_ENV

if (envMode === 'development') {
  module.exports = {
    mount: {
      src: { url: '/' }

    },
    devOptions: {
      open: 'none'
    }
  }
} else if (envMode === 'production') {
  module.exports = {
    mount: {
      src: { url: '/' }
    },
    buildOptions: {
      out: 'dist',
      clean: true
    }
  }
}
