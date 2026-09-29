# 项目：prompt-generator（提示词生成器）

## 背景

标准（增强明确）提示词生成器：把模糊需求转化为结构化、明确、无歧义的高质量提示词，向 Agent（Claude Code / Cursor 等）更清晰地传达需求与设计思路。

## 形态与规范（已定）

- **形态**：Web 前端（`src/`，纯 HTML/CSS/JS，无构建）+ Tauri 桌面 EXE（`src-tauri/`）
- **提示词规范**：完整结构化（角色/目标/背景/需求 MoSCoW/设计思路/约束/输入/期望输出/验收标准/语气/示例）+ 内置 CO-STAR、RTFC 两种简化模式
- **输出**：中英双语（标签可切 中文 / English / 双语，内容原样输出，不自动翻译）
- **开源**：<https://github.com/NHKH-RGB/prompt-generator>（MIT），在线版 <https://nhkh-rgb.github.io/prompt-generator/>

## 常用命令

- **本地预览**：浏览器打开 `src/index.html`（无需工具链）
- **桌面打包**（需 Rust + MSVC，见「工具链」）：
  ```bash
  cd src-tauri
  cargo tauri build    # 产出 src-tauri/target/release/bundle/ 下的安装包（NSIS .exe / MSI）
  cargo tauri dev      # 开发调试
  ```
  > cargo 依赖用户环境变量 `RUSTUP_HOME=D:\Tool\AI\tools\rustup`、`CARGO_HOME=D:\Tool\AI\tools\cargo`（已写入）；拉 crates.io 需代理或镜像

## 目录约定

- `src/`：Web 前端（HTML/CSS/JS，无构建；Tauri 的 `frontendDist` 直读）
- `src-tauri/`：Tauri 后端（Rust）
- `vendor/`：AI 或手动下载的项目专属工具（gitignored）
- `.ai-tmp/`：AI 临时产物（gitignored，可随时删）
- 构建产物进 `src-tauri/target/`（gitignored），不入 git
- `docs/`：提示词规范、模板、示例

## 工具链（本机）

- **Rust**：`D:\Tool\AI\tools\rustup` + `D:\Tool\AI\tools\cargo`（rustup 管理版本，已登记）
- **MSVC Build Tools 2022**：C 盘系统级（唯一破例，Windows SDK 只能装 C 盘）
- **Node**：暂未装（静态前端不需要）

## AI 协作规范（vibecoding 纪律）

- 下载/编译的工具一律放 `D:\Tool\AI\tools\<工具名>-<版本>\` 并登记到 `D:\Tool\AI\README.md`；禁止装到项目根、C 盘或系统 Temp
- 临时试验放 `D:\Tmp\ai-playground\`；项目内临时产物放 `.ai-tmp\`
- Python 环境用 `.venv\`（gitignored）；包缓存走 `D:\Tool\AI\cache`
- 大文件（>10M）不进 git：放 `_archive\` 或 git-lfs
- 删除/覆盖文件前先说明清单，得到确认再执行
- 提交遵循 conventional commits（feat/fix/docs/chore）

## 备注

- 提示词规范/模板集中放 `docs/`，与代码分离，便于复用与版本化
