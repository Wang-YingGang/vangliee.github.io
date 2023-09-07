# Win10下Docsify部署及安装指南
---

## 检查Node.js版本

**使用cmd检查nodejs和npm的版本**

```
nodejs -v
```

**nodejs版本要大于18.0.0**

```
npm -v
```

**npm版本要大于10.0.0**

> 我在安装的时候在初始化docsify的时候会出现找不到指令,我升级了nodejs和npm的版本之后,就ok了

---

## Node.js 安装配置

[nodejs下载地址](https://nodejs.cn/download/)

## 本地安装运行docsify

**直接使用下面命令安装**

```
npm i docsify-cli -g
```

> 这里我也出现了问题,我嫌速度慢,使用了淘宝镜像,导致安装后依然不能初始化

> 下面是淘宝镜像

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

**安装完成后初始化docsify,创建一个默认模板**

```
docsify init D:/docsify
```
**创建完成后会提示你执行 docsify serve D:/docsify**

![](../../images/docsify%E7%9A%84%E5%AE%89%E8%A3%85%E5%8F%8A%E4%BD%BF%E7%94%A8/1.png)

**运行创建的模板库**

```
docsify serve D:/docsify
```

## 修改样式

**html模板文件(可以直接替换)**

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Docs</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="description" content="Description">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <!-- 设置浏览器图标 -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <!-- 默认主题 -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css">
</head>

<body>
    <!-- 定义加载时候的动作 -->
    <div id="app">...</div>
    <script>
        window.$docsify = {
            // 项目名称
            name: '',
            // 仓库地址，点击右上角的Github章鱼猫头像会跳转到此地址
            repo: 'https://github.com/Wang-YingGang',
            // 侧边栏支持，默认加载的是项目根目录下的_sidebar.md文件
            loadSidebar: true,
            // 导航栏支持，默认加载的是项目根目录下的_navbar.md文件
            loadNavbar: true,
            // 封面支持，默认加载的是项目根目录下的_coverpage.md文件
            coverpage: true,
            // 最大支持渲染的标题层级
            maxLevel: 5,
            // 自定义侧边栏后默认不会再生成目录，设置生成目录的最大层级（建议配置为2-4）
            subMaxLevel: 2,
            // 小屏设备下合并导航栏到侧边栏
            mergeNavbar: true,
            /*搜索相关设置*/
            search: {
                maxAge: 86400000,// 过期时间，单位毫秒，默认一天
                paths: 'auto',// 注意：仅适用于 paths: 'auto' 模式
                placeholder: '搜索',              
                // 支持本地化
                placeholder: {
                    '/': '目录搜索',
                },
                noData: '找不到结果',
                depth: 4,
                hideOtherSidebarContent: true,
                namespace: 'Docs',
            }
        }
    </script>
    <!-- docsify的js依赖 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
    <!-- emoji表情支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js"></script>
    <!-- 图片放大缩小支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>
    <!-- 搜索功能支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
    <!--在所有的代码块上添加一个简单的Click to copy按钮来允许用户从你的文档中轻易地复制代码-->
    <script src="//cdn.jsdelivr.net/npm/docsify-copy-code/dist/docsify-copy-code.min.js"></script>
</body>

</html>
```

> 可以修改这里的参数改变样式

**_coverpage.md(封面样式)**

> 内容如下:

```
# 标题

[主页](/README.md)
```

> 通过修改index.html内的coverpage=true来开启,然后在根目录创建_coverpage.md

**_sidebar.md(侧边栏样式)**

> 内容如下:

```
* Other
  * [docsify的安装及使用](/docs/Other/docsify的安装及使用.md)
```

> 通过修改index.html内的sidebar=true来开启,然后在根目录创建_sidebar.md

**_navbar.md(导航栏样式)**

> 内容如下:

```
* 关于本人
  * [Github地址](https://github.com/Wang-YingGang)

* 友情链接
  * [Docsify](https://docsify.js.org/#/)
  * [博客园](https://www.cnblogs.com/)
```

> 通过修改index.html内的navbar=true来开启,然后在根目录创建_navbar.md

**修改完毕打开浏览器访问**

```
http://localhost:3000/
```

> 完成!