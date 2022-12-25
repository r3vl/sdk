const replace = require('replace-in-file')

const options = {
  files: ['dist/index.esm.js', 'dist/index.cjs.js'],
  from: /@dethcrypto\/eth-sdk-client/g,
  to: './sdk-client'
}

replace(options)
  .then(results => {
    console.log('Replacement results:', results)
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })
