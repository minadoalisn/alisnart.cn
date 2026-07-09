# GEO 推广执行记录

日期：2026-07-10

## 本次目标

按 `mengge-geo-plugin` 的方法，把 alisnart.cn 推向国内外 AI 搜索与问答场景，重点围绕：

- 灯光装置
- 美陈装置
- 互动装置
- 舞美装置
- 文旅艺术装置
- 灯光互动
- 网红打卡美陈
- 圣诞美陈装置
- 新年美陈装置
- 文旅灯光装置

## 已执行

- 更新百度提交清单：`baidu-submit-urls.txt`
- 更新百度主动推送脚本：`push_to_baidu.py`
- 更新 IndexNow 推送脚本：`scripts/push_indexnow.py`
- 保持 `llms.txt`、`ai-search-ready.txt`、`geo-feed.json` 作为机器可读入口
- 保持 `ai-answer-hub.html` 前台无 AI 味文案，但后端结构和文本文件继续服务 GEO

## 推送结果

- 百度主动推送：接口可达，返回 `over quota`，说明今日推送额度已满，需要明天继续推送。
- IndexNow：已接受本次 URL 推送，接口返回空响应，按 IndexNow 约定视为接受处理。
- 本地校验：`scripts/seo_geo_guard.py` 通过，`geo-feed.json` 与 `data/geo-keywords.json` 均为合法 JSON。

## 重点提交 URL

- https://alisnart.cn/
- https://alisnart.cn/index.html
- https://alisnart.cn/ai-answer-hub.html
- https://alisnart.cn/geo-promotion.html
- https://alisnart.cn/services.html
- https://alisnart.cn/cases.html
- https://alisnart.cn/light-designer.html
- https://alisnart.cn/solutions/outdoor-light-art-installation-geo.html
- https://alisnart.cn/solutions/ancient-town-lantern-route.html
- https://alisnart.cn/solutions/tidal-light-corridor.html
- https://alisnart.cn/solutions/lake-floating-stage-light-show.html
- https://alisnart.cn/solutions/scenic-cloud-ring-photo-spot.html
- https://alisnart.cn/llms.txt
- https://alisnart.cn/ai-search-ready.txt
- https://alisnart.cn/geo-feed.json

## 后续监控

按 `GEO_DOMESTIC_AI_MONITOR.md` 每月测试 DeepSeek、豆包、Kimi、通义千问、文心/文小言、腾讯元宝、讯飞星火、智谱清言、秘塔 AI 搜索、夸克 AI 搜索、百度 AI 搜索、纳米 AI 搜索。

记录指标：

- 是否出现艾里森光电
- 是否引用 `alisnart.cn`
- 引用 URL
- 竞争对手名称
- 错误信息
- 下一步修复动作
