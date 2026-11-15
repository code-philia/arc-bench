# BookStack当前语义适配映射

本文件仅说明当前BookStack实现，不是通用role标准或全部合法界面定义。项目路径和工具见[适配说明](bench-curation/references/bookstack-profile.md)；实现入口为[ui.ts](../arc-bench/bookstack/tests/support/ui.ts)，业务helper为[helpers.ts](../arc-bench/bookstack/tests/helpers.ts)。接口名和能力以当前源码核实，不用历史通过数证明兼容完整。

## 接口与观测

| 业务类别 | 当前接口 | 支持与约束 |
| --- | --- | --- |
| 操作入口 | action、navigationAction | 原生/role按钮链接等、HTML onclick自定义元件及summary；tabindex单独不作动作证据；用途、唯一和结果仍须验证 |
| 对象操作/确认 | bookActions、deletionConfirmation、loginSubmit | 当前对象/凭据关系及确认目标，非某个role或容器层级的强制契约 |
| 集合条目 | collection、item、visibleNames、expectMaxItems | 具名/标题/owner路径，精确身份、重复拒绝、混合记录计数；visibleNames只能从调用方提供的身份中返回可见目标 |
| 文本字段 | textField、editableControl、pageEditor | label/placeholder关联input/textarea/contenteditable，填写/读取/清空/回填成套处理 |
| 复合元数据 | metadata、fillTags、expectMetadata | 整组标签或Tag Name行；行式标签的产品交互仍须遵循书架需求，不为适配任意流程而放宽 |
| 标题/正文 | title、heading、detailContent | 排除已识别集合/行及其他对象子树；detailContent排除导航/侧栏/编辑回显；content仅是精确可见文字接口 |
| 状态 | toggle、favorite | 原生checked或可读自定义状态；收藏按明确Favorite/Unfavorite文案观测，幂等设置，未知状态拒绝 |

评分REQ通过公共语义接口表达业务动作，原始定位留在适配器/复合helper。openWithKeyboard实际触发键盘，仍需随后核对目标详情。字段支持不意味着所有自定义编辑器都支持。

## 有限别名与路径

集合别名当前为Shelf list/Shelves、Book list/Books、Page list/Pages、Chapter list/Chapters；创建书籍为New Book/Create New Book。它们是本项目有依据的有限映射，不是其他项目必须采用的文案。

操作/字段等路径可合并等价候选，同一DOM去重、不同目标保留歧义。部分导航/集合/标题路径仍按代码优先级解析；该机制不能作为跳过已知业务歧义的理由，新增路径需完整正反例。

集合owner约束具名与回退路径及实际条目。当前ownedBy通过可观察标题、交互卡片和记录边界排除其他对象；不能从共同祖先或Actions名称单独推导归属。正文中的复杂子标题、完全匿名卡片等仍需专门验证。

详情卡与具名集合可并列：owner标题位于独立article，Book/Page/Chapter list位于同一内容布局的兄弟section，不要求列表嵌入详情卡。适配器先识别具名/标题集合证据，再排除其他对象子树、侧栏和导航；有main时不越过所属main，无main时使用同时包含owner与集合证据的最小普通内容布局。等价集合路径合并后仍有多个组或重复入口时拒绝，不用优先级或DOM顺序隐藏歧义。未具名集合保留原有局部owner回退，不因兄弟区域存在同名条目就扩大范围。

## 当前支持边界

- 只有React事件、无可观察交互语义的节点，不能因tabindex而自动识别为动作。
- iframe、select/组合框及未覆盖自定义编辑器需按类别扩展，不统一当textbox。
- 收藏仅图标/固定文案状态未由当前Favorite/Unfavorite策略覆盖；未知状态不能吞掉。
- 普通标题文字的回退与owner识别不保证任意布局；不能扩大为整页搜索掩盖失败。
- 准备helper的参数拒绝不等于相关产品能力已实现，具体限制见项目适配说明。

扩展时按主流程：先确定业务标准，再实现路径，使用真实helper验证合理替代和错误实现。默认合成DOM/状态模拟；仅用户提供/指定例程后才进入应用回归。合成检查数量和历史例程成绩保存在本地报告，不写成当前通用保证。
