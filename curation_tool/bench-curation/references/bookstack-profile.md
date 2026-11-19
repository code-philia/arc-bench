# BookStack项目适配说明

仅当当前目标为BookStack时使用；这是项目约定和工具能力映射，不是通用治理标准，也不包含可默认运行的例程。应用源码、URL和数据库均须由用户提供/指定，不能从workspace或旧记录推定存在。

## 路径和身份

- 需求与图例：`arc-bench/bookstack/requirements/requirements.yaml`及其`reference/`。
- 评分测试：`arc-bench/bookstack/tests/`，当前34项需求、24叶子、24个spec、35项评分场景；修改前重新核对，不拿数量代替身份/引用检查。
- 公共接口：`tests/support/ui.ts`，业务helper为`tests/helpers.ts`，数据为`tests/fixtures/data.ts`。当前REQ不直接暴露Locator读写。
- 进度、审计和报告：`ref/bookstack/`，可选状态为其中`governance_reference.json`的`workflow_state`。缺少本地记录不影响治理。
- 已清理交付内容不应重新加入评测隔离标记或重放一次性迁移；历史数量和测试成绩只放本地记录。

## 当前业务约定及实现边界

- 预置Admin：`admin@example.com / password`；没有账号创建验收，不能随机造账号。业务对象逐test生成并经UI创建。
- 最近访问上限10、首页收藏上限4、最近更新上限5；属于需求规则，不能照搬到其他目标。
- 业务动作命名：导航使用Login，凭据提交使用Sign in；书架及书籍详情删除入口均为Delete，草稿为Delete Draft。确认使用Confirm并识别具体对象。此为当前明确文案，不以旧Login提交作别名；仅导航/提交的既有命名差异仍保留，归属和结果检查仍保留。
- 收藏动作使用Favourite，取消收藏仍为Unfavorite（图例未展示反向状态）；首页标题使用My Most Viewed Favourites。shelves.png实际为单个书架详情，仅用于详情场景，不作为全局书架列表图例。
- 书架允许从列表创建。行式书架标签允许现有行为空时先添加多行再填写，统一随Save Shelf保存；这是已明确的产品交互，不自动推广到书籍或其他项目，也不把helper支持的整组输入改为禁止。
- 页面编辑标签按用途识别；未规定的界面文案可忽略大小写完整匹配，明确文案及用户值仍精确。BookStack已有有限别名New Book/Create New Book、集合名称等，见[当前接口映射](../../bookstack_role_mapping.md)，不是通用别名词典。
- 当前createPage明确拒绝chapterName，未实现章节页面准备；跨用户/跨类型等覆盖不能由现有评分通过推导。支持边界以当前源码及反例为准，不继承旧“已完成”结论。
- owner详情卡与具名列表可为兄弟区域，集合无需嵌套在详情article；兼容范围及外部main、侧栏、错误对象、重复集合的拒绝边界见[当前接口映射](../../bookstack_role_mapping.md)。无集合证据时不扩大原局部回退。
- 具名集合可包含自己的页面语义标题，不能与记录内部标题混同；空白/隐藏装饰span不独立证明其他owner。通用判定见role的[集合身份与查询成本](../../bench-role-curation/references/collection-identity-and-query-cost.md)，不要求应用搬移标题或删除装饰。
- REQ-6.1的首页My Recent Drafts观察为草稿出现一次，重开编辑器从父书籍Page list完成。不能由当前item接口的动作型计数反推首页必须可打开；这是观察契约与实现支持需分开核实的边界，不因本说明更新便声称评分已兼容静态记录。

## 专用工具：不能直接当作通用脚本

下列命令在仓库根目录执行。它们不要求应用例程；仅按主流程的改动影响选择，不是每次全部必跑。

| 命令 | 能证明什么 | 不能证明什么 |
| --- | --- | --- |
| `npm run check:bookstack`（Windows可用npm.cmd） | 类型及评分REQ语义API约束 | 应用业务行为 |
| `node curation_tool/check_bookstack_delivery.mjs` | YAML、当前身份数量、引用、零标记、skill链接 | 业务等价或应用通过；可选旧文件参数只适合隔离文字清理比较 |
| `node curation_tool/check_bookstack_preparation.mjs` | 模拟当前REQ的数据归属/父关系 | 实际UI准备或权限/持久化 |
| `node curation_tool/check_bookstack_role_compatibility.mjs` | 真实helper上的合成DOM正反例 | 任意DOM或应用全量；需本仓库Playwright及Chromium |
| `python curation_tool/inventory_requirement_data.py bookstack` | 缩进/词表初筛 | YAML语义解析或删除决定 |
| `python curation_tool/inventory_bookstack_roles.py` | BookStack role候选初筛 | 完整调用迁移或语义结论 |

素材模拟使用当前Node环境的TS加载能力。工具内含路径、词表、数量和账号等项目约定；其他项目需适配，不能简单换名称后假定可用。

状态工具也是BookStack专用：`python curation_tool/bench-curation/scripts/state.py status`只读，首次无状态才`init`，不得覆盖已有状态。其他命令语义见[状态说明](state-and-artifacts.md)。状态内存回归为`python curation_tool/bench-curation/scripts/test_state.py`，不读写本地进度；仅改文档不必运行它。

实际治理时用`record`维护条目（phase、id、requirements、status、note），verified用`--check "类别:实际命令与范围"`登记证据；用`phase`维护职责状态。源漂移先`invalidate`受影响条目，再按复核结果`checkpoint`，不能替旧verified刷新指纹。具体参数查对应子命令的`--help`，不照抄示例ID或执行无必要的初始化。data/meta完成还检查需求源中的隔离括号及已有非零标记归属摘要，不能只把汇总数字改为零。

## 仅用户提供例程后的应用入口

用户提供BookStack应用/URL且当前任务包含回归时，可使用`node run-tests.cjs ./arc-bench/bookstack/tests <用户提供并已核实的URL> ...`。不预设端口、构建产物或启动参数；源码路径已给出也须先核实项目启动方式。不得因这里有命令便寻找workspace应用或修改生成应用。

本文件不保存例程运行成绩、应用缺陷历史或可默认复用的服务信息。
