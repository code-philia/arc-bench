# 治理方法与项目工具

方法入口为[bench-curation](bench-curation/SKILL.md)，负责范围、顺序、一次清点、状态、验证和收尾。由当前智能体按依赖读取子skill，不自动启动代理或后台治理：

- [data](bench-data-curation/SKILL.md)：来源、示例、逐test输入及准备契约。
- [ui](bench-ui-curation/SKILL.md)：产品标准、可兼容差异、一般性需求和scenario同步。
- [meta](bench-meta-curation/SKILL.md)：评测语言与父子重复整理。
- [role](bench-role-curation/SKILL.md)：实际语义接口和定位/读写/状态适配。
- [quality](bench-quality-curation/SKILL.md)：结果闭合、错误实现误接受与覆盖缺口。

默认仅依赖目标需求、图例和测试，以合成DOM/状态模拟验证；用户提供/指定例程后才进入应用迭代。方法不依赖workspace应用、旧URL、历史报告或本地状态。

## 项目工具边界

方法包本身可独立检查：`node curation_tool/check_curation_skills.mjs`。它检查六个skill元信息及包含参考文档在内的本地链接，不读取BookStack需求、测试数据或应用，也不执行网页回归。

仓库已治理BookStack和StackOverflow的需求与测试。本目录的项目专用检查工具仍针对BookStack；通用skill检查入口为`node curation_tool/check_curation_skills.mjs`。BookStack命令、依赖、账号/容量等项目约定及各类证据边界唯一维护在[项目适配说明](bench-curation/references/bookstack-profile.md)。[当前接口映射](bookstack_role_mapping.md)说明BookStack已有实现，不是通用HTML/ARIA标准，也不保证任意布局兼容。

其他项目应重新映射工具和当前源码，不能直接用BookStack固定数量、词表或状态路径。需要时改造工具并验证其行为，不把文档泛化当作脚本已经通用。

## 本地记录

进度、决定、临时报告和一次性迁移脚本在`ref/<目标>/`，不随分支共享。状态和临时产物规范见[状态说明](bench-curation/references/state-and-artifacts.md)；没有本地历史就从当前源码复核。

验证按主流程的改动影响表选择，只改skill不重跑应用或全部测试。运行成绩不能固化进共享skill，结构/类型/模拟/合成与应用回归分别报告。
