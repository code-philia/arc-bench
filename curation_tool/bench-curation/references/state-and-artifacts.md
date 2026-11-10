# 状态与产物约定

## 单一持久状态

`ref/bookstack/governance_reference.json`是可选的本地记录，不随Git共享；无记录时显式init建立`workflow_state`：

- `schema_version`、`dataset=bookstack`。
- `baseline_sha256`：当前已核实的需求和tests源指纹；不包含运行产物、进度文档和生成的状态文件自身。
- `phases`：data、role、meta、ui、quality；阶段状态与逐条状态分开。旧状态可缺后加阶段，用`phase --phase <阶段> --status partial --note ...`按实际进度补入，不重建已有状态。
- `items`：id、phase、requirements、status、note、checks、verified_source_sha256；按需保存field、scenario、step及tests，record对应同名参数。

首次建立的阶段均为pending，从当前源码复核，不继承其他工作区的完成结论。已有历史分类表是恢复依据，不能假定其哈希/行号仍对应当前源码。

## 条目状态

| 状态 | 含义 |
| --- | --- |
| pending | 已清点，尚未完成语义复核 |
| reviewed | 判定和改动计划明确 |
| requirements_updated | 本问题涉及的需求改写已落地 |
| tests_updated | 对应测试准备/适配已完成，或有理由说明无需测试改动 |
| verified | 当前版本在记录的检查范围内已验证；不是整体bench全通过 |
| preserved | 已复核属于自然业务，保留并说明原因 |
| deferred | 明确交给后置阶段或不在本轮范围，注明归属 |
| blocked | 缺必要条件或验证仍失败，记录失败位置及已核实事实 |

正常修改流为pending→reviewed→requirements_updated→tests_updated→verified。只改测试的条目可从reviewed进入tests_updated，但说明为何需求无需改动；只改需求也说明测试无需改动。preserved/deferred可从复核进入。blocked可在任何处理中登记；恢复后回到reviewed，不能直接宣称verified。允许批量原子改共享helper后逐项登记，不要求为每个词做独立提交。

`verified`需非空checks，且每项包含`kind`、`result=passed`、`scope`。可选kind为static、types、adapter、data_ownership、browser；检查范围必须真实。browser失败的相关条目保持blocked，其他范围独立登记。工具校验状态及非空证据，不证明检查确实执行。

源变化后state工具显示drift。`invalidate --phase ... --id ... --status reviewed --note ...`使受影响项失效；如已确认不受影响，也先失效再以当前检查/复核登记verified。其他条目仍旧verified时checkpoint拒绝通过，防止直接刷新哈希掩盖陈旧结论。

## 阶段完成

阶段可用pending、active、partial、temporarily_closed、complete。用`phase`命令更新，必须提供note；complete要求该阶段有条目、每个条目均verified或preserved、全部verified源指纹为当前版本，并且无源漂移。deferred/blocked未解决时为partial；用户明确暂结时才用temporarily_closed。工具不能替代主skill对清点完整性、临时标记和业务回归的复核。

ui_governance保留分类及验证摘要，workflow_state维护ui逐项进度，避免两处各自推进状态。首次接入已有UI记录时复核后按真实里程碑登记，不把历史checks_zh直接伪造成当前verified；保留失败身份、失败阶段和已验证范围。case剩余失败不自动等于UI适配缺陷，相关条目保持blocked或明确交接，阶段仍为partial。

quality_governance记录断言缺口、修复范围、回归/重复运行及共享状态限制。quality条目按实际验证范围维护；加强断言后出现更多失败可能揭示遗漏检查，不自动削弱断言或归咎于case。需求已知但helper明确拒绝的关联准备应记为接口保护已验证、完整功能未实现，不能混称全部支持。

BookStack交付版已获授权清理历史59处数据协议及10处元说明，当前0处；移除文本及归属保存在delivery。未来若新增暂存内容，必须在交付前复核清理，不能仅去掉括号保留协议。data/meta完成时工具直接检查当前YAML，左/右任一隔离括号残留都会拒绝。若已有meta_governance.new_meta_markers字段还须同步清零；新工作区无需创建历史统计字段。工具不证明移除内容的业务语义正确，仍须前后复核。role分类齐全、27组适配检查通过不等于任意DOM兼容或35个业务场景全通过。已知25通过10失败是历史结论，重测后以新证据更新，不凭空改写。

## 产物生命周期

共享内容为requirements.yaml、reference/、tests、README_curation.md、skill及复核工具。所有进度、分类、审计、状态、历史原文与报告统一写入ref/，由Git忽略；合作者无需本地文件即可阅读skill并运行检查。

临时JSON应有schema_version、phase、source_sha256和records/results；审阅/改写记录含ID、字段、旧文、新文、中文理由、关联REQ。扫描不可覆盖唯一人工决定。检查脚本已有格式可沿用，缺少的上下文由条目或清单补充。

临时文件包括data_inventory.json、数据/role改写日志、各类audit/checks结果和run/raw JSON，以及本轮生成的playwright-report/test-results。先汇总到长期表，再明确列出本轮路径清理；不按*.json全删，不删除其他数据集或其他运行的产物。Windows递归删除前核实绝对路径位于工作区、等于本轮明确的报告目录。未解决问题只保留最小可复核证据，不长期堆积整段trace或日志。

历史BookStack一次性脚本绑定旧哈希和已清理的输入链，仅参考实现方法，不把它们作为新流程前置。检查工具可以再次生成JSON；使用后同样汇总并清理，不为补报告重放历史需求转换。
