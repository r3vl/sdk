const replace = require('replace-in-file')
const JFile = require("jfile")

const replaceSdkClientPath = async () => {
  const options = {
    files: ['dist/index.esm.js', 'dist/index.cjs.js', 'dist/index.d.ts'],
    from: /@dethcrypto\/eth-sdk-client/g,
    to: './sdk-client'
  }

  try {
    const results = await replace(options)

    console.log("Results:::", results)
  } catch (error) {
    console.error("Error:::", error)
  }
    

    const options2 = {
      files: ['dist/index.d.ts'],
      from: /.dethcrypto\/eth-sdk-client/g,
      to: './sdk-client'
    }

    try {
      const results = await replace(options2)
  
      console.log("Results:::", results)
    } catch (error) {
      console.error("Error:::", error)
    }

    const options3 = {
      files: ['dist/sdk-client/index.mjs'],
      from: /.\/esm/g,
      to: './esm/index.js'
    }

    try {
      const results = await replace(options3)
  
      console.log("Results:::", results)
    } catch (error) {
      console.error("Error:::", error)
    }

    const options4 = {
      files: ['dist/sdk-client/index.cjs'],
      from: /.\/cjs/g,
      to: './cjs/index.js'
    }

    try {
      const results = await replace(options4)
  
      console.log("Results:::", results)
    } catch (error) {
      console.error("Error:::", error)
    }
}

replaceSdkClientPath().then(() => console.log("Success 1"))

const resolveABIsImports = async () => {
  const options = {
    files: ['dist/sdk-client/cjs/index.js', 'dist/sdk-client/esm/index.js'],
    from: /..\/..\/..\/eth-sdk\//g,
    to: 'dist/eth-sdk/'
  }

  await replace(options)

  try {
    const cjsFile = options.files[0]
    const file = new JFile(cjsFile)

    const lines = file.grep('dist/eth-sdk/abis/')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const importPath = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'))
      const constantName = line.substring(line.indexOf('const ') + 'const '.length, line.lastIndexOf(' = '))
      const importFile = new JFile(importPath)
      const json = JSON.stringify(JSON.parse(importFile.text))
      const options1 = {
        files: [cjsFile],
        from: line,
        to: `const ${constantName} = JSON.parse('{"default":${json}}')`
      }

      await replace(options1)
    }
    
  } catch (error) {
    console.error("Error:::", error)
  }

  try {
    const esmFile = options.files[1]
    const file = new JFile(esmFile)

    const lines = file.grep('dist/eth-sdk/abis/')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const importPath = line.substring(line.indexOf('\'') + 1, line.lastIndexOf('\''))
      const constantName = line.substring(line.indexOf('import ') + 'import '.length, line.lastIndexOf(' from'))
      const importFile = new JFile(importPath)
      const json = JSON.stringify(JSON.parse(importFile.text))
      const options1 = {
        files: [esmFile],
        from: line,
        to: `const ${constantName} = JSON.parse('${json}')`
      }

      await replace(options1)
    }
    
  } catch (error) {
    console.error("Error:::", error)
  }
}

resolveABIsImports().then(() => console.log("Success 2"))
