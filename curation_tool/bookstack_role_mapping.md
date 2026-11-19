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
| 标题/正文 | title、heading、detailContent | 排除记录内部标题及其他对象子树，允许具名集合自身的页面标题；detailContent排除导航/侧栏/编辑回显；content仅是精确可见文字接口 |
| 状态 | toggle、favorite | 原生checked或可读自定义状态；收藏按明确Favourite/Unfavorite文案观测，幂等设置，未知状态拒绝 |

评分REQ通过公共语义接口表达业务动作，原始定位留在适配器/复合helper。openWithKeyboard实际触发键盘，仍需随后核对目标详情。字段支持不意味着所有自定义编辑器都支持。

## 有限别名与路径

集合别名当前为Shelf list/Shelves、Book list/Books、Page list/Pages、Chapter list/Chapters；创建书籍为New Book/Create New Book。它们是本项目有依据的有限映射，不是其他项目必须采用的文案。

操作/字段等路径可合并等价候选，同一DOM去重、不同目标保留歧义。部分导航/集合/标题路径仍按代码优先级解析；该机制不能作为跳过已知业务歧义的理由，新增路径需完整正反例。

集合owner约束具名与回退路径及实际条目。当前ownedBy通过可观察标题、交互卡片和记录边界排除其他对象；不能从共同祖先或Actions名称单独推导归属。正文中的复杂子标题、完全匿名卡片等仍需专门验证。

详情卡与具名集合可并列：owner标题位于独立article，Book/Page/Chapter list位于同一内容布局的兄弟section，不要求列表嵌入详情卡。适配器先识别具名/标题集合证据，再排除其他对象子树、侧栏和导航；有main时不越过所属main，无main时使用同时包含owner与集合证据的最小普通内容布局。等价集合路径合并后仍有多个组或重复入口时拒绝，不用优先级或DOM顺序隐藏歧义。未具名集合保留原有局部owner回退，不因兄弟区域存在同名条目就扩大范围。

## 当前支持边界

- 只有React事件、无可观察交互语义的节点，不能因tabindex而自动识别为动作。
- iframe、select/组合框及未覆盖自定义编辑器需按类别扩展，不统一当textbox。
- 收藏仅图标/固定文案状态未由当前Favourite/Unfavorite策略覆盖；未知状态不能吞掉。
- 普通标题文字的回退与owner识别不保证任意布局；不能扩大为整页搜索掩盖失败。
- 准备helper的参数拒绝不等于相关产品能力已实现，具体限制见项目适配说明。

扩展时按主流程：先确定业务标准，再实现路径，使用真实helper验证合理替代和错误实现。默认合成DOM/状态模拟；仅用户提供/指定例程后才进入应用回归。合成检查数量和历史例程成绩保存在本地报告，不写成当前通用保证。


## 集合自身标题与装饰性条目节点

Shelf/Book/Page/Chapter集合卡片可以包含自身的页面标题（例如Shelf list卡片内的Shelves），不要求标题位于具名容器外。此路径仅接受语义标题，仍排除li/tr、打开控件及嵌套article/section记录中的标题；重复页面标题保持拒绝，不扩大普通文本回退。

普通span只有可见且非空、未标为隐藏/装饰时才用作外部对象caption证据。空白节点、隐藏色条和明确装饰不提供业务身份；可见的其他对象caption仍须阻止跨owner操作，条目入口的身份与重复检查保持。


## 集合范围推断的计算复用

有owner且无main时，先查询最近内容边界内的最小所属具名集合；恰好一个时直接使用该集合。此边界本来就在owner祖先链上，局部唯一集合不会因继续推断更大布局而改变身份。零个或多个时仍执行完整兄弟集合/最小布局推断，不按DOM顺序选择。先折叠等价嵌套集合，再与所属布局取交集，避免在hasNot中重复嵌入整个布局定位器。每次调用重新解析live locator，不缓存DOM节点或首次唯一结果；重新渲染、增加重复入口或切换owner后仍重新检查。所属main硬边界、错误对象caption、侧栏和重名拒绝保持。


动作组也采用先识别动作、再与作用域后代取交集的组合顺序；不把整段容器定位器复制进每个role分支。书籍Actions与删除确认保留相同的owner、确认正文、控件身份和唯一性要求。候选首次唯一后在同一轮轮询再次确认；临时节点变化时重新按原优先级选择，重复候选仍阻止回退，不把已失效的候选留给长时间等待。此确认不构造持久的多路径组合，也不缓存DOM节点。
