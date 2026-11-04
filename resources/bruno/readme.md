# Bruno collections

## Overview

This directory contains Bruno collections for exercising SFD microservices' upstream integrations directly, outside of the services themselves.

- **`collections/CRM`** — requests against the Dataverse CRM Web API used by `fcp-sfd-crm`: case and metadata creation, the idempotent `$batch` changeset fix, lookups (accounts, contacts, document types, schemes), case investigation queries, and Dataverse duplicate-detection rule queries.
- **`collections/fcp-sfd-object-processor`** — requests against the `fcp-sfd-object-processor` API: health, the uploader initiate and status endpoints, the CDP Uploader callback, and the metadata and blob reads. Mirrors `docs/openapi/v1.json` in the [fcp-sfd-object-processor](https://github.com/DEFRA/fcp-sfd-object-processor) repository. Check against that spec if a request is rejected.

## Requirements

- Bruno Desktop (`brew install bruno` or [usebruno.com/downloads](https://www.usebruno.com/downloads)).
- Dataverse CRM app registration credentials (client ID/secret, tenant ID) for the target environment — ask another developer or check the CRM app registration in Azure.

## Importing a collection

1. Open Bruno.
2. **Workspace → Import Collection** and select the collection folder you want, e.g. `bruno/collections/CRM` or `bruno/collections/fcp-sfd-object-processor`.
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

### fcp-sfd-object-processor collection

| Variable | Where to find the value |
| --- | --- |
| `BASE_URL` | Defaults to `http://localhost:3004`, the local Docker port. For a deployed environment set `ENV` and use `https://fcp-sfd-object-processor.api.{{ENV}}.cdp-int.defra.cloud`. Production is `https://fcp-sfd-object-processor.api.defra.gov.uk`. |
| `ENV` | Environment segment of the deployed `BASE_URL`, for example `dev`, `test` or `ext-test`. Not used for the local default or production. |
| `TOKEN_URL` | Token endpoint for the environment's identity provider. Entra ID is on by default and Cognito is off by default, so the endpoint depends on that configuration. Cognito token instructions are [on Confluence](https://eaflood.atlassian.net/wiki/spaces/SFD/pages/6468732912/Generate+Cognito+Bearer+token+for+use+with+Object-Processor). |
| `CLIENT_ID` | Client identifier for the token request. Ask another developer or check the app registration for the target environment. |
| `CLIENT_SECRET` *(secret)* | Client secret for the token request. |
| `ACCESS_TOKEN` *(secret)* | Populated automatically. Run `Get Access Token` first, its post-response script sets this for you. |
| `UPLOAD_ID`, `UPLOAD_URL` | Populated automatically by the Initiate upload session post-response script. `UPLOAD_ID` feeds Get uploader scan status; `UPLOAD_URL` feeds the two upload requests. |
| `SBI` | An SBI that holds documents. Read it back with Get metadata by SBI. The example value is a known test SBI. |
| `FILE_ID` | A file identifier returned in the Get metadata by SBI response, or from the Mongo `uploadMetadata` collection. Used by Get blob URL by file ID. |
| `CRN` | No committed value. Provide your own before running Initiate upload session or Process upload callback. |
| `FRN`, `SUBMISSION_ID`, `UOSR`, `DOCUMENT_TYPE`, `REFERENCE`, `SERVICE`, `REDIRECT` | Metadata defaults for the Initiate upload session and Process upload callback payloads. Override per run. |
| `UPLOAD_STATUS`, `FILENAME`, `CONTENT_TYPE`, `CONTENT_LENGTH`, `CHECKSUM_SHA256`, `S3_KEY`, `S3_BUCKET` | File details for the Process upload callback payload. `FILENAME` is also the `x-filename` header on the binary upload. Override per run. |

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

For the **fcp-sfd-object-processor** collection, select the environment, then run `Get Access Token` first. It stores the bearer token in `ACCESS_TOKEN`, which every request under **Authenticated requests** inherits. Initiate upload session's post-response script sets `UPLOAD_ID` and `UPLOAD_URL`. Then run one of the two Upload to CDP Uploader requests (they post straight to the uploader at `UPLOAD_URL`, so they carry no token), poll Get uploader scan status, and once the scan is ready read the document back with Get metadata by SBI and Get blob URL by file ID. Health check and Process upload callback need no token, since the service disables auth on `/health` and `/api/v1/callback`. All object-processor variables are upper snake case.
