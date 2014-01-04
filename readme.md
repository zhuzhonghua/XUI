##XUI是什么
XUI是一个能够让你使用flash cs这样的富媒体创作工具，来制作基于cocos2d-html5 和cocos2d-x 手游的工具。

相对于其它基于flash cs的工具，XUI的限制更少，API定制更丰富，基于关键帧，使用的资源量更少。

基于javascript脚本，所以完全可以实现APP内更新，并且可以做到开发一次，同时发布 ios app , android app和html5版本

在现在手游的创业热潮中，希望能给行业做出点自己的贡献。

##视频展示
两段视频可以展示，目前XUI的功能

1. http://www.tudou.com/programs/view/iz10aSfMeVk/
   基本功能的展示
2. http://www.tudou.com/programs/view/yWjLS2LoIh4/
   自己在网上找资源拼凑的一个简单版本天天跑酷

##XUI的构成
XUI分两部分：
1. Flash CS的插件，用于导出fla中的资源及相关配置信息
2. cocos2d-html5和cocos2d-x的jsb接口，解析第一步导出的配置文件，并使用cocos2d系列的API显示

所以理论上，可以替换第二部分的API接口，来适应到其它非cocos2d系列的引擎上。

##如何使用
1. 可以直接使用cocos2d-html5/Test/index.html来查看cocos2d-html5版本的demo，也可以使用自己的fla，来导出试试看
    1. 准备好自己的fla
    2. 使用export工具导出
    3. 把相应文件分别拷贝到src和res目录
    4. 修改cocos2d.js中的appFiles
    5. 修改main.js中的该行，为自己的变量名 var testResource = XUI.filterResource(control)
    6. 修改testApp.js中的该行，为自己的变量名 var xui = new XUI(control);
2. 可以直接使用cocos2d-x/projects/PVZOL/win32/pvzol.sln，来查看上面第二部分的视频demo

##关于导出工具
关于export.swf， export.fla 以及export.jsfl如何使用，请参考
[http://ajarproductions.com/blog/2011/02/08/creating-flash-extensions-pt1/]
(http://ajarproductions.com/blog/2011/02/08/creating-flash-extensions-pt1/)

##API介绍
API 使用

    var ctlXUI = new XUI()
    ctlXUI.load(xxx)
    
    var ctlDOM = ctlXUI.getDOM()
    
    var node = ctlXUI.getNode(xxx)

node除了支持API中的方法，还支持别的各种方法
简单列举如下，具体查看XUI.js

    button

    node.addEvent("click", function(){
    })

动画label帧
如果想控制某一段帧动画，那么就加一个帧标签吧

    node.addEvent("frame_enter", function(){})

dom 或者mc

    node.startUpdate()
    node.stopUpdate()

基于MIT协议发布
[http://www.opensource.org/licenses/mit-license.php]
(http://www.opensource.org/licenses/mit-license.php)
