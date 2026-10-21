# 模块：内容（Content）

Base Path: `/api/v1/content`

## 1. 获取内容列表
- Path: `GET /api/v1/content`
- Auth: 公开
- Query:
  - page
  - limit
  - filter

## 2. 获取分类内容
- Path: `GET /api/v1/content/category/:mid`
- Auth: 公开

## 3. 获取当前用户内容
- Path: `GET /api/v1/content/my`
- Auth: RequireAuth

## 4. 获取单条内容
- Path: `GET /api/v1/content/:cid`
- Auth: 公开

## 5. 创建内容
- Path: `POST /api/v1/content`
- Auth: RequireAuth
- Request:
  - title (string)
  - text (string)
  - type (string)
  - status (string)
  - password (string)
  - template (string)
  - categoryMid (int)

## 6. 更新内容
- Path: `POST /api/v1/content/:cid`
- Auth: RequireAuth
- Request: 同创建内容，可按需替换部分字段

## 7. 删除内容
- Path: `POST /api/v1/content/:cid/del`
- Auth: RequireAuth
