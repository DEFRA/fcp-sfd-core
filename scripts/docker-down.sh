#!/bin/bash
# docker-down.sh - stop all SFD services along with core infrastructure
set -e

echo -e "\nRemoving old containers...\n"

docker compose -f repos/fcp-sfd-frontend/compose.yaml -f repos/fcp-sfd-frontend/compose.override.yaml down -v --remove-orphans
docker compose -f repos/fcp-sfd-frontend-internal/compose.yaml -f repos/fcp-sfd-frontend-internal/compose.override.yaml down --remove-orphans
docker compose -f repos/fcp-sfd-comms/compose.yaml -f repos/fcp-sfd-comms/compose.override.yaml down --remove-orphans
docker compose -f repos/fcp-sfd-crm/compose.yml down --remove-orphans
docker compose -f repos/fcp-sfd-object-processor/compose.yaml -f repos/fcp-sfd-object-processor/compose.override.yaml down --remove-orphans

echo -e "\nAll containers removed! 🎉\n"
