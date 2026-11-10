---
name: bench-role-curation
description: 治理本仓库BookStack需求中的role和ARIA实现协议，同步以语义元件接口适配测试的定位、读写、操作和状态检查。由bench-curation主skill管理进度，当前不处理其他数据集。
---

共享说明：先读根目录`README_curation.md`和当前BookStack需求、tests；本skill保留可复用方法。所有进度、审计、状态及临时报告写入被Git忽略的`ref/`，它们不是使用skill的前置条件。不存在本地记录时，从当前源码重新清点，勿假定继承历史验证。主流程见[bench-curation](../bench-curation/SKILL.md)。

# BookStack role治理

## 入口与边界

现有97处注解已移除，24个REQ/35个test已迁移；不要重复套用旧改写脚本。已有分类覆盖5类role不表示所有布局、交互及业务分支已覆盖。历史59处数据标记及10处元说明已按授权清理，当前0处；不重放旧迁移。

## 清点与语义分类

检查需求全部文本及tests/helpers/support中定位、读取、填写、操作和状态断言。清理`role=*`、特定ARIA属性及pressed=true/false等强制实现协议，保留自然“按钮/链接/标题/列表”表达、键盘可操作性和真实业务结果。ARIA可以作为测试可选观测证据，不能变成需求要求。

每项记录需求/场景/步骤ID、字段、原文、role/元素、业务语义、对应REQ和helper、处理决定及理由。临时扫描保存为ref/bookstack/role_inventory.json，语义复核另存或合并更新长期role_coverage_audit.json；当前已有覆盖表是历史来源，不能被新扫描覆盖。inventory_bookstack_roles.py当前针对BookStack，覆盖前先保留人工决定；历史一次性迁移脚本不作为共享流程的前置。

按操作、导航、集合/条目、文本字段/标签、标题/正文、开关/收藏分类。区分“原role有映射”“每个真实调用已接入”“正反例验证完成”，不能只统计role名称。

## 需求与测试同步改造

需求改写为可观察行为。测试统一使用`tests/support/ui.ts`的语义接口，由helpers导出：

| 类别 | 接口 | 应检查的完整能力 |
| --- | --- | --- |
| 操作/导航 | action、navigationAction | activate/open、可见、唯一、操作后业务结果 |
| 集合/条目 | collection、item | 按名称与owner查找、出现次数、缺失、打开、数据归属 |
| 字段/标签 | textField、editableControl、metadata | fill、read、expectValue、清空；原生与contenteditable一致 |
| 标题/正文 | title、content、heading、text | 精确可见内容、避免导航或其他对象误命中 |
| 状态 | toggle、favorite | read、幂等set、expectState及刷新后结果 |

不要让REQ拿到Locator后自行inputValue/click。复合helper内部可构造定位器，但读写操作经适配器。新增实现先识别控件类型再选择操作；不同role不是无条件可互换。静态文字不当可打开条目，tabindex不证明业务动作有效，不以first消歧，不把未知状态当false。

已有三项易漏问题已修复，继续修改时保持：createPage也使用textField而非只改断言；标签contenteditable填写与读取成对支持；集合别名同时用于role、标签和标题分支，无标签章节查询传入书籍owner。别名和文案适配须有业务依据，不使用任意模糊匹配。无语义React点击、iframe编辑器、纯图标状态仍按映射规范记录限制，不宣称普适兼容。

## 验证与返回

按主skill的验证选择表执行受影响检查，以下为可选命令，不要求每次全部运行：

```powershell
npm run check:bookstack
node curation_tool/check_bookstack_role_compatibility.mjs
node curation_tool/check_bookstack_preparation.mjs
```

适配脚本使用bench根目录Playwright，先核实依赖与Chromium可用性；素材模拟不需要运行case。缺少条件时如实记录，不伪报通过。数据归属检查是模拟，不是UI回归。

新增适配覆盖完整操作链及反例：每种字段写/读/清空、集合别名与owner、重复目标、静态条目、未知状态、原生/自定义开关、收藏幂等及持久化。沿用真实helpers做代表性合成DOM验证，防止底层支持但实际准备仍绕过接口。

有实际可用case URL时使用`node run-tests.cjs ./arc-bench/bookstack/tests <已核实URL> ...`跑关联REQ，必要时全量。不要假定上轮服务或3107端口仍存活。定位失败先核实DOM/数据/操作，再区分适配缺口与case缺陷；不自动修改case源码或放宽断言。保留35个test及ID，增减评分场景须有当前用户指令。

将每项需求改写、实际调用迁移、检查范围和剩余问题返回主skill；将覆盖决定写入ref/；仅把可复用规则更新到映射规范。通过相应检查的条目登记verified，业务仍失败的关联条目保持blocked或交给明确后置任务。最终产物汇总、状态完成判定及临时文件清理由主skill统一执行。
