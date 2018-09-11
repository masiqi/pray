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
   5. DynamoDB
   6. SES
2. dnspod
3. google-analytics
4. express

## 数据结构

1. User
2. Location

