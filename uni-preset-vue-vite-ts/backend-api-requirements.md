# 乌鲁木齐热力集团供热缴费小程序 - API接口对接文档

## 基础信息

### 接口域名
- **生产环境**: `https://cpdllqnupdei.sealosbja.site`
- **开发环境**: `http://localhost:3000`
- **测试环境**: `https://api-test.wuregroup.com`

### 通用请求头
```http
Content-Type: application/json
Authorization: Bearer {token}  // 需要登录的接口必填
```

### 统一响应格式
```json
{
  "code": 200,           // 状态码：200成功，其他为失败
  "message": "success",  // 响应消息
  "data": {},           // 响应数据
  "timestamp": 1648656000000  // 时间戳
}
```

### 错误码说明
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/token失效 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 手机号格式错误 |
| 1002 | 验证码错误 |
| 1003 | 用户已存在 |
| 1004 | 用户不存在 |
| 1005 | 密码错误 |
| 1006 | 验证码已过期 |
| 1007 | 验证码发送失败 |
| 1008 | 操作频繁，请稍后再试 |

---

## 1. 短信验证码接口

### 1.1 发送验证码

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/sms/send`

**接口描述**: 向指定手机号发送验证码，用于登录和注册

**请求参数**:
```json
{
  "phone": "13888888888",  // 手机号，必填，11位数字
  "type": "login"          // 验证码类型，必填，可选值: login, register, reset_password
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "phone": "13888888888",
    "expire_time": 300     // 验证码有效期（秒）
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 1001,
  "message": "手机号格式不正确",
  "data": null,
  "timestamp": 1648656000000
}
```

**其他错误示例**:
```json
{
  "code": 1008,
  "message": "操作频繁，请稍后再试",
  "data": null,
  "timestamp": 1648656000000
}
```

### 1.2 验证验证码

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/sms/verify`

**接口描述**: 验证短信验证码是否正确

**请求参数**:
```json
{
  "phone": "13888888888",    // 手机号，必填
  "code": "123456",          // 验证码，必填，6位数字
  "type": "login"            // 验证码类型，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "验证码正确",
  "data": {
    "is_valid": true
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 1002,
  "message": "验证码错误",
  "data": null,
  "timestamp": 1648656000000
}
```

---

## 2. 用户认证接口

### 2.1 用户登录

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/auth/login`

**接口描述**: 用户通过手机号和验证码登录

**请求参数**:
```json
{
  "phone": "13888888888",    // 手机号，必填
  "code": "123456"           // 验证码，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token
    "refresh_token": "refresh_token_string",              // 刷新token
    "expires_in": 7200,                                   // token有效期（秒）
    "user_info": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "phone": "13888888888",
      "nickname": "用户昵称",
      "avatar": "",
      "is_first_login": false,
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 1004,
  "message": "用户不存在，请先注册",
  "data": null,
  "timestamp": 1648656000000
}
```

### 2.2 用户注册

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/auth/register`

**接口描述**: 用户注册新账号

**请求参数**:
```json
{
  "phone": "13888888888",      // 手机号，必填
  "code": "123456",            // 验证码，必填
  "password": "123456789",     // 密码，必填，6-20位
  "nickname": "用户昵称"        // 昵称，可选，默认为手机号
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "phone": "13888888888",
    "nickname": "用户昵称",
    "created_at": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 1003,
  "message": "用户已存在",
  "data": null,
  "timestamp": 1648656000000
}
```

### 2.3 刷新Token

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/auth/refresh`

**接口描述**: 使用refresh_token刷新访问token

**请求参数**:
```json
{
  "refresh_token": "refresh_token_string"  // 刷新token，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "token刷新成功",
  "data": {
    "token": "new_access_token",
    "refresh_token": "new_refresh_token",
    "expires_in": 7200
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 401,
  "message": "Token无效",
  "data": null,
  "timestamp": 1648656000000
}
```

### 2.4 用户登出

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/auth/logout`

**接口描述**: 用户登出，使当前token失效

**请求头**: 需要Authorization

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null,
  "timestamp": 1648656000000
}
```

---

## 3. 用户信息接口

### 3.1 获取用户信息

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/user/profile`

**接口描述**: 获取当前登录用户的详细信息

**请求头**: 需要Authorization

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "phone": "13888888888",
    "nickname": "用户昵称",
    "avatar": "",
    "real_name": "张三",
    "id_card": "610102********1234",  // 脱敏显示
    "address": "详细地址",
    "heat_account": "H202400001",
    "balance": 1250.50,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": 1648656000000
}
```

### 3.2 更新用户信息

**接口地址**: `PUT https://npceaftybirq.sealosbja.site/api/user/profile`

**接口描述**: 更新用户基本信息

**请求头**: 需要Authorization

**请求参数**:
```json
{
  "nickname": "新昵称",        // 昵称，可选
  "real_name": "张三",         // 真实姓名，可选
  "id_card": "610102199001011234", // 身份证号，可选
  "address": "新地址"          // 地址，可选
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "updated_fields": ["nickname", "address"]
  },
  "timestamp": 1648656000000
}
```

### 3.3 修改密码

**接口地址**: `PUT https://npceaftybirq.sealosbja.site/api/user/password`

**接口描述**: 修改用户登录密码

**请求头**: 需要Authorization

**请求参数**:
```json
{
  "old_password": "旧密码",      // 旧密码，必填
  "new_password": "新密码",      // 新密码，必填，6-20位
  "phone": "13888888888",       // 手机号，必填
  "code": "123456"              // 验证码，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null,
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 1005,
  "message": "旧密码错误",
  "data": null,
  "timestamp": 1648656000000
}
```

---

## 4. 供热账户管理接口

### 4.1 绑定供热账号

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/heat/bind`

**接口描述**: 绑定用户的供热账号

**请求头**: 需要Authorization

**请求参数**:
```json
{
  "heat_account": "H202400001",   // 供热账号，必填
  "real_name": "张三",            // 户主姓名，必填
  "id_card": "610102199001011234", // 户主身份证，必填
  "address": "天山区xx小区xx号楼xx单元xx室" // 供热地址，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "绑定成功",
  "data": {
    "heat_account": "H202400001",
    "real_name": "张三",
    "address": "天山区xx小区xx号楼xx单元xx室",
    "heating_area": 85.5,
    "heating_fee": 1250.50,
    "bind_time": "2024-01-01T12:00:00.000Z"
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 400,
  "message": "供热账号已被绑定",
  "data": null,
  "timestamp": 1648656000000
}
```

### 4.2 获取供热账户信息

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/heat/account`

**接口描述**: 获取当前用户绑定的供热账户信息

**请求头**: 需要Authorization

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "heat_account": "H202400001",
    "real_name": "张三",
    "address": "天山区xx小区xx号楼xx单元xx室",
    "heating_area": 85.5,
    "current_balance": -1250.50,
    "total_fee": 2500.00,
    "paid_fee": 1249.50,
    "unpaid_fee": 1250.50,
    "heating_season": "2024-2025",
    "payment_deadline": "2024-11-30T00:00:00.000Z",
    "heating_start": "2024-11-01T00:00:00.000Z",
    "heating_end": "2025-03-31T00:00:00.000Z"
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 404,
  "message": "未绑定供热账号",
  "data": null,
  "timestamp": 1648656000000
}
```

---

## 5. 缴费相关接口

### 5.1 获取缴费信息

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/payment/info`

**接口描述**: 获取用户的缴费信息和账单详情

**请求头**: 需要Authorization

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "heat_account": "H202400001",
    "unpaid_bills": [
      {
        "bill_id": "B1734502968024",
        "heating_season": "2024-2025",
        "amount": 1250.50,
        "bill_date": "2024-12-18T07:49:28.024Z",
        "due_date": "2024-11-30T00:00:00.000Z",
        "status": "unpaid",
        "late_fee": 0.00
      }
    ],
    "total_unpaid": 1250.50,
    "total_late_fee": 0.00
  },
  "timestamp": 1648656000000
}
```

### 5.2 创建支付订单

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/payment/create`

**接口描述**: 创建支付订单，用于微信支付

**请求头**: 需要Authorization

**请求参数**:
```json
{
  "bill_ids": ["B1734502968024"],     // 要支付的账单ID数组，必填
  "amount": 1250.50                   // 支付金额，必填
}
```

**成功返回**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "order_id": "O1734502968025",
    "amount": 1250.50,
    "wechat_pay_params": {
      "appId": "wxAppId",
      "timeStamp": "1734502968",
      "nonceStr": "abc123def456",
      "package": "prepay_id=wx1734502968025",
      "signType": "RSA",
      "paySign": "signString"
    },
    "created_at": "2024-12-18T07:49:28.025Z"
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 400,
  "message": "账单信息不正确",
  "data": null,
  "timestamp": 1648656000000
}
```

### 5.3 查询支付状态

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/payment/status/{order_id}`

**接口描述**: 查询订单支付状态

**请求头**: 需要Authorization

**路径参数**: order_id - 订单ID

**成功返回**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "order_id": "O1734502968025",
    "status": "paid",              // pending-待支付，paid-已支付，failed-支付失败，canceled-已取消
    "amount": 1250.50,
    "paid_at": "2024-12-18T07:55:28.025Z",
    "payment_method": "wechat"
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 404,
  "message": "订单不存在",
  "data": null,
  "timestamp": 1648656000000
}
```

### 5.4 获取缴费记录

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/payment/history`

**接口描述**: 获取用户缴费历史记录

**请求头**: 需要Authorization

**查询参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认20
- `start_date`: 开始日期，格式YYYY-MM-DD
- `end_date`: 结束日期，格式YYYY-MM-DD

**示例**: `GET https://npceaftybirq.sealosbja.site/api/payment/history?page=1&size=20&start_date=2024-01-01&end_date=2024-12-31`

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 25,
    "page": 1,
    "size": 20,
    "records": [
      {
        "order_id": "O1734502968025",
        "bill_id": "B1734502968024",
        "amount": 1250.50,
        "heating_season": "2024-2025",
        "payment_method": "wechat",
        "status": "paid",
        "paid_at": "2024-12-18T07:55:28.025Z",
        "receipt_url": ""
      }
    ]
  },
  "timestamp": 1648656000000
}
```

### 5.5 微信支付回调

**接口地址**: `POST https://npceaftybirq.sealosbja.site/api/payment/notify`

**接口描述**: 微信支付结果回调接口（由微信服务器调用，前端无需对接）

---

## 6. 配置和通用接口

### 6.1 获取用户协议和隐私政策

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/config/agreements`

**接口描述**: 获取用户协议和隐私政策内容

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "user_agreement": {
      "title": "用户协议",
      "content": "欢迎使用精准暖费速办小程序。本协议是您与乌鲁木齐热力集团有限公司之间关于您使用本小程序的法律协议...",
      "version": "1.0",
      "updated_at": "2024-01-01"
    },
    "privacy_policy": {
      "title": "隐私政策",
      "content": "乌鲁木齐热力集团有限公司（以下简称\"我们\"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠...",
      "version": "1.0",
      "updated_at": "2024-01-01"
    }
  },
  "timestamp": 1648656000000
}
```

### 6.2 获取系统配置

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/config/system`

**接口描述**: 获取系统配置信息（客服电话、公告等）

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "customer_service_phone": "0991-1234567",
    "business_hours": "周一至周五 9:00-18:00",
    "company_name": "乌鲁木齐热力集团有限公司",
    "company_address": "乌鲁木齐市天山区...",
    "app_version": "1.0.0",
    "announcement": "系统将于12月1日进行维护升级，维护期间服务可能暂时中断，敬请谅解。",
    "maintenance_notice": null
  },
  "timestamp": 1648656000000
}
```

---

## 7. 数据统计接口

### 7.1 获取用户统计数据

**接口地址**: `GET https://npceaftybirq.sealosbja.site/api/statistics/user`

**接口描述**: 获取用户相关的统计数据

**请求头**: 需要Authorization

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total_heating_seasons": 3,
    "total_paid_amount": 5280.50,
    "current_season_paid": 1250.50,
    "average_monthly_consumption": 415.67,
    "on_time_payment_rate": 0.95
  },
  "timestamp": 1648656000000
}
```

**失败返回**:
```json
{
  "code": 404,
  "message": "未绑定供热账号",
  "data": null,
  "timestamp": 1648656000000
}
```

---

## 8. 健康检查接口

### 8.1 服务健康检查

**接口地址**: `GET https://npceaftybirq.sealosbja.site/health`

**接口描述**: 检查服务运行状态

**请求参数**: 无

**成功返回**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": "OK",
    "timestamp": "2024-12-18T07:51:08.024Z",
    "mongodb": "connected"
  },
  "timestamp": 1734502968024
}
```

---

## 对接注意事项

### 1. 认证流程
1. 用户首次使用：发送验证码 → 注册 → 登录
2. 老用户：发送验证码 → 登录
3. 获取token后，在后续请求头中携带：`Authorization: Bearer {token}`

### 2. 错误处理
- 所有接口都遵循统一的响应格式
- 根据`code`字段判断请求是否成功
- `code`为200表示成功，其他值表示失败
- 失败时，`message`字段包含具体错误信息

### 3. 分页处理
- 列表接口支持分页，使用`page`和`size`参数
- 响应中包含`total`总数，`page`当前页，`size`每页数量

### 4. 时间格式
- 所有时间字段采用ISO 8601格式：`YYYY-MM-DDTHH:mm:ss.sssZ`
- 时间戳使用毫秒级Unix时间戳

### 5. 数据类型
- 金额字段为数字类型，保留2位小数
- ID字段为字符串类型
- 布尔字段为boolean类型

### 6. 安全建议
- token有效期为2小时，请及时刷新
- 敏感操作（如修改密码）需要短信验证码
- 所有请求使用HTTPS加密传输

### 7. 限流规则
- 短信验证码：同一手机号1分钟内只能发送1次
- 全局限制：每个IP 15分钟内最多100个请求

### 8. 接口测试
可以使用以下方式测试接口连通性：
```bash
curl https://npceaftybirq.sealosbja.site/health
```

根据 [您提供的API地址](https://npceaftybirq.sealosbja.site) 的响应格式，确认服务已正常运行。

---

**文档版本**: v1.0  
**最后更新**: 2024年12月18日  
**API根地址**: https://npceaftybirq.sealosbja.site  
**技术支持**: 0991-1234567 