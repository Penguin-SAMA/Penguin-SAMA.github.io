# 毛启德｜游戏客户端开发个人作品集

一个面向游戏客户端开发岗位的双语单页作品集，展示 Unreal Engine、Godot、C++、图形学与引擎工程实践。站点采用 React、TypeScript 与 Vite 构建，无后台、数据库、登录或付费依赖，可免费发布为任何人都能访问的静态网页。

## 站点状态与预期地址

- GitHub Pages：<https://penguin-sama.github.io>
- Cloudflare Pages（预期主站）：<https://penguin-sama-portfolio.pages.dev>

以上是部署完成后的目标地址。本仓库只包含站点与发布配置，不代表 Cloudflare 已完成账户授权，也不代表任一地址已经上线。Cloudflare 项目名只有在控制台创建成功后才会被保留。

## 页面内容

- 默认中文，可切换为英文；英文状态使用 `?lang=en`，并在浏览器中保存语言偏好。
- 页面依次包含吸顶导航、首屏、精选作品、技术栈、关于、联系与页脚。
- 当前展示 FPS DEMO、生存建造、武汉文化文字冒险和 Hazel 引擎现代化四个项目。
- 未配置真实媒体时使用明确标注的抽象占位封面，不以生成图冒充游戏截图。
- 支持图片、本地 HTML5 视频，以及点击后才加载的 Bilibili/YouTube 外链视频。
- 完整支持键盘操作、可见焦点和 `prefers-reduced-motion` 减少动效偏好。

## 技术栈

- React 19、TypeScript、Vite
- 原生 CSS 设计系统与响应式布局
- Motion for React
- Vitest、Testing Library、Playwright、ESLint、Lighthouse
- pnpm 11.1.2、Node.js 24.14.0（发布环境固定版本）

## 本地运行

安装依赖并启动开发服务器：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
pnpm test:e2e
pnpm check:media
pnpm build
pnpm preview
```

`pnpm build` 会先执行 TypeScript 项目构建，再生成 `dist`。首次执行 Playwright 端到端测试前，如本机还没有 Chromium，可运行 `pnpm exec playwright install chromium` 安装测试浏览器。

## 替换文字与作品信息

所有公开内容集中在 [`src/content/portfolio.ts`](src/content/portfolio.ts)：

- `siteCopy`：SEO 文案、导航、首屏与章节标题。
- `projects`：项目标题、状态、摘要、要点、技术标签、媒体与可选链接。
- `skillGroups`：Engine、Programming、Graphics、Workflow 四组技术栈。
- `about`、`education`、`contactLinks`：个人介绍、教育信息和公开联系方式。

所有可见文案都使用 `{ zh, en }` 双语结构。新增或修改内容时应同时填写中文与英文，不要在组件中硬编码作品数据。

## 替换图片与视频

公开媒体统一放在 `public/media/`，代码中使用以 `/media/` 开头的站点根路径。例如：

```ts
{
  type: 'localVideo',
  src: '/media/projects/fps-demo.webm',
  poster: '/media/projects/fps-demo-poster.webp',
  title: { zh: 'FPS DEMO 演示', en: 'FPS Demo Showcase' },
  alt: { zh: 'FPS DEMO 项目演示视频', en: 'FPS demo project video' },
}
```

图片替换完成后，将对应媒体项的 `isPlaceholder` 设为 `false`。建议图片使用 WebP 或 AVIF，并提供准确的双语替代文本；视频应提供压缩过的海报图。

本地视频约束：

- 检查扩展名为 `.mp4`、`.webm`、`.ogg`、`.mov` 的文件，大小写不敏感。
- 每个视频必须不超过 **20 MiB（20,971,520 字节）**。
- `pnpm check:media` 会递归扫描 `public/media/`，逐个报告视频路径和大小，超限时以失败状态退出。
- 超过限制的视频应重新编码压缩，或改为 Bilibili/YouTube 外链媒体；不要删除检查来绕过发布限制。

## GitHub Pages 部署

目标公开仓库为 `Penguin-SAMA/Penguin-SAMA.github.io`，生产分支为 `main`。这是 GitHub 用户站点，因此 Vite 的 `base` 保持默认 `/`，不要改为仓库子路径。

1. 创建并推送公开仓库，确保 `main` 是默认分支。
2. 打开 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 推送到 `main`，或在 Actions 页面手动运行 `.github/workflows/deploy-pages.yml`。
5. 工作流依次运行类型检查、Lint、测试、媒体检查与生产构建；全部成功后才上传 `dist` 并发布到 <https://penguin-sama.github.io>。

GitHub Actions 固定使用 pnpm 11.1.2 与 Node.js 24.14.0，并使用最小化的 Pages 发布权限。提交时必须包含 `pnpm-lock.yaml`。

## Cloudflare Pages 部署

Cloudflare 使用 Git 集成连接同一个公开仓库。在 **Workers & Pages → Create application → Pages → Connect to Git** 中填写：

| 设置 | 值 |
| --- | --- |
| 仓库 | `Penguin-SAMA/Penguin-SAMA.github.io` |
| Project name | `penguin-sama-portfolio` |
| Production branch | `main` |
| Framework preset | `React (Vite)` |
| Root directory | 留空（仓库根目录） |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Build system version | `v3` |
| Production deployments | 开启 |
| Preview branches | `All non-Production branches` |

Production 与 Preview 环境都设置：

```text
NODE_VERSION=24.14.0
PNPM_VERSION=11.1.2
```

首次连接时，Cloudflare 账户持有人必须在浏览器中登录，并手动安装或授权 **Cloudflare Workers and Pages** GitHub App 访问仓库。这是无法由本仓库自动完成的账户操作。项目创建和首次构建成功后，预期地址为 <https://penguin-sama-portfolio.pages.dev>；如果项目名不可用或最终名称发生变化，必须同步更新 README、`public/robots.txt` 与 `public/sitemap.xml` 中的地址。

更详细的发布与上线检查见 [`docs/deployment.md`](docs/deployment.md)。

## 隐私

站点只公开作品内容、`penguinsama8@gmail.com` 与 `github.com/Penguin-SAMA`。不要提交手机号、微信、性别、证件照、原始简历或其他不需要公开的个人信息。
