# 模块：用户（User）

Base Path: `/api/v1/user`

## 1. 登录
- Path: `POST /api/v1/user/login`
- Auth: 公开
- Request:
  - email (string, required)
  - passwd (string, required)
- Response:
  - 200 登录成功，返回用户信息、token等

## 2. 登出
- Path: `POST /api/v1/user/logout`
- Auth: 公开
- Response: 200 成功

## 3. 注册
- Path: `POST /api/v1/user/register`
- Auth: 公开
- Request:
  - email (string, required)
  - username (string, required)
  - passwd (string, required)
  - code (string, required)

## 4. 发送注册邮箱验证码
- Path: `POST /api/v1/user/email/code/register`
- Auth: 公开
- Request:
  - email (string, required)

## 5. 获取本人信息
- Path: `GET /api/v1/user/me`
- Auth: RequireAuth

## 6. 查询用户列表
- Path: `GET /api/v1/user/users`
- Auth: 公开
- Query:
  - name (string, optional)
  - exactly (string, optional)

## 7. 更新个人资料
- Path: `POST /api/v1/user/me/update`
- Auth: RequireAuth
- Request (任意字段):
  - name (string)
  - gender (string)
  - birthday (string)
  - bio (string)

## 8. 修改密码
- Path: `POST /api/v1/user/passwd`
- Auth: RequireAuth
- Request:
  - oldPassword (string, required)
  - newPassword (string, required)

## 9. 删除用户
- Path: `POST /api/v1/user/users/del`
- Auth: RequireAuth
- Request:
  - uid (int, required)

## 10. 管理员创建用户
- Path: `POST /api/v1/admin/user/create`
- Auth: RequirePerm(PermUserEdit)
- Request:
  - name (string, required)
  - email (string, required)
  - password (string, required)
  - roles ([]string, optional)

## 11. 管理员更新用户
- Path: `POST /api/v1/admin/user/:uid/update`
- Auth: RequirePerm(PermUserEdit)
- Request:
  - uid (int, required)
  - name (string)
  - email (string)
  - roles ([]string)
  - isActive (*int)
