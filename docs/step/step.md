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