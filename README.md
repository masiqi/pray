# Pray

pray 是一个根据用户所在地区生成当前礼拜时间的工具

## 功能

1. 注册用户
   1. 创建多个时刻表
      1. 设定背景图
      2. 设定地区
      3. 设定时区
      4. 设定语言
   2. 删除时刻表
   3. 修改时刻表
      1. 设定固定时间
      2. 设定增量规则
   4. 根据 id 读取时刻表
   5. 生成月、年时刻
   6. ~~设置提醒~~
2. 非注册用户
   1. 根据当前地区生成礼拜时间
   2. 根据 id 读取时刻表
   3. 生成月、年时刻

## 依赖

1. aws
   1. api-gateway
   2. lambda
   3. s3
   4. cloudfront
   5. ​
   6. DynamoDB
   7. ~~SES~~
2. dnspod
3. google-analytics
4. dependence
   1. [vue](https://github.com/vuejs/vue)
   2. [element](https://github.com/ElemeFE/element)
   3. [express](https://github.com/expressjs/express)
   4. [praytimes](http://praytimes.org/manual)
   5. [hijrahdate](https://github.com/msarhan/hijrah-date#readme)
5. serverless

## 数据结构

1. 数据表
   1. pk 分片键
      1. 用户表为`email-` + {{ email }}
      2. 时刻表为`schedule-` + {{ id }}
   2. sk 排序键
      1. 用户表为`email-` + {{ email }}
      2. 时刻表为`schedule-` + {{ email }}
2. GSI
   1. pk 分片键 table 中的 sk
   2. 用来查找  指定用户创建的时刻数据

## API

1. 注册
   > post /user/register  
   > param email,password
2. 登录
   > post /user/login  
   > param email,password
3. 获取时刻列表
   > get /schedules  
   > header jwt
4. 获取时刻详情
   > get /schedule/:id
5. 创建时刻

   > post /schedule  
   > header jwt  
   > param
   >
   > lat 必填 纬度 浮点类型  
   > lon 必填 经度 浮点类型  
   > tz 必填 时区 整数  
   > image 可选 背景图 base64 编码后的图片
   > language 可选 语言 默认为 EN 输入范围「ZH,EN,AR」  
   > method 可选 计时法 默认为 ISNA 输入范围「MWL,ISNA,Egypt,Makkah,Karachi,Tehran,Jafari」

6. 修改时刻
   > put /schedule/sid  
   > header jwt  
   > param
   >
   > lat 必填 纬度 浮点类型  
   > lon 必填 经度 浮点类型  
   > tz 必填 时区 整数  
   > image 可选 背景图 base64 编码后的图片
   > language 可选 语言 默认为 EN 输入范围「ZH,EN,AR」  
   > method 可选 计时法 默认为 ISNA 输入范围「MWL,ISNA,Egypt,Makkah,Karachi,Tehran,Jafari」
7. 删除时刻
   > delete /schedule/:id  
   > header jwt
