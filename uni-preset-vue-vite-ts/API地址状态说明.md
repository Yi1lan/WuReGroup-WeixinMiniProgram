# API地址状态说明

## 🔄 地址切换记录

**当前时间**：2024年12月10日 11:00  
**操作**：API地址恢复

### 地址变更历史
1. **原始地址**：`https://cpdllqnupdei.sealosbja.site`
2. **临时更换**：`https://npceaftybirq.sealosbja.site` （已测试正常）
3. **当前恢复**：`https://cpdllqnupdei.sealosbja.site` ⚠️

## 📊 地址状态检查

### 当前地址：`https://cpdllqnupdei.sealosbja.site`

**连接测试结果**：
```bash
curl -v "https://cpdllqnupdei.sealosbja.site"
```

**状态**：⚠️ **服务暂时不可用**
- HTTP状态码：503 Service Unavailable
- 错误信息：`upstream connect error or disconnect/reset before headers`
- 原因：可能是服务器重启、维护或配置问题

**历史状态**：
- 根据搜索结果显示，该地址之前返回404错误，说明服务器可连接但接口路径有问题

### 备用地址：`https://npceaftybirq.sealosbja.site`

**状态**：✅ **正常运行**
- 健康检查接口正常响应
- 所有API功能已验证可用

## 🎯 建议方案

### 方案1：等待原地址恢复（推荐）
```
地址：https://cpdllqnupdei.sealosbja.site
状态：等待服务恢复
预计：可能需要几分钟到几小时
```

### 方案2：临时使用备用地址
```
地址：https://npceaftybirq.sealosbja.site  
状态：正常运行
优点：立即可用，功能完整
```

### 方案3：定期检查并自动切换
可以创建一个检查脚本，定期测试原地址状态，恢复后自动切换回去。

## ⚙️ 当前配置状态

### 已更新的文件
- ✅ **`src/api/config.ts`** - BASE_URL已设置为原地址
- ✅ **`API对接完成说明.md`** - 文档已更新
- ⏳ **`backend-api-requirements.md`** - 需要批量更新

### 应用行为
- 🔴 **当前**：所有API请求将指向 `https://cpdllqnupdei.sealosbja.site`
- ⚠️ **结果**：由于服务不可用，API请求将失败
- 💡 **建议**：暂时切换回备用地址或等待服务恢复

## 🛠️ 快速切换方案

### 切换到备用地址（临时解决）
```typescript
// 修改 src/api/config.ts
BASE_URL: 'https://npceaftybirq.sealosbja.site',
```

### 恢复到原地址（当服务恢复后）
```typescript
// 修改 src/api/config.ts  
BASE_URL: 'https://cpdllqnupdei.sealosbja.site',
```

## 📋 验证步骤

### 检查原地址是否恢复
```bash
# 健康检查
curl "https://cpdllqnupdei.sealosbja.site/health"

# 预期正常响应
{"code":200,"message":"success","data":{"status":"OK",...}}
```

### 功能测试清单
- [ ] 健康检查接口
- [ ] 用户登录（测试账号）
- [ ] 验证码发送
- [ ] 系统配置获取
- [ ] 用户协议获取

## 🔍 监控建议

### 实时状态监控
可以在前端添加一个简单的健康检查，如果检测到API不可用，自动提示用户：

```javascript
// API健康检查
async function checkApiHealth() {
  try {
    const response = await fetch('/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 显示服务状态提示
if (!await checkApiHealth()) {
  uni.showModal({
    title: '服务提示',
    content: '服务暂时不可用，请稍后重试或联系客服',
    showCancel: false
  });
}
```

## 📞 问题排查

### 如果API请求失败
1. **检查网络连接**
2. **确认API地址配置**
3. **查看控制台错误信息**
4. **尝试使用备用地址**
5. **联系后端团队确认服务状态**

### 错误日志关键信息
- `503 Service Unavailable`：服务暂时不可用
- `Connection refused`：服务器拒绝连接
- `Timeout`：请求超时
- `DNS resolution failed`：域名解析失败

---

**当前状态**：⚠️ 原API地址暂时不可用  
**建议操作**：等待服务恢复或使用备用地址  
**监控频率**：建议每15分钟检查一次原地址状态 