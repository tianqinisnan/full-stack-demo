### step1
好的，我现在我们来实现一个大的功能迭代，目标是做成一个社交平台，主要功能包括单人和单人之间的聊天，以及多人在线的聊天室功能，让我们一步一步实现。
首先扩展下当前的登陆功能
1. 如果第一次登陆（数据库中未查询到手机号），需要在输入验证码验证通过后，增加一个设置昵称的过程，昵称默认为手机号前3位+****+后四位，用户可以手动修改，提交后保存到数据库
2. 如果非首次登陆（数据库中查询到对应手机号），需要读取数据到库中的昵称，若没有读取到，按照上面第一步的规则生成昵称，并自动保存到数据库中
3.登陆成功后，将昵称展示在首页中

### step2
现在帮我实现一个底部导航的组件，参考下图，底部导航有四个标签，分别是首页（/home）、通讯录（/contacts）、发现（/discover）、我的（/me），点击每个标签，可以跳转到对应的页面，底部导航需要固定在页面底部，不会随着页面滚动而滚动。
同时新增3个页面，分别是通讯录、发现、我的，底部导航的4个标签，分别对应这3个页面+已有的home页。
![alt text](tabbar.png)

### step3
现在，开始做通讯录页面
1.首先，增加获取全部user信息的接口，并在通讯录页面获取数据渲染出来
2.要求展示为头像+昵称的形式
3.数据库增加头像url字段，默认先为空，前端取不到，设置成默认头像
4.增加一个生成默认头像的公共组件，取昵称生成一个临时图片

### step4
实现一个类似于微信的聊天页面
1.先实现前端页面
// 页面结构
pages/
├── Chat/
│   ├── index.tsx          // 聊天列表页面
│   ├── ChatRoom.tsx      // 聊天室页面
│   └── style.module.css

2. 根据前端页面及api使用，实现后端的api定义，及数据库表结构

### step5
现在，让我们实现消息的实时同步功能，具体要实现如下2个功能点

第1个功能点： A发送消息给B时，B在登陆状态下，会实时收到消息通知，具体体现在 1. 页面有一个toast提示“新消息来了～”；2.当在会话列表页面或是在与A的会话聊天室页面，会立刻刷新数据

第2个功能点：当A发送消息给B后，B查看了消息（已读后），会实时通知A，A如果在与B的聊天室页面，会刷新消息的已读状态

请实现以上两个功能点，需要注意的是：
1.判断在不在会话列表页或是聊天室页面，应该是在组件维度，不应该在路由维度
2.具体实现应该贴近当前项目的编码风格

以下是具体的代码路径，供参考
前端：
会话列表： @Chat 
聊天室： @ChatRoom 
路由： @routes 
接口服务： @services 
公共组件： @components 
工具函数： @utils 

后端：
接口入口： @routes 
接口具体实现： @controllers 
数据库模型： @models 
