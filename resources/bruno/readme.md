# Bruno collections

## Overview

This directory contains Bruno collections for exercising SFD microservices' upstream integrations directly, outside of the services themselves.

- **`collections/CRM`** — requests against the Dataverse CRM Web API used by `fcp-sfd-crm`: case and metadata creation, the idempotent `$batch` changeset fix, lookups (accounts, contacts, document types, schemes), case investigation queries, and Dataverse duplicate-detection rule queries.

## Requirements

- Bruno Desktop (`brew install bruno` or [usebruno.com/downloads](https://www.usebruno.com/downloads)).
- Dataverse CRM app registration credentials (client ID/secret, tenant ID) for the target environment — ask another developer or check the CRM app registration in Azure.

## Importing a collection

1. Open Bruno.
2. **Workspace → Import Collection** and select `bruno/collections/CRM`.
3. Because the collection lives in this repo, `git pull` immediately updates it in Bruno.

## Environment configuration

Each collection ships a blank `environments/example.bru` template. Copy it to a new environment file in the same `environments/` folder (Bruno's own environment switcher, not a dotenv file) and fill in real values:

```bash
cp "bruno/collections/CRM/environments/example.bru" "bruno/collections/CRM/environments/dev.bru"
```

Populated environment files hold live client secrets and access tokens — they are git-ignored (see `.gitignore`) so they never get committed. Only `example.bru` is tracked.

### CRM collection

| Variable | Description |
| --- | --- |
| `CRM_URL` | Dataverse Web API base URL, e.g. `https://<org>.api.crm4.dynamics.com/api/data/v9.2` |
| `CRM_URL_SCOPE` | OAuth resource/audience for the token request, e.g. `https://<org>.api.crm4.dynamics.com` |
| `TENANT_ID` | Azure AD tenant ID |
| `CLIENT_ID` | App registration client ID |
| `CLIENT_SECRET` *(secret)* | App registration client secret |
| `CRM_ACCESS_TOKEN` *(secret)* | Populated automatically — run `Get Access Token` first, its post-response script sets this for you |
| `CONTACT_ID`, `ORG_IR`, `SCHEME_VALUE`, `SUBJECT_VALUE`, `DOCUMENT_TYPE_ID`, `teamRoutingValue`, `activityId` | Known-good lookup values for the target environment, used as defaults across several requests |

Get these from another developer or by running the requests in `collections/CRM/requests/Lookups` once you have a token.

## Running requests

1. Select the environment you created (top-right environment picker in Bruno).
2. Run **`Get Access Token`** at the collection root first — it exchanges `CLIENT_ID`/`CLIENT_SECRET` for a token and stores it in `CRM_ACCESS_TOKEN` for the rest of the collection to use. Every other request inherits bearer auth from the collection root.
3. Requests are grouped into folders that share that auth inheritance:
   - **Lookups** — resolve IDs (account, contact, document type, scheme) and entity/attribute metadata needed by other requests.
   - **Case and Metadata Creation** — writes, including `Create Case Changeset (Mirrors createCaseWithOnlineSubmission)`, which reimplements `src/repos/crm.js` and `src/repos/dataverse-batch.js`'s exact key-derivation and `$batch` changeset logic from `fcp-sfd-crm`.
   - **Idempotency Experiments** — the original experiments proving Dataverse's conditional-upsert (`If-None-Match`) behaviour.
   - **Case Investigation** — read back created cases, submissions, and metadata.
   - **Duplicate Detection Investigation** — query Dataverse's configured duplicate-detection rules and match logs.

Hardcoded IDs in request bodies/paths are set as `vars:pre-request` defaults rather than baked into the request itself — override them per-run rather than editing the request.
