# 发布说明

本项目使用一个公开 GitHub 仓库同时发布到 Cloudflare Pages 与 GitHub Pages。Cloudflare Pages 是主站，GitHub Pages 是备用镜像；两者均不需要购买域名或使用付费服务。

## 目标地址

- GitHub 仓库：`Penguin-SAMA/Penguin-SAMA.github.io`（Public）
- 主站：<https://penguin-sama-portfolio.pages.dev>
- 备用镜像：<https://penguin-sama.github.io>
- 自定义域名：不配置

仓库名对应 GitHub 用户站点，因此 Vite 的 `base` 必须保持为 `/`（默认值），不能设置为 `/Penguin-SAMA.github.io/`。

## GitHub Pages

1. 创建公开仓库 `Penguin-SAMA/Penguin-SAMA.github.io`，并将生产代码推送到默认分支 `main`。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. `.github/workflows/deploy-pages.yml` 会在每次推送到 `main` 时运行，也可从 Actions 页面手动触发。
5. 工作流固定使用 pnpm `11.1.2` 与 Node.js `24.14.0`，依次执行类型检查、Lint、测试、20 MiB 视频限制检查和生产构建；全部成功后才上传 `dist` 并部署。
6. 首次成功部署后，从工作流的 `github-pages` environment 或仓库 Pages 设置页确认最终 URL 为 <https://penguin-sama.github.io>。

工作流需要提交 `pnpm-lock.yaml`，并要求 `package.json` 提供 `typecheck`、`lint`、`test`、`check:media` 与 `build` 脚本。Pages 的权限已在工作流中限定为 `contents: read`、`pages: write` 与 `id-token: write`。

## Cloudflare Pages

在 Cloudflare 控制台打开 **Workers & Pages → Create application → Pages → Connect to Git**，然后使用以下设置：

| 设置 | 值 |
| --- | --- |
| Git 提供商 | GitHub |
| 仓库 | `Penguin-SAMA/Penguin-SAMA.github.io` |
| Project name | `penguin-sama-portfolio` |
| Production branch | `main` |
| Framework preset | `React (Vite)` |
| Root directory | 留空（仓库根目录） |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Build system version | `v3` |
| Automatic production deployments | 开启 |
| Preview branch deployments | `All non-Production branches` |

在 Production 与 Preview 两套构建环境中配置相同的非敏感环境变量：

| 变量 | 值 |
| --- | --- |
| `NODE_VERSION` | `24.14.0` |
| `PNPM_VERSION` | `11.1.2` |

项目没有运行时秘密变量，也不需要 Wrangler。首次连接仓库时，必须由 Cloudflare 账户持有人在浏览器中登录，并手动安装或授权 **Cloudflare Workers and Pages** GitHub App 访问该仓库；该账户授权步骤不能由仓库代码或 CI 自动完成。

保存并首次部署后，Cloudflare 会提供 <https://penguin-sama-portfolio.pages.dev>。如果该项目名在创建时不可用，必须在控制台选择新的项目名，并同步更新本文记录的主站 URL。

## 发布后检查

- 确认两个地址均可匿名访问，并且静态资源没有 404。
- 分别访问默认中文页面与 `?lang=en` 英文页面。
- 验证邮箱与 GitHub 外链。
- 验证页面在桌面和移动端没有横向溢出。
- 如加入本地视频，确认播放器可加载、可播放，并检查 Actions 日志中列出的每个视频大小。
- Cloudflare Pages 单文件上限为 25 MiB；仓库检查将视频限制在 20 MiB，为发布过程预留余量。
