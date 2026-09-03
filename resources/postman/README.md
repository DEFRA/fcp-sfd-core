# Postman

This folder contains Postman collections relating to existing APIs developed as part of the Single Front Door project.

## Contents

- [Object processor (`fcp-sfd-object-processor`)](./fcp-sfd-object-processor.postman_collection.json)

The collection mirrors `docs/openapi/v1.json` in the [fcp-sfd-object-processor](https://github.com/DEFRA/fcp-sfd-object-processor) repository. Check against that spec if a request is rejected.

## Collection variables

Set these on the collection after importing.

| Variable | Description |
| --- | --- |
| `baseUrl` | Service base URL. Defaults to `http://localhost:3004`, the local Docker port. Use `https://fcp-sfd-object-processor.<env>.cdp-int.defra.cloud` for a deployed environment. |
| `token` | Bearer token. Every request except Health and Process upload request requires one. |
| `sbi`, `fileId`, `uploadId`, `correlationId` | Values used by the read requests. |

Entra ID authentication is enabled by default and Cognito authentication is off by default, so the token you need depends on the environment's configuration. Instructions for generating a Cognito token are [on Confluence](https://eaflood.atlassian.net/wiki/spaces/SFD/pages/6468732912/Generate+Cognito+Bearer+token+for+use+with+Object-Processor).

## CRM requests

Requests against the Dataverse CRM Web API used by `fcp-sfd-crm` live in the Bruno collection at [`resources/bruno/collections/CRM`](../bruno/collections/CRM), not here.
