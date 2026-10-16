"""Metadata-only terminal receipt. No provider calls or recovery actions."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path


def receipt(env):
    dry = env.get('DRY_RUN') == 'true'
    pushed = env.get('PUSH_ACK') == 'true'
    attempted = env.get('PUSH_ATTEMPTED') == 'true'
    identity_bound = env.get('DEPLOY_IDENTITY_BOUND') == 'true'
    verified = env.get('VERIFY_OUTCOME') == 'success'
    already = env.get('ALREADY') == 'true'
    if dry:
        disposition = ('rehearsal_verified' if env.get('REHEARSAL_OUTCOME') == 'success'
                       else 'rehearsal_not_verified')
    elif already:
        # The legacy early-exit path checks HTTP status only, not full delivery.
        disposition = 'previous_publication_http_observed_not_fully_verified'
    elif (verified and pushed and identity_bound and env.get('DEPLOY_OUTCOME') == 'success'
          and env.get('APPROVAL_OUTCOME') == 'success'):
        disposition = 'publication_checks_verified'
    elif pushed:
        disposition = 'commit_persisted_publication_unverified'
    elif attempted:
        disposition = 'push_acknowledgement_unknown_reconcile_before_action'
    else:
        disposition = 'stopped_before_push'
    keys = {
        'event': 'EVENT_NAME', 'cohort_date': 'COHORT_DATE',
        'repository': 'REPOSITORY', 'run_id': 'RUN_ID', 'attempt': 'RUN_ATTEMPT',
        'workflow_source_sha': 'WORKFLOW_SHA', 'checkout_sha': 'CHECKOUT_SHA',
        'publication_sha': 'PUBLICATION_SHA', 'slug': 'TARGET_SLUG',
        'deploy_run_id': 'DEPLOY_RUN_ID', 'job_status': 'JOB_STATUS',
        'approval_outcome': 'APPROVAL_OUTCOME', 'deploy_outcome': 'DEPLOY_OUTCOME',
        'verification_outcome': 'VERIFY_OUTCOME',
    }
    result = {key: env.get(value, '') for key, value in keys.items()}
    result.update(schema_version=1, disposition=disposition, dry_run=dry,
                  push_attempted=attempted, push_acknowledged=pushed,
                  automatic_retry_authorized=False,
                  deploy_identity_independently_bound=identity_bound)
    return result


if __name__ == '__main__':
    value = receipt(os.environ)
    value['observed_at'] = datetime.now(timezone.utc).isoformat()
    output = Path(os.environ['RECEIPT_PATH'])
    output.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a', encoding='utf-8') as summary:
        summary.write('\n## Friday Frame outcome\n\n')
        summary.write(value['disposition'] + '\n\n')
        summary.write('See the metadata receipt and exact step outcomes. An uncertain acknowledgement requires reconciliation before any further action.\n')
