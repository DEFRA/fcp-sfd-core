# Diagrams

Draw.io source files describing Single Front Door architecture. Open them with
[diagrams.net](https://app.diagrams.net), the VS Code Draw.io Integration extension, or the desktop app.

## document-upload.drawio

Two pages:

- **Document upload**: the path a farmer's file takes from a client service (for example the Rural Payments
  Portal) through CDP Uploader, the object processor and on to case creation in Dynamics 365, including the
  event topics that carry it.
- **Document retrieval**: reading documents and their metadata back out of the object processor.

Yellow components with a star are SFD's responsibility, blue are CDP platform services, grey are outside SFD.

Drawn from these sources:

| Element | Source |
| --- | --- |
| API endpoints, callback validation, outbox worker | `fcp-sfd-object-processor` `src/api`, `src/services`, `src/messaging` |
| Document uploaded event contract | `fcp-sfd-object-processor` `docs/asyncapi/v1.yaml` |
| Queue consumption, deduplication, Dataverse writes | `fcp-sfd-crm` `src/messaging/inbound`, `src/services`, `src/repos/crm.js` |
| Case created event contract | `fcp-sfd-crm` `docs/asyncapi/v1.yml` |
| Topic, queue and bucket names, gateway configuration | `cdp-tenant-config` `environments/*/tenants/*.json` |

Update the diagram when any of those change.
