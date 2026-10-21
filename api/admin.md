# 模块：后台管理（Admin）

Base Path: `/api/v1/admin`

## 1. 查询用户列表
- Path: `GET /api/v1/admin/users`
- Auth: RequirePerm(PermUserRead)

## 2. 创建管理员 / 用户（AdminCreateUser）
- Path: `POST /api/v1/admin/user/create`
- Auth: RequirePerm(PermUserEdit)
- Request:
  - name (string, required)
  - email (string, required)
  - password (string, required)
  - roles ([]string, optional)

## 3. 更新用户信息
- Path: `POST /api/v1/admin/user/:uid/update`
- Auth: RequirePerm(PermUserEdit)
- Request:
  - uid (int, required)
  - name (string)
  - email (string)
  - roles ([]string)
  - isActive (*int)

## 4. 审核内容（Review）
- Path: `GET /api/v1/admin/reviews`
- Auth: RequireAuth

## 5. 审核通过
- Path: `POST /api/v1/admin/reviews/:id/approve`
- Auth: RequireAuth
- Request:
  - newValue (string, optional)

## 6. 审核拒绝
- Path: `POST /api/v1/admin/reviews/:id/reject`
- Auth: RequireAuth
- Request:
  - reason (string)

## 7. 查询设置
- Path: `GET /api/v1/admin/settings`
- Auth: 无或与权限挂钩

## 8. 修改设置
- Path: `POST /api/v1/admin/settings`
- Auth: RequirePerm(PermSettingsEdit)
- Request:
  - key (string)
  - value (string)
