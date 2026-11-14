---
name: bench-curation
description: 统筹本仓库BookStack需求与测试治理，维护逐项状态，按任务调用数据、role、元说明与重复、UI约束及测试质量子skill，并完成验证与产物收尾。当前不治理其他数据集。
---

共享说明：先读根目录`README_curation.md`和当前BookStack需求、tests；本skill保留可复用方法。所有进度、审计、状态及临时报告写入被Git忽略的`ref/`，它们不是使用skill的前置条件。不存在本地记录时，从当前源码重新清点，勿假定继承历史验证。

# BookStack治理主流程

## 范围与路由

只修改`arc-bench/bookstack`的需求和测试，以及对应治理工具、参考表、进度文档。用户本轮只要求规划/检查skill时，只维护skill，不触发实际治理。不要把调用子skill理解为启动子智能体或另一个自动进程：由当前智能体读取对应SKILL.md并执行，然后返回主流程更新状态。

| 当前授权任务 | 调用子skill | 状态键 |
| --- | --- | --- |
| 数据协议、自然示例、素材准备 | [bench-data-curation](../bench-data-curation/SKILL.md) | data |
| role/ARIA实现协议、语义元件适配 | [bench-role-curation](../bench-role-curation/SKILL.md) | role |
| 评测元说明、历史编辑说明、父子重复规则 | [bench-meta-curation](../bench-meta-curation/SKILL.md) | meta |
| 日期与时钟、同步审查需求和测试 | [bench-time-curation](../bench-time-curation/SKILL.md) | 沿用受影响阶段 |
| 过度精确的UI名称、提示语和结构约束 | [bench-ui-curation](../bench-ui-curation/SKILL.md) | ui |
| 测试数据与断言质量复查 | [bench-quality-curation](../bench-quality-curation/SKILL.md) | quality |

## 交付基线与清理规则

BookStack历史59处数据协议与10处元说明共69处隔离内容已按用户授权全部移除，当前需求中为0处。具体名称、示例、业务条件和断言保留。不要重放旧脚本或恢复旧标记；这一历史基线不代表新一轮已经验证。

治理采用“清点→需求与测试同步改造→按影响验证→最终清理交付”。暂存是测试尚未衔接时的可选过渡，不是每次必经步骤。已经能够安全同步修改时，直接将评测协议移出需求，在ref/保留必要依据。

最终清理包含删除括号及其中协议文字，修正文句、空白和标点，解析YAML并核对ID、引用、业务含义及测试预期。未规定事项转入本地治理参考，不因删除说明增加新业务承诺。若存在未完成前提或尚需保留的标记，明确列为过渡稿，不宣称最终交付。当前授权已包含清理时直接完成，无需再次询问。

## 状态管理与断点恢复

持久状态放在本地`ref/bookstack/governance_reference.json`的`workflow_state`中，不另建一堆进度JSON。结构、状态定义和完成条件见[references/state-and-artifacts.md](references/state-and-artifacts.md)。使用本skill的[scripts/state.py](scripts/state.py)维护状态，例如在仓库根目录执行：

```powershell
# 无本地状态时才显式初始化；已有状态不可覆盖
python curation_tool/bench-curation/scripts/state.py init
python curation_tool/bench-curation/scripts/state.py status
python curation_tool/bench-curation/scripts/state.py phase --phase role --status active --note "此处说明本轮实际授权范围"
python curation_tool/bench-curation/scripts/state.py record --phase role --id ROLE-EXAMPLE --status reviewed --requirements REQ-6.1 --note "此处填写实际复核结论"
```

示例不是待执行任务。只有确实开始治理时才新增真实条目。条目用需求/场景/步骤ID、字段及问题语义定位，行号仅供参考；不同阶段可关联同一问题。保留、修改、延期均须有中文理由。工具只维护状态与源指纹，不代替语义分类、代码修改或测试。

验证状态通过`record ... --status verified --check "types:实际命令及检查范围"`登记；可重复--check记录多类已通过的检查。命令和范围必须来自本次实际结果，不能复制示例伪造。暂结阶段先在当前授权下用phase命令明确重开；不自动解锁。首次缺少workflow_state时用init初始化，已有状态不覆盖。

继续任务时先查未完成/受阻条目和源指纹。源变化后重新核实对应条目；使用`invalidate`把受影响项退回reviewed或blocked，再checkpoint记录已复核的新基线，不沿用旧verified。checkpoint会拒绝存在未经失效处理的旧verified条目。用户明确的暂结状态保留，只有当前指令授权返工时才重新进入。

## 执行闭环

1. **选定范围**：明确本轮data、role、meta、ui或quality、需求范围及允许改动，恢复既有状态。批次优先按共享规则/helper及其REQ依赖组织，避免把同一公共问题机械拆成多次修改。
2. **清点分类**：调用子skill，扫描并语义复核全部目标文本/调用；生成临时inventory和独立review。每个决定建立条目，包含对应ID、理由、预期修改和测试关联；不能只处理关键词命中项。
3. **逐项实施**：先保存必要旧信息，再改需求、公共适配和相关REQ。每完成一个实际里程碑更新条目状态；不以“脚本跑完”代替测试迁移完成。保留自然业务规则、对象归属和断言强度。
4. **按影响验证**：依下表选择检查。共用helper按其依赖REQ组织一次修改与验证，不因多个子skill重复运行同一套检查。记录实际命令、范围、结果及未验证项，不能把模拟通过写成端到端通过。
5. **失败收敛**：区分测试适配、case功能、环境和后置任务。修正本轮范围内的适配错误并重测。未授权的case变更记录问题和证据；没有新增授权时不改case。剩余失败保持blocked/deferred，继续其他独立条目。
6. **清理与交付**：按上文完成隔离内容最终清理，将决定、失败分组及检查范围汇总到ref/中的状态或进度记录。共享文档只保留可复用方法与必要结论；不要求每个阶段新建一套报告。仅在该阶段范围内满足完成条件时登记complete；交付可评审版本与业务全通过分别报告。
7. **清理临时产物**：按reference中的白名单删除本轮已汇总的扫描、patch日志、run JSON、截图/trace/HTML。不要删除未解决问题的唯一证据，先将最小证据写入条目或长期参考表。不重新执行检查而留下刚生成的报告。最后检查JSON可读、链接有效、状态一致及`git diff --check`。

状态推进不需要逐条向用户询问；必要的缺失事实和实际权限按当前会话处理。不能把skill当作无人值守调度器：每次被调用后由智能体持续处理当前授权范围，直到完成或明确记录不可继续的条件。

## 验证选择

| 本轮改动 | 检查范围 |
| --- | --- |
| 仅skill、路径或文档 | skill元信息、相对链接、受改工具的实际行为及git diff --check；不启动case。 |
| 仅说明清理/父子去重，业务不变 | 实际解析YAML，比较ID、引用、场景及清理前后业务含义；说明测试为何无需改动。 |
| fixture、REQ或helper | 类型/语义API、实际数据归属；动作、字段、范围、状态有变时补合理替代和错误实现的适配正反例。 |
| 操作、前提、预期或共享状态有变 | 在当前授权及可用服务下运行关联REQ；共享接口广泛变化才扩大回归，共享账号问题按需同库重复。 |

BookStack工具入口见[curation_tool说明](../README.md)。`check_bookstack_delivery.mjs`检查当前结构、零标记和共享文件链接；它不证明业务语义等价、真实case通过或任意DOM兼容。所有报告写入ref/；无应用时先完成独立检查并明确业务验证缺口。
