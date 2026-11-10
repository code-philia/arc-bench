"""Maintain BookStack curation state, not perform curation or execute tests."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BOOK = ROOT / 'arc-bench' / 'bookstack'
REFERENCE = ROOT / 'ref' / 'bookstack' / 'governance_reference.json'
STATUSES = {'pending', 'reviewed', 'requirements_updated', 'tests_updated', 'verified', 'preserved', 'deferred', 'blocked'}
PHASE_STATUSES = {'pending', 'active', 'partial', 'temporarily_closed', 'complete'}
CHECKS = {'static', 'types', 'adapter', 'data_ownership', 'browser'}
PHASES = {'data', 'role', 'meta', 'ui', 'quality'}
TRANSITIONS = {
    'pending': {'reviewed', 'preserved', 'deferred', 'blocked'},
    'reviewed': {'requirements_updated', 'tests_updated', 'preserved', 'deferred', 'blocked'},
    'requirements_updated': {'tests_updated', 'blocked', 'reviewed'},
    'tests_updated': {'verified', 'blocked', 'reviewed'},
    'verified': {'reviewed', 'blocked'},
    'preserved': {'reviewed', 'blocked'},
    'deferred': {'reviewed', 'blocked'},
    'blocked': {'reviewed', 'deferred'},
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def fingerprint():
    paths = [BOOK / 'requirements' / 'requirements.yaml', *sorted((BOOK / 'tests').rglob('*.ts'))]
    digest = hashlib.sha256()
    for path in paths:
        digest.update(path.relative_to(ROOT).as_posix().encode())
        digest.update(b'\0')
        digest.update(path.read_bytes())
        digest.update(b'\0')
    return digest.hexdigest()


def initialize(document, current):
    require('workflow_state' not in document, 'State already initialized; use status, do not overwrite it.')
    document['workflow_state'] = {
        'schema_version': 1,
        'dataset': 'bookstack',
        'baseline_sha256': current,
        'phases': {
            'data': {'status': 'pending', 'note': '新建本地工作记录；按实际范围复核，不自动执行或继承历史完成结论。'},
            'role': {'status': 'pending', 'note': '新建本地工作记录；当前适配实现不等于本轮已经验证。'},
            'meta': {'status': 'pending', 'note': '任务3元说明与重复治理；按当前授权及已有参考恢复，不自动执行。'},
            'ui': {'status': 'pending', 'note': '任务5 UI精确约束治理；按当前授权及已有参考恢复，不自动执行。'},
            'quality': {'status': 'pending', 'note': '任务6测试数据与断言质量复查；按当前授权执行，不自动增加评分场景。'},
        },
        'items': [],
    }


def validate(state):
    require(state['schema_version'] == 1 and state['dataset'] == 'bookstack', 'Unsupported workflow schema or dataset.')
    require({'data', 'role'} <= set(state['phases']) <= PHASES, 'Unsupported workflow phase.')
    for phase in state['phases'].values():
        require(phase['status'] in PHASE_STATUSES and phase['note'].strip(), 'Invalid phase state.')
    keys = set()
    for item in state['items']:
        key = (item['phase'], item['id'])
        require(key not in keys, f'Duplicate item: {key}')
        keys.add(key)
        require(item['phase'] in state['phases'] and item['status'] in STATUSES, 'Invalid item state.')
        require(bool(item['note'].strip()) and bool(item['requirements']), 'Items need a reason and related requirements.')
        if item['status'] == 'verified':
            require(bool(item.get('verified_source_sha256')), 'Verified item needs source fingerprint.')
            checks = item.get('checks', [])
            require(bool(checks), 'Verified item needs actual checks.')
            require(all(c['kind'] in CHECKS and c['result'] == 'passed' and c['scope'].strip() for c in checks), 'Invalid verification evidence.')


def apply(document, args, current):
    if args.command == 'init':
        initialize(document, current)
    require('workflow_state' in document, 'No workflow state; initialize explicitly with init.')
    state = document['workflow_state']
    validate(state)
    if args.command in {'record', 'invalidate'}:
        require(args.phase in state['phases'], 'Phase not initialized; use phase with an explicit note first.')
        require(state['phases'][args.phase]['status'] != 'temporarily_closed', 'Phase is temporarily closed; explicitly reopen it before changing items.')
        matches = [i for i in state['items'] if i['phase'] == args.phase and i['id'] == args.id]
        existing = matches[0] if matches else None
        if args.command == 'invalidate':
            require(existing is not None, 'Cannot invalidate an unknown item.')
            existing.update(status=args.status, note=args.note, checks=[])
            existing.pop('verified_source_sha256', None)
        else:
            require(existing is not None or args.status in {'pending', 'reviewed', 'preserved', 'deferred', 'blocked'}, 'New item must begin with review, not completion.')
            if existing and args.status != existing['status']:
                require(args.status in TRANSITIONS[existing['status']], f"Invalid transition {existing['status']} -> {args.status}")
            checks = []
            for value in args.check:
                kind, separator, scope = value.partition(':')
                require(separator and kind in CHECKS and scope.strip(), 'Use --check kind:actual-check-scope')
                checks.append({'kind': kind, 'result': 'passed', 'scope': scope})
            if args.status == 'verified':
                require(bool(checks), 'Record current checks explicitly for verified status.')
            item = dict(existing or {})
            item.update(id=args.id, phase=args.phase, status=args.status,
                        requirements=args.requirements or item.get('requirements', []), note=args.note, checks=checks)
            for field in ['field', 'scenario', 'step', 'tests']:
                value = getattr(args, field, None)
                if value is not None:
                    item[field] = value
            item.pop('verified_source_sha256', None)
            if args.status == 'verified':
                item['verified_source_sha256'] = current
            if existing:
                existing.clear()
                existing.update(item)
            else:
                state['items'].append(item)
        if state['phases'][args.phase]['status'] == 'complete':
            state['phases'][args.phase] = {'status': 'partial', 'note': '条目发生变化，阶段完成状态已失效，需重新复核。'}
    elif args.command == 'checkpoint':
        require(not any(i['status'] == 'verified' and i['verified_source_sha256'] != current for i in state['items']), 'Invalidate/reverify stale verified items before checkpoint.')
        state['baseline_sha256'] = current
    elif args.command == 'phase':
        if args.status == 'complete':
            items = [i for i in state['items'] if i['phase'] == args.phase]
            require(state['baseline_sha256'] == current, 'Source drift: review and checkpoint first.')
            require(bool(items) and all(i['status'] in {'verified', 'preserved'} for i in items), 'Phase still has unverified, blocked or deferred items.')
            require(all(i['status'] != 'verified' or i['verified_source_sha256'] == current for i in items), 'Stale verification.')
            if args.phase in {'data', 'meta'}:
                source = (BOOK / 'requirements' / 'requirements.yaml').read_text(encoding='utf8')
                require(not any(marker in source for marker in ('【', '】')), 'Requirement markers still require explicit resolution before final completion.')
            if args.phase == 'meta':
                count = document.get('meta_governance', {}).get('new_meta_markers')
                require(count is None or count == 0, 'Update the existing meta marker ownership count before final completion.')
        state['phases'][args.phase] = {'status': args.status, 'note': args.note}
    validate(state)
    return {
        'dataset': 'bookstack', 'source_drift': state['baseline_sha256'] != current,
        'phases': state['phases'], 'items': state['items'],
        'stale_verified_items': [i['id'] for i in state['items'] if i['status'] == 'verified' and i['verified_source_sha256'] != current],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for name in ['init', 'status', 'checkpoint', 'validate']:
        sub.add_parser(name)
    for name in ['record', 'invalidate', 'phase']:
        p = sub.add_parser(name)
        p.add_argument('--phase', choices=sorted(PHASES), required=True)
        p.add_argument('--note', required=True)
        p.add_argument('--status', choices=sorted(PHASE_STATUSES if name == 'phase' else {'reviewed', 'blocked'} if name == 'invalidate' else STATUSES), required=True)
        if name != 'phase':
            p.add_argument('--id', required=True)
        if name == 'record':
            p.add_argument('--requirements', nargs='+')
            p.add_argument('--field')
            p.add_argument('--scenario')
            p.add_argument('--step')
            p.add_argument('--tests', nargs='+')
            p.add_argument('--check', action='append', default=[])
    args = parser.parse_args()
    if not REFERENCE.exists() and args.command != 'init':
        parser.exit(2, 'No local state. Run init explicitly to create ref/bookstack/governance_reference.json.\n')
    document = json.loads(REFERENCE.read_text(encoding='utf8')) if REFERENCE.exists() else {}
    try:
        result = apply(document, args, fingerprint())
    except (ValueError, KeyError) as error:
        parser.exit(2, f'{error}\n')
    if args.command not in {'status', 'validate'}:
        REFERENCE.parent.mkdir(parents=True, exist_ok=True)
        temporary = REFERENCE.with_suffix('.json.tmp')
        temporary.write_text(json.dumps(document, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
        temporary.replace(REFERENCE)
    print(json.dumps(result, ensure_ascii=True, indent=2))


if __name__ == '__main__':
    main()
