"""Exercise completion guards in memory; never write local curation state."""
import argparse
import copy
import unittest
from unittest.mock import patch

import state


class CompletionTests(unittest.TestCase):
    def setUp(self):
        self.document = {}
        state.initialize(self.document, 'current')

    def ready(self, phase):
        self.document['workflow_state']['items'].append({
            'id': 'TEST', 'phase': phase, 'status': 'verified',
            'requirements': ['ROOT'], 'note': 'In-memory test fixture',
            'checks': [{'kind': 'static', 'result': 'passed', 'scope': 'Test fixture only'}],
            'verified_source_sha256': 'current',
        })

    def complete(self, phase, source):
        args = argparse.Namespace(command='phase', phase=phase, status='complete', note='Test fixture')
        with patch.object(state.Path, 'read_text', return_value=source):
            return state.apply(self.document, args, 'current')

    def test_fresh_state_has_no_inherited_completion(self):
        self.assertTrue(all(p['status'] == 'pending' for p in self.document['workflow_state']['phases'].values()))

    def test_clean_source_needs_no_historical_marker_summary(self):
        for phase in ['data', 'meta']:
            with self.subTest(phase=phase):
                self.ready(phase)
                result = self.complete(phase, 'id: ROOT\n')
                self.assertEqual(result['phases'][phase]['status'], 'complete')

    def test_source_markers_override_a_zero_summary(self):
        for phase in ['data', 'meta']:
            self.ready(phase)
            self.document['meta_governance'] = {'new_meta_markers': 0}
            for source in ['【protocol】', '【', '】']:
                with self.subTest(phase=phase, source=source):
                    with self.assertRaisesRegex(ValueError, 'Requirement markers'):
                        self.complete(phase, source)

    def test_existing_nonzero_summary_requires_review(self):
        self.ready('meta')
        self.document['meta_governance'] = {'new_meta_markers': 10}
        with self.assertRaisesRegex(ValueError, 'ownership count'):
            self.complete('meta', 'id: ROOT\n')

    def test_stale_or_blocked_items_cannot_complete(self):
        self.ready('meta')
        original = copy.deepcopy(self.document)
        self.document['workflow_state']['items'][0]['verified_source_sha256'] = 'old'
        with self.assertRaisesRegex(ValueError, 'Stale verification'):
            self.complete('meta', 'id: ROOT\n')
        with self.assertRaisesRegex(ValueError, 'stale verified'):
            state.apply(self.document, argparse.Namespace(command='checkpoint'), 'current')
        self.document = original
        self.document['workflow_state']['items'][0]['status'] = 'blocked'
        with self.assertRaisesRegex(ValueError, 'blocked or deferred'):
            self.complete('meta', 'id: ROOT\n')


if __name__ == '__main__':
    unittest.main()
