'use strict'

exports.default = async function (context) {
  console.log('ARCH', {
    1: 'x64',
    3: 'arm64'
  }[context.arch])
}
