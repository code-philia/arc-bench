# 治理 skill 与工具

本目录保留以 BookStack 为例的治理方法及复核工具。进度、审计、报告和一次性迁移脚本放在本地 `ref/`，不随分支共享，也不是使用 skill 的前置条件。

## Skill 框架

- [bench-curation](bench-curation/SKILL.md)：主流程，负责范围、状态、验证与收尾。
- [bench-data-curation](bench-data-curation/SKILL.md)：自然示例、数据来源与随机素材。
- [bench-role-curation](bench-role-curation/SKILL.md)：实现协议与语义适配。
- [bench-meta-curation](bench-meta-curation/SKILL.md)：元说明与父子重复。
- [bench-time-curation](bench-time-curation/SKILL.md)：当前时间、相对日期、业务时区与倒计时。
- [bench-ui-curation](bench-ui-curation/SKILL.md)：产品要求与测试便利性约束。
- [bench-quality-curation](bench-quality-curation/SKILL.md)：前提、操作、断言、容量和重复执行质量。

Skill由当前智能体读取执行，不会自动启动子智能体或后台治理。适配范围见[语义接口说明](bookstack_role_mapping.md)，推广到其他应用需重新清点。

## 复核工具

在仓库根目录安装依赖后执行：

```sh
npm run check:bookstack
node curation_tool/check_bookstack_delivery.mjs
node curation_tool/check_bookstack_preparation.mjs
node curation_tool/check_bookstack_role_compatibility.mjs
```

分别检查类型与语义API、结构与skill链接、模拟素材归属、合成DOM适配。素材模拟当前使用Node 24的TS加载能力；合成DOM需要Playwright Chromium。它们不代替真实case业务测试。

`inventory_requirement_data.py bookstack`及`inventory_bookstack_roles.py`可生成初筛清单；命中不等于应删除，未命中仍须人工复核。生成报告统一位于 `ref/<应用>/`。

可选本地状态工具：`python curation_tool/bench-curation/scripts/state.py init`首次建立 `ref/bookstack/governance_reference.json`，之后用 `status`查询。不存在记录时从当前源码开始，不继承他人的验证结论。规则见[状态与产物约定](bench-curation/references/state-and-artifacts.md)。

状态门槛的内存回归：`python curation_tool/bench-curation/scripts/test_state.py`，不读写本地状态。只修改skill或文档时按主skill的验证选择表检查，无需重复运行全部工具。
