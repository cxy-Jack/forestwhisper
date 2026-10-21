# 模块：AI 聊天（AI Chat）

Base Path: `/api/v1/ai`

> 该模块整体被 `AuthMiddleware` 包裹，必须登录后请求。

## 1. 查询会话列表
- Path: `GET /api/v1/ai/conversations`
- Auth: RequireAuth

## 2. 查询消息列表
- Path: `GET /api/v1/ai/messages`
- Auth: RequireAuth

## 3. AI 聊天（流式）
- Path: `POST /api/v1/ai/chat`
- Auth: RequireAuth
- Request:
  - conversationId (string)
  - message (string)

## 4. 删除会话
- Path: `POST /api/v1/ai/conversation/del`
- Auth: RequireAuth
- Request:
  - conversationId (string)
