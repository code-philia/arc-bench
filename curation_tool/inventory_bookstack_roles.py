"""Inventory role annotations and related wording without changing requirements."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from inventory_requirement_data import inventory

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'arc-bench/bookstack/requirements/requirements.yaml'


def main():
    parsed = inventory(SOURCE)
    records = []
    counts = Counter()
    for r in parsed['records']:
        roles = re.findall(r'\(role=([\w-]+)\)', r['text'])
        aria = re.findall(r'aria-[\w-]+=(?:true|false)', r['text'])
        related = re.findall(r'[^\n.!?]*(?:accessible names?|semantically|equivalent link|named regions)[^\n.!?]*[.!?]?', r['text'], re.I)
        keyboard = 'keyboard-accessible' in r['text']
        if not (roles or aria or related or keyboard):
            continue
        counts.update(roles)
        records.append({**{k: r[k] for k in ('record_id', 'requirement_id', 'scenario_id', 'step_id', 'field', 'line_start', 'line_end', 'text')},
                        'role_annotations': roles, 'aria_assignments': aria,
                        'related_wording': related,
                        'preserve_keyboard_behavior': keyboard})
    tests = ROOT / 'arc-bench/bookstack/tests'
    test_refs = []
    for p in sorted(tests.rglob('*.ts')):
        for number, line in enumerate(p.read_text(encoding='utf-8').splitlines(), 1):
            if 'getByRole' in line or 'aria-' in line:
                test_refs.append({'file': p.relative_to(ROOT).as_posix(), 'line': number, 'text': line})
    result = {'schema_version': 1, 'source_file': SOURCE.name,
              'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
              'summary': {'requirement_fields': len(records), 'role_annotations': sum(counts.values()),
                          'roles': dict(counts), 'test_role_or_aria_lines': len(test_refs)},
              'records': records, 'test_references': test_refs,
              'policy_zh': '移除实现角色和ARIA状态约束，保留功能、交互、键盘行为、对象归属和可见状态。候选记录并非整段删除建议。'}
    output = ROOT / 'ref/bookstack/role_inventory.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result['summary']))


if __name__ == '__main__':
    main()
