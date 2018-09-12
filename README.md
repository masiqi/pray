# Pray

pray是一个根据用户所在地区生成当前礼拜时间的工具

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
   4. 根据id读取时刻表
   5. 生成月、年时刻
   6. 设置提醒
2. 非注册用户
   1. 根据当前地区生成礼拜时间
   2. 根据id读取时刻表
   3. 生成月、年时刻

## 依赖

1. aws
   1. api-gateway
   2. lambda
   3. s3
   4. cloudfront
   5. ​
   6. DynamoDB
   7. SES
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

1. User
2. Location

## API

1. 注册
2. 登录
3. 获取时刻列表
4. 获取时刻详情
5. 创建时刻
6. 修改时刻
7. 删除时刻