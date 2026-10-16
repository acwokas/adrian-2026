import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('match', Path(__file__).with_name('friday-frame-deploy-match.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class MatchTests(unittest.TestCase):
    def setUp(self):
        self.run = dict(databaseId=123, displayTitle='Friday Frame 42/1 abc',
                        headSha='abc', headBranch='astro-rebuild', event='workflow_dispatch')

    def select(self, rows):
        return module.select(rows, 'abc', 'Friday Frame 42/1 abc', 'astro-rebuild')

    def test_exact_child(self):
        self.assertEqual(self.select([self.run]), '123')

    def test_each_wrong_identity_dimension_rejected(self):
        for field in ['displayTitle', 'headSha', 'headBranch', 'event']:
            with self.subTest(field=field):
                self.assertEqual(self.select([{**self.run, field: 'different'}]), '')

    def test_unrelated_newer_run_does_not_win(self):
        self.assertEqual(self.select([{**self.run, 'databaseId': 999, 'displayTitle': 'Other'}, self.run]), '123')

    def test_previous_parent_attempt_does_not_match(self):
        self.assertEqual(self.select([{**self.run, 'displayTitle': 'Friday Frame 42/0 abc'}]), '')

    def test_multiple_matches_fail_closed(self):
        with self.assertRaises(ValueError):
            self.select([self.run, {**self.run, 'databaseId': 124}])

    def test_empty_delayed_snapshot(self):
        self.assertEqual(self.select([]), '')


if __name__ == '__main__':
    unittest.main()
