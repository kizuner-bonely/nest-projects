# nest-projects

projects to learn nest

## 项目

- **图片压缩**
  - 前端启动: `pnpm -C projects/sharp/frontend dev`
  - 后端启动: `pnpm -C projects/sharp/backend start:dev`
- **邮件接发**
  - 在 `projects/emailManager/backend` 新建文件 `.env` 并填上 email 和 emailAuth
  - 启动：`pnpm -C projects/emailManager/backend start:dev`
  - 发邮件: `localhost:3000/send`
  - 收邮件: `localhost:3000/get` `localhost:3000/getMail`
- **通过邮箱登录**
  - 在 `projects/emailManager/backend/src` 新建文件 `.env` 并填上 email、emailAut、databaseUsername、databasePassword
  - 前端启动: `pnpm -C projects/loginByEmail/backend dev`
  - 后端启动: `pnpm -C projects/loginByEmail/frontend start:dev`
- **jwt登录注册**
  - 在 `projects/jwt/backend/src` 新建文件 `.env` 并填上 databaseUsername、databasePassword、jwtSecret
  - 后端启动: `pnpm -C projects/jwt/backend start:dev`
- **无感刷新**
  - 前端启动: `pnpm -C projects/autoRefresh/frontend dev`
  - 后端启动: `pnpm -C projects/autoRefresh/backend start:dev`
