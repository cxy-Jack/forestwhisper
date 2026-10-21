# 模块：元信息（Meta）

Base Path: `/api/v1/meta`

## 1. 获取所有元信息
- Path: `GET /api/v1/meta`
- Auth: 公开

## 2. 获取单个元信息
- Path: `GET /api/v1/meta/:mid`
- Auth: 公开

## 3. 创建元信息
- Path: `POST /api/v1/meta`
- Auth: RequireAuth
- Request:
  - name (string)
  - type (string)
  - slug (string)
  - description (string)
  - parent (int)

## 4. 更新元信息
- Path: `POST /api/v1/meta/:mid`
- Auth: RequireAuth
- Request: 同创建

## 5. 删除元信息
- Path: `POST /api/v1/meta/:mid/del`
- Auth: RequireAuth
