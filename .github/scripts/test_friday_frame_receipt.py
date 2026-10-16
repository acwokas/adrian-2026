import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('receipt', Path(__file__).with_name('friday-frame-receipt.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ReceiptTests(unittest.TestCase):
    def outcome(self, **kwargs):
        return module.receipt(kwargs)['disposition']

    def test_approval_failure_prevents_effect_claim(self):
        self.assertEqual(self.outcome(APPROVAL_OUTCOME='failure'), 'stopped_before_push')

    def test_lost_push_ack_is_not_no_publication(self):
        self.assertEqual(self.outcome(PUSH_ATTEMPTED='true', JOB_STATUS='failure'),
                         'push_acknowledgement_unknown_reconcile_before_action')

    def test_failure_after_push_cannot_claim_nothing_published(self):
        self.assertEqual(self.outcome(PUSH_ATTEMPTED='true', PUSH_ACK='true', DEPLOY_OUTCOME='failure'),
                         'commit_persisted_publication_unverified')

    def test_successful_deploy_is_not_live_verification(self):
        self.assertEqual(self.outcome(PUSH_ACK='true', DEPLOY_OUTCOME='success'),
                         'commit_persisted_publication_unverified')

    def test_verified_publication_needs_push_and_deploy(self):
        self.assertEqual(self.outcome(PUSH_ACK='true', APPROVAL_OUTCOME='success', DEPLOY_OUTCOME='success', DEPLOY_IDENTITY_BOUND='true', VERIFY_OUTCOME='success'),
                         'publication_checks_verified')
        self.assertNotEqual(self.outcome(VERIFY_OUTCOME='success'), 'publication_checks_verified')

    def test_verified_claim_requires_explicit_approval_outcome(self):
        self.assertNotEqual(self.outcome(PUSH_ACK='true', DEPLOY_OUTCOME='success', DEPLOY_IDENTITY_BOUND='true', VERIFY_OUTCOME='success', APPROVAL_OUTCOME='failure'), 'publication_checks_verified')

    def test_cancelled_after_push_remains_uncertain(self):
        self.assertEqual(self.outcome(PUSH_ACK='true', JOB_STATUS='cancelled'),
                         'commit_persisted_publication_unverified')

    def test_rehearsal_is_not_new_publication(self):
        self.assertEqual(self.outcome(DRY_RUN='true', REHEARSAL_OUTCOME='success'), 'rehearsal_verified')

    def test_http_only_legacy_path_is_scoped(self):
        self.assertEqual(self.outcome(ALREADY='true'), 'previous_publication_http_observed_not_fully_verified')

    def test_no_raw_inputs_credentials_or_inferred_identity(self):
        result = module.receipt({'GH_TOKEN': 'private', 'BODY': 'private', 'RUN_ID': '123'})
        self.assertNotIn('private', str(result))
        self.assertFalse(result['automatic_retry_authorized'])
        self.assertFalse(result['deploy_identity_independently_bound'])


if __name__ == '__main__':
    unittest.main()
