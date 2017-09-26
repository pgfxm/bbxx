## 贝比秀秀小程序

#### src下面文件：
- app.js 小程序启动脚本
- app.json 小程序的全局配置
- app.wxss 小程序的公共样式，所有页面可引用，同名样式会被page对应的样式覆盖
- config.js 主要是一些常量配置，会挂到app.globalData
###### 文件夹说明
- utils 公用js类库
- template 公共可复用template
- style 公用sass，包括base(sass基础库)和widget(可复用的小部件）
- pages 各相应页面对应文件
- modules 比较独立的一些模块
- lib、vdian买家购买相关的模块和用到库、是复用杭州的

## 项目构建相关：

setp1: `npm install`

开发：`gulp(build&watch)`

构建打包：
- `gulp build 或 npm run build`
- 切换环境参数：-e[test\pro\pre] 如：gulp build -e pro 接口用的线上环境，目前默认用的也是线上环境
- 开发时不想压缩JS,可加-dev 参数，如：gulp build -dev

