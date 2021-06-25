// compile style sheet when be in use

const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    // point at antd：compile js/css when being using (import it compile it ) (by using babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,  // compile css automatically
    }),

    // 使用less-loader对源码中的less的变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},
    }),
)