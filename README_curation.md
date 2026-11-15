# 需求与测试治理

本分支已治理BookStack和StackOverflow的需求与测试：需求保留用户视角、业务规则和自然示例，移除实现/评测协议；测试用公共语义接口及逐用例数据验证行为。两者的数据位于`arc-bench/bookstack/`和`arc-bench/stackoverflow/`。BookStack的评分身份、路径、账号和工具边界集中在[BookStack适配说明](curation_tool/bench-curation/references/bookstack-profile.md)；StackOverflow需按自身需求、测试和配置核实，不套用BookStack约定。

[主skill](curation_tool/bench-curation/SKILL.md)负责一次清点、按问题路由和统一验证；五个子skill分别负责数据、产品交互、元说明、语义适配及断言质量，不要求按历史顺序逐个执行。工具说明见[curation_tool](curation_tool/README.md)。本地进度、审计、例程和成绩存于被Git忽略的`ref/`，不随分支上传，不是流程前提。

默认没有应用例程：先独立审查需求/图例/测试，再用合成DOM或状态模拟检查真实helper正反例。只有用户主动提供或在会话中明确指定例程、源码或URL后，才进入对应应用的迭代回归；不自动查找workspace应用、猜端口或沿用旧服务。

## 使用方式

在仓库根目录启动智能体，直接读取skill，无需全局安装。可发送：

```text
请治理 arc-bench/<project> 的需求和对应测试，仅修改该目标及必要治理工具。
先读 curation_tool/bench-curation/SKILL.md，按问题及依赖选择子skill执行。
检查需求、scenario、测试及helper的对应，保留业务规则、自然示例、精确数据和评分身份。
清理评测协议，复核数据来源和前置对象，构造错误实现反例并逐项约束修复，同时保证合理替代实现通过。
补全有依据的产品交互，保持用户视角并同步相关requirements/scenario，不将helper内部细节变成产品要求。
默认不提供应用例程；先完成独立检查，明确应用级验证缺口。若我后续提供例程，再按授权迭代。
所有状态与报告写入ref/<project>/，不自动新增评分场景、修改生成应用、提交或推送。
```

替换目标前先核实其目录、数据来源、身份数量和工具。现有check_bookstack、扫描词表和state.py均含项目约定；它们不是通用脚本，不能只换路径就用于其他项目，也不能把其他项目结果写入BookStack状态。
