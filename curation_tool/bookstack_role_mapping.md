# BookStack语义元件与role适配规范

本文记录当前实现及其边界，供后续数据集治理参考。实现入口为[ui.ts](../arc-bench/bookstack/tests/support/ui.ts)，验证脚本为[check_bookstack_role_compatibility.mjs](check_bookstack_role_compatibility.mjs)。这是一份业务定位适配表，不是HTML/ARIA标准的完整映射表。

## 分类原则

先从需求确定元件的业务用途，再选择定位及结果检查方式。role是可选的识别证据；不同role并不天然等价，只有在同一业务操作中能产生所需结果时才能作为替代实现。

自然语言中的“按钮”“列表”“标题”等表达可以保留；删除的是要求实现必须具有某个role或ARIA属性的协议。键盘操作要求、数据归属和持久化要求继续保留。

## 当前映射

REQ只使用语义接口，不直接接触Locator。底层role/元素查找仍封装在ui.ts中，标签行等复合控件可在helper内部使用定位器构建适配器。

| 业务语义 | 对外接口与能力 | 底层适配 |
| --- | --- | --- |
| 操作入口 | `action`：activate、open、expectVisible、expectCount、expectAbsent | button/link/menuitem/tab及具备onclick/tabindex的自定义元素、summary |
| 公共导航 | `navigationAction`：同操作入口 | navigation/banner/header优先，其次唯一页面入口 |
| 集合及条目 | `collection`：expectVisible；item(name)：open、activate、expectVisible、expectCount、expectAbsent | 命名region/list/group/table/complementary、标签/标题容器、明确owner上下文 |
| 文本字段 | `textField`：fill、read、expectValue、expectVisible | label或placeholder关联的input/textarea/contenteditable；读取按实现区分 |
| 标签复合编辑器 | `metadata`、`fillTags`、`expectMetadata` | CSV或Tag Name行；行通过editableControl统一读写，支持contenteditable |
| 标题 | `title`：expectVisible；heading为业务便捷函数 | heading及排除导航/操作元素后的标题文字 |
| 可见正文 | `content`：expectVisible、expectCount、expectAbsent；text为业务便捷函数 | 精确可见文字 |
| 二态选择 | `toggle`：read、set、expectState、expectVisible | 原生checkbox/radio、checkbox/switch角色、带可读取状态的操作元件 |
| 收藏 | `favorite`：read、set、expectState | Favorite/Unfavorite入口及其互斥状态；set支持幂等调用 |

原生radio可被当前代码识别，但是否满足二态选择需求仍由具体REQ的行为约束判断。操作候选能被定位也不证明业务成功，REQ继续检查保存、打开、持久化等结果。接口不暴露inputValue或click，防止调用方绕过适配。

## 解析策略

1. 调用方先确定业务范围和目标名称，尽量使用本用例创建对象的随机身份。
2. 操作入口、字段采用候选并集；多个候选同时命中不同元素时，由严格定位检查报错。内部文字节点不应与所属语义控件重复计数。
3. 导航、集合、标题及开关按代码中的优先级尝试候选。当前优先级中出现多个匹配时等待消歧，不跳过该层去选择后续候选。
4. 所有目标须可见，不以`.first()`或DOM顺序解决业务歧义。保留定位器的自动等待，避免跨渲染快照取元素。
5. 定位成功后检查交互结果。能匹配到tab或带tabindex的元素，只证明它是候选，不能证明它已实现保存、导航等行为。

### 集合的具体顺序

命名region → 其他命名集合role → 显式aria-label容器 → 标题所属有限容器 → 调用方提供的对象上下文。最后一项用于有明确owner的Book list、Page list和Chapter list。

任务5后已有集合别名：`Shelf list / Shelves`、`Book list / Books`、`Chapter list / Chapters`、`Page list / Pages`。`New Book / Create New Book`依据参考图统一兼容；两个真实操作同时出现仍报歧义，不使用任意模糊文字匹配。集合标题排除导航和面包屑。owner约束全部命名及回退分支，支持书架内未命名书籍列表；REQ-5.2/5.6传入书架owner。

### 状态的读取顺序

- 原生checkbox/radio读取真实checked状态。
- 自定义控件依次读取aria-checked、aria-pressed、data-state；识别true/false、checked/unchecked、on/off。
- 均不可读取时明确失败，不默认未选中。需求不要求这些属性，测试可以将其作为可选观测渠道。
- 收藏当前通过Favorite/Unfavorite文字观测状态。这仍依赖产品文案，尚不覆盖仅用图标或固定名称表达收藏状态的实现。

## 当前边界与待改进项

当前实现已接入页面准备、标签读写及集合owner约束；新增控件仍需检查完整操作链。

| 情况 | 当前处理 | 后续方向 |
| --- | --- | --- |
| React自定义div只有onClick，没有role/tabindex/HTML onclick属性 | entry通常无法识别 | 增加真实DOM变体验证后再设计候选，避免把所有静态文字都当作操作入口 |
| tabindex存在但元素没有对应操作行为 | 可能进入候选，业务结果应失败 | 不把可聚焦等同于可操作 |
| 标题只是普通文字 | 可使用文字回退，但结构排除仍有限 | 补充控件内部文字、重复标题等反例，避免误选 |
| 标题容器结构与当前section/div规则差异较大 | 可能定位失败 | 按业务归属补充有界结构，不直接扩大为整页搜索 |
| 字段使用select、组合框、iframe富文本或其他自定义编辑器 | 当前字段适配不覆盖 | 按新的业务控件类别增加操作策略，不统一当作textbox |
| 状态仅通过图标、样式或其他可见提示表达 | 当前开关/收藏读取可能不覆盖 | 明确可观察状态与前后行为，再增加专用适配 |
| 容器名称别名 | role查询、标题查询及显式aria-label结构回退使用完整别名 | 新增别名需同步验证各定位分支 |

不得为使测试通过而把静态章节文字直接当作打开入口、删除归属检查或吞掉无法读取的状态。定位失败需区分：适配缺口、文案差异、数据未出现、操作功能缺失。

## 扩展流程与验证

新增适配时记录业务类别、候选role/元素、定位范围、状态/结果观测方式及失败边界；优先扩展公共helper，再迁移REQ。可将稳定候选集中为配置，但不同类别的范围与交互策略仍需分别实现，不做全局role互换。

验证至少包括合理替代实现，以及同名目标、静态文本、错误归属、状态未知等反例。现有27组合成DOM检查已通过，具体覆盖以验证脚本为准（role_compatibility_checks.json为可重新生成的临时结果）；上表待改进项不能视为已覆盖。真实case回归需针对实际URL单独运行并记录，不能由合成检查外推。

