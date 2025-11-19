# Crypto Checkout Demo

一个基于 Wagmi 的简单 DApp 演示项目，适用于在 DApp 内部浏览器运行。

## 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

## 运行开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

## 构建

```bash
npm run build
```

## 部署

### 方法一：Vercel（推荐，最简单）

1. **安装 Vercel CLI**（可选，也可以直接通过网页部署）
   ```bash
   npm i -g vercel
   ```

2. **部署**
   ```bash
   vercel
   ```
   或者直接访问 [vercel.com](https://vercel.com)，导入 GitHub 仓库自动部署

3. **通过网页部署**（推荐）
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "Add New Project"
   - 导入你的 GitHub 仓库
   - Vercel 会自动检测 Vite 项目并配置
   - 点击 "Deploy" 即可

### 方法二：Netlify

1. **安装 Netlify CLI**（可选）
   ```bash
   npm i -g netlify-cli
   ```

2. **部署**
   ```bash
   netlify deploy --prod
   ```
   或者直接访问 [netlify.com](https://netlify.com)，拖拽 `dist` 文件夹到网页上

3. **通过网页部署**（推荐）
   - 访问 [netlify.com](https://netlify.com)
   - 使用 GitHub 账号登录
   - 点击 "Add new site" -> "Import an existing project"
   - 选择你的 GitHub 仓库
   - 构建命令：`npm run build`
   - 发布目录：`dist`
   - 点击 "Deploy site"

### 方法三：GitHub Pages

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **在 package.json 中添加脚本**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

4. **在 GitHub 仓库设置中启用 GitHub Pages**
   - Settings -> Pages
   - Source 选择 `gh-pages` 分支

### 方法四：Cloudflare Pages

1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 使用 GitHub 账号登录
3. 选择你的仓库
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 点击 "Save and Deploy"

## 技术栈

- React 18
- Wagmi (Ethereum React Hooks)
- Viem (Ethereum TypeScript 接口)
- TanStack Query (异步状态管理)
- Vite (构建工具)
- TypeScript

