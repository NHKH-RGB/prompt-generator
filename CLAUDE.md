# 项目：prompt-generator（提示词生成器）

## 背景

标准（增强明确）提示词生成器：把模糊需求转化为结构化、明确、无歧义的高质量提示词。具体形态（网页 / CLI / 库）、提示词规范、输出格式等细节待后续在项目内逐步明晰。

## 常用命令

- 暂无（细节待定）

## 目录约定

- `vendor/`：AI 或手动下载的项目专属工具（gitignored）
- `.ai-tmp/`：AI 临时产物（gitignored，可随时删）
- 构建产物一律进 `build/`（或本工程约定的输出目录），不入 git
- `docs/`：提示词规范、模板、示例

## AI 协作规范（vibecoding 纪律）

- 下载/编译的工具一律放 `D:\Tool\AI\tools\<工具名>-<版本>\` 并登记到 `D:\Tool\AI\README.md`；禁止装到项目根、C 盘或系统 Temp
- 临时试验放 `D:\Tmp\ai-playground\`；项目内临时产物放 `.ai-tmp\`
- Python 环境用 `.venv\`（gitignored）；包缓存走 `D:\Tool\AI\cache`
- 大文件（>10M）不进 git：放 `_archive\` 或 git-lfs
- 删除/覆盖文件前先说明清单，得到确认再执行
- 提交遵循 conventional commits（feat/fix/docs/chore）

## 备注

- 提示词规范/模板集中放 `docs/`，与代码分离，便于复用与版本化
