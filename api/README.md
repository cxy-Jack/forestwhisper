# ForestWhisper API 文档（模块化）

本套文档按模块拆分，便于企业级维护与阅读。

## 结构

- `doc/api/README.md` - 本索引页
- `doc/api/user.md` - 用户口令与认证相关
- `doc/api/content.md` - 内容管理相关
- `doc/api/comment.md` - 评论管理相关
- `doc/api/like.md` - 点赞管理相关
- `doc/api/meta.md` - 元信息管理相关（分类/标签）
- `doc/api/option.md` - 网站配置设置相关
- `doc/api/admin.md` - 管理员权限、审核及用户管理
- `doc/api/stats.md` - 管理统计接口
- `doc/api/aichat.md` - AI 聊天服务接口

## 统一约定

- 基础路径: `/api/v1`
- HTTP 方法: `GET`, `POST`
- 响应格式: JSON
- 通用响应：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

- 认证类型：
  - `公开`：无需认证
  - `RequireAuth`：登录用户
  - `RequirePerm`：需要管理员权限
