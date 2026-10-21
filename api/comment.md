# 模块：评论（Comment）

Base Path: `/api/v1/comment`

## 1. 获取评论列表
- Path: `GET /api/v1/comment`
- Auth: 公开

## 2. 获取当前用户评论
- Path: `GET /api/v1/comment/my`
- Auth: RequireAuth

## 3. 获取内容评论
- Path: `GET /api/v1/comment/content/:cid`
- Auth: 公开

## 4. 获取单条评论
- Path: `GET /api/v1/comment/:coid`
- Auth: 公开

## 5. 发布评论
- Path: `POST /api/v1/comment`
- Auth: 公开
- Request:
  - cid (int, required)
  - text (string, required)
  - url (string)
  - type (string)
  - parent (int)

## 6. 更新评论
- Path: `POST /api/v1/comment/:coid`
- Auth: RequireAuth

## 7. 审核评论
- Path: `POST /api/v1/comment/:coid/approve`
- Auth: RequireAuth

## 8. 删除评论
- Path: `POST /api/v1/comment/:coid/del`
- Auth: RequireAuth
