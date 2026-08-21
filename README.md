# 个人健身档案｜腾讯云 EdgeOne Pages 版

本版本已移除原 OpenAI Sites / Cloudflare 专用运行环境，改为标准 Next.js 静态导出项目。

## 腾讯云 EdgeOne Pages 部署参数

创建项目并上传此项目源码后，使用：

- 框架：Next.js（如果有自动识别，直接使用自动识别）
- 安装命令：`npm install`
- 构建命令：`npm run build`
- 输出目录：`out`
- Node.js 版本：20.9 或更高（推荐 Node.js 22）
- 根目录：项目根目录

不需要配置 Cloudflare、Wrangler、D1、R2 或环境变量。

## 本地开发

```bash
npm install
npm run dev
```

## 静态构建

```bash
npm install
npm run build
```

构建完成后，静态网站会生成在 `out/` 目录。
