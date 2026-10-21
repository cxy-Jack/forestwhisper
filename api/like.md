# 模块：点赞（Like）

Base Path: `/api/v1/like`

## 1. 切换点赞
- Path: `POST /api/v1/like/toggle`
- Auth: RequireAuth
- Request:
  - target_type (string, required, oneof: content, comment)
  - target_id (int, required)

## 2. 查询点赞计数
- Path: `GET /api/v1/like/count`
- Auth: 公开

## 3. 查询点赞状态
- Path: `GET /api/v1/like/status`
- Auth: 公开

## 4. 查询用户点赞列表
- Path: `GET /api/v1/like/user`
- Auth: RequireAuth

## 5. 查询当前用户点赞数量
- Path: `GET /api/v1/like/my/count`
- Auth: RequireAuth
