#!/bin/bash
# compose-repos.sh - start all SFD services along with core infrastructure
set -e

echo -e "\nStarting frontend...\n"
docker compose -f repos/fcp-sfd-frontend/compose.yaml -f repos/fcp-sfd-frontend/compose.override.yaml up -d --build

echo -e "\nStarting frontend-internal...\n"
docker compose -f repos/fcp-sfd-frontend-internal/compose.yaml -f repos/fcp-sfd-frontend-internal/compose.override.yaml up -d --build

echo -e "\nStarting comms...\n"
docker compose -f repos/fcp-sfd-comms/compose.yaml -f repos/fcp-sfd-comms/compose.override.yaml up -d --build

echo -e "\nStarting crm...\n"
docker compose -f repos/fcp-sfd-crm/compose.yml -f repos/fcp-sfd-crm/compose.override.yml up -d --build

echo -e "\nStarting object-processor...\n"
docker compose -f repos/fcp-sfd-object-processor/compose.yaml -f repos/fcp-sfd-object-processor/compose.override.yaml up -d --build

echo -e "\nAll services started! 🎉\n"
