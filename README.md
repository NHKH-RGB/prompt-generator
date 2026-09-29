# 提示词生成器 · Prompt Generator

把模糊需求转化为**结构化、明确、无歧义**的高质量提示词，让你能更清晰地向 Agent（Claude Code / Cursor / …）传达需求与设计思路。

Turn vague requirements into structured, unambiguous prompts, so you can communicate your needs and design intent to an Agent clearly.

## 特性 Features

- **三种规范模式**：完整（规格书）/ CO-STAR / 精简（RTFC），一键切换，内容自动保留
- **中英双语**：界面中文，输出标签可切 中文 / English / 双语
- **实时预览**：边填边生成 Markdown 提示词
- **一键复制 / 下载 .md**，自动保存到浏览器本地
- **零依赖、零构建、零安装**：纯 HTML/CSS/JS，双击即用

## 快速开始 Getting Started

- **在线使用**：<https://NHKH-RGB.github.io/prompt-generator/>（GitHub Pages）
- **本地使用**：克隆仓库后，用浏览器打开 `src/index.html` 即可

## 三种模式 Three Modes

| 模式 | 适用场景 | 字段 |
|---|---|---|
| 完整（规格书） | 开发 / 设计任务 | 角色 · 目标 · 背景 · 需求(必须/应该/可选/不做) · 设计思路 · 约束 · 输入 · 期望输出 · 验收标准 · 语气 · 示例 |
| CO-STAR | 文案 / 内容生成 | Context · Objective · Style · Tone · Audience · Response |
| 精简（RTFC） | 简单一次性任务 | 角色 · 任务 · 输出格式 · 约束 |

## 目录结构 Structure

```
prompt-generator/
├── src/                  # 前端（纯 HTML/CSS/JS，无构建）
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .github/workflows/    # GitHub Pages 自动部署
├── docs/                 # 提示词规范、模板、示例（规划中）
└── LICENSE
```

## 开发 Development

无需构建步骤：直接编辑 `src/` 下的文件，浏览器打开 `src/index.html` 预览。

## 路线图 Roadmap

- [ ] 单文件版（内联 CSS/JS，便于发单个 `.html`）
- [ ] Tauri 打包为桌面 EXE
- [ ] 接入 LLM 做内容翻译 / 润色（凭据走环境变量）

## 许可证 License

[MIT](LICENSE)
