"""Inventory requirement text without changing YAML; Python standard library only.

This is a source scanner for the benchmark's indentation-based YAML layout,
not a general YAML parser. Every description/step scalar is retained for review.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

RULES = {
    'explicit_seed': r'Seed prerequisites|initially seeded|seeded|seed data|preloaded',
    'data_setup_protocol': r'\bFor [^:\n]+:|UI-created|UI-published|case-isolated|\bisolated\b|scenario.supplied|source example|run/worker/case|evaluator.{0,25}(?:run|worker|case)|storage injection',
    'credentials': r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}|Password\d+|\bcredentials\b|verified account',
    'fixed_time': r'\b\d{4}-\d{2}-\d{2}\b|benchmark clock|application/evaluator clock',
    'structured_data': r'\{[^\n]*"[^\n]*:',
    'example_content': r'\b(?:Shelf|Book|Page|Chapter|Draft) (?:Created |Updated |Cancelled )?\d|Reference (?:shelf|book) description|Sprint goals|Groceries|Milk and bread|Disposable draft',
    'input_or_existing_state': r'\bcreat(?:e|es|ed|ing)\b|\benter\b|\bfill\b|\breplace\b|\bcontains?\b|\busing\b|\bwith\b|\bnamed\b|\bexists?\b',
}
FIELD = re.compile(r'^(\s*)(text|Given|When|Then):(?:\s*(.*))?$')
IDENTITY = re.compile(r'^(\s*)(?:- )?id:\s*(\S+)')


def inventory(path):
    raw = path.read_bytes()
    lines = raw.decode('utf-8-sig').splitlines()
    identities = []
    records = []
    i = 0
    while i < len(lines):
        line = lines[i]
        identity = IDENTITY.match(line)
        if identity:
            depth = len(identity[1])
            while identities and identities[-1][0] >= depth:
                identities.pop()
            identities.append((depth, identity[2]))
        match = FIELD.match(line)
        if not match:
            i += 1
            continue
        depth, field, initial = len(match[1]), match[2], match[3] or ''
        end = i + 1
        while end < len(lines):
            following = lines[end]
            if following.strip() and len(following) - len(following.lstrip()) <= depth:
                break
            end += 1
        block = initial in ('|', '|-', '|+', '>', '>-', '>+')
        content = lines[i + 1:end]
        margin = min((len(x) - len(x.lstrip()) for x in content if x.strip()), default=0)
        parts = ([] if block else [initial]) + [x[margin:] for x in content]
        value = '\n'.join(parts).strip()
        signals = []
        for name, pattern in RULES.items():
            hits = list(re.finditer(pattern, value, re.I))
            if hits:
                signals.append({'rule': name, 'matches': list(dict.fromkeys(m[0] for m in hits))})
        owners = [item[1] for item in identities]
        records.append({
            'record_id': f'text-{i + 1}',
            'requirement_id': next((x for x in reversed(owners) if x == 'ROOT' or x.startswith('REQ-')), None),
            'scenario_id': next((x for x in reversed(owners) if x.startswith('SCN-')), None),
            'step_id': next((x for x in reversed(owners) if x.startswith('STEP-')), None),
            'field': field, 'line_start': i + 1, 'line_end': end,
            'text': value, 'source_text': '\n'.join(lines[i:end]),
            'classification': 'candidate' if signals else 'context',
            'signals': signals, 'review_status': 'pending',
        })
        i = end
    return {
        'schema_version': 1,
        'source_file': path.name,
        'source_sha256': hashlib.sha256(raw).hexdigest(),
        'method': 'indentation_source_scan_with_heuristic_signals',
        'limitations': [
            '仅适用于当前 bench 的缩进式 YAML 写法，不是通用 YAML 解析器。',
            '候选规则倾向召回，可能误报；未命中不代表不存在数据说明。',
            'example_content 规则包含首批数据集示例词，其他数据集需要补充规则。',
            '所有 description.text 和 Given/When/Then 均保留供人工复核；不扫描图片中的数据。',
            '分类不等于删除建议；业务默认值、业务规则、示例和评测数据需人工区分。',
        ],
        'summary': {
            'text_records': len(records),
            'candidate_records': sum(r['classification'] == 'candidate' for r in records),
            'context_records': sum(r['classification'] == 'context' for r in records),
            'rule_record_counts': {name: sum(any(s['rule'] == name for s in r['signals']) for r in records) for name in RULES},
        },
        'records': records,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('apps', nargs='+', help='Application directories under arc-bench, e.g. bookstack keep')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1] / 'arc-bench'
    for app in args.apps:
        directory = (root / app).resolve()
        if directory.parent != root.resolve():
            parser.error('Application must be a direct child of arc-bench')
        source = directory / 'requirements' / 'requirements.yaml'
        result = inventory(source)
        output = root.parent / 'ref' / app / 'data_inventory.json'
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'{app}: {json.dumps(result["summary"])} -> {output}')


if __name__ == '__main__':
    main()
