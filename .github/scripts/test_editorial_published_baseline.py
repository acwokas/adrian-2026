import importlib.util
import pathlib
import unittest

spec = importlib.util.spec_from_file_location('baseline', pathlib.Path(__file__).with_name('editorial-published-baseline.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PublishedBaselineTest(unittest.TestCase):
    def run_record(self, **changes):
        item = dict(id=1, head_branch='astro-rebuild', status='completed', conclusion='success',
                    event='push', path='.github/workflows/deploy.yml', head_sha='a'*40,
                    created_at='2026-11-12T09:00:00Z', updated_at='2026-11-12T09:05:00Z')
        return {**item, **changes}

    def select(self, runs):
        return module.select_baseline(runs, {'created_at':'2026-11-13T03:00:00Z'}, 'b'*40)

    def test_prior_success(self):
        self.assertEqual(self.select([self.run_record()]), ('a'*40, 1))

    def test_candidate_and_concurrent_are_rejected(self):
        for changes in [dict(head_sha='b'*40), dict(updated_at='2026-11-13T03:01:00Z'),
                        dict(created_at='2026-11-13T03:01:00Z')]:
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                self.select([self.run_record(**changes)])

    def test_failed_other_branch_or_wrong_workflow_are_rejected(self):
        for changes in [dict(conclusion='failure'), dict(head_branch='preview'), dict(status='in_progress'),
                        dict(path='.github/workflows/editorial-facts.yml'), dict(event='pull_request'),
                        dict(head_sha='bad')]:
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                self.select([self.run_record(**changes)])

    def test_latest_eligible_success_is_used(self):
        newer = self.run_record(id=2, head_sha='c'*40, created_at='2026-11-12T10:00:00Z')
        self.assertEqual(self.select([self.run_record(), newer]), ('c'*40, 2))

    def test_missing_baseline_fails_closed(self):
        with self.assertRaises(ValueError):
            self.select([])
