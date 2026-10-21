# 模块：配置（Option）

Base Path: `/api/v1/options`

## 1. 查询所有配置
- Path: `GET /api/v1/options`
- Auth: 公开

## 2. 查询指定配置
- Path: `GET /api/v1/options/:key`
- Auth: 公开

## 3. 批量设置配置
- Path: `POST /api/v1/options`
- Auth: RequirePerm(PermSettingsEdit)
- Request:
  - key (string)
  - value (string)

## 4. 设置单项配置
- Path: `POST /api/v1/options/set`
- Auth: RequirePerm(PermSettingsEdit)
- Request: 同上

## 5. 删除配置
- Path: `POST /api/v1/options/delete/:key`
- Auth: RequirePerm(PermSettingsEdit)
