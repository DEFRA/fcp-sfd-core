# Single Front Door Core

Local development support for orchestrating all Single Front Door microservices.

## Prerequisites

- Docker
- Docker Compose
- Node.js 22.13 LTS — we recommend using [NVM](https://github.com/nvm-sh/nvm) for Unix-based systems or [NVM for Windows](https://github.com/coreybutler/nvm-windows).

## Onboarding guide

For new developers joining the SFD team, there is an [onboarding guide](https://github.com/DEFRA/fcp-sfd-core/blob/main/onboarding-guide/README.md) with useful links to help you get started.

## Repositories

| Service | Type | Quality gate |
| --- | --- | --- |
| [fcp-sfd-comms](https://github.com/defra/fcp-sfd-comms) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-comms&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-comms) |
| [fcp-sfd-data](https://github.com/defra/fcp-sfd-data) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-data&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-data) |
| [fcp-sfd-frontend](https://github.com/defra/fcp-sfd-frontend) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend) |
| [fcp-sfd-frontend-internal](https://github.com/defra/fcp-sfd-frontend-internal) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend-internal&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend-internal) |

## Local development

Clone the repository before running any scripts:

```bash
git clone https://github.com/DEFRA/fcp-sfd-core

cd fcp-sfd-core

npm install
```

### Cloning repositories

This project contains a script to clone all required repositories. It checks the `service-compose` directory for service snippets and clones any sibling repositories that are missing.

To clone the repositories:

```bash
npm run clone
```

### Starting the services

A single Docker Compose project has been created that orchestrates all microservices, their dependencies, and performs any necessary setup tasks such as database migrations.

All configuration is stored in the `.env` file. Before starting the services, ensure that the `.env` file is configured correctly. See `.env.example` for an example.

If you need assistance with the `.env` values, refer to the [onboarding guide](#onboarding-guide) or ask another developer.

To start all services:

```bash
docker-compose up --build
```

To stop the services:

```bash
docker-compose down
```

Services can also be started individually from their respective repositories. This project provides a single entry point to streamline local development across services.

## Adding a new service

Adding a new service to the core project is partially automated. The `add-service` script scaffolds a new microservice Docker Compose snippet in the `service-compose` directory.

To add a new service:

```bash
npm run add-service
```

### Databases

For ease of local development we use a local instance of MongoDB.

## Script documentation

This repository includes a number of scripts to streamline local microservice development.

### Add Service

Scaffolds a new microservice Docker Compose project in the `service-compose` directory.

```bash
npm run add-service
```

### Clone

Clones the repositories for each microservice into the parent directory.

```bash
npm run clone
```

### Latest versions

List the latest GitHub release tag for each microservice.

```bash
npm run latest-versions
```

### Pull

Pull the latest remote changes for each microservice.

```bash
npm run pull
```

### Update

Switch to and pull the latest `main` branch for each microservice.

```bash
npm run update
```

## GitHub Copilot

Custom Copilot prompts, skills, and agents are stored in this core repository for use on any SFD service. The table below summarises the Copilot resources that are available.

| Resource | Copilot Type | Purpose | When to Use |
| --- | --- | --- | --- |
| [sonar-qube-cloud-fix](.github/agents/sonar-qube-cloud-fix.agent.md) | Agent | Runs the SonarQube Cloud local code scan, parses the output, and implements fixes for all identified code quality and security issues. | Use when a SonarQube Cloud scan fails, a quality gate is failing, or there are open bugs, vulnerabilities, code smells, or security hotspots to resolve. |
| [enhance-local-sfd-development-experience](.github/prompts/enhance-local-sfd-development-experience.prompt.md) | Prompt | Applies a standard set of local development enhancements to any SFD service. Covers migrating the linter from `standard` to `neostandard`, adding convenience Docker npm scripts, creating a Docker debug compose override, and setting up VS Code tasks. | Use when setting up or onboarding a new or existing SFD service with the team's standard local development tooling. |

## Getting started — environment and configuration

A minimal local environment requires Docker, Docker Compose and Node.js 22.13 LTS. After cloning, run:

```bash
npm install
```

Key environment variables (see `.env.example`):

- MONGO_URI — e.g. `mongodb://mongodb:27017/`
- AWS_ENDPOINT_URL — e.g. `http://localstack:4566` (or `http://floci:4566` when migrated)
- AWS_REGION / AWS_DEFAULT_REGION — e.g. `eu-west-2`
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY — local values (commonly `test`)
- PORT — service HTTP port

Example minimal `.env` (for local compose):

```ini
MONGO_URI=mongodb://mongodb:27017/
AWS_ENDPOINT_URL=http://localstack:4566
AWS_REGION=eu-west-2
AWS_DEFAULT_REGION=eu-west-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
PORT=3001
```

Notes:
- Scripts in this repo operate on sibling repositories expected to be checked out in the parent directory. Use `npm run clone` to fetch them if missing.
- Use `nvm` to switch to Node 22.13 LTS: `nvm use 22.13`

## Architecture overview

- Purpose: this repository provides a single entry point to orchestrate local development for all Single Front Door microservices.
- `compose.yaml` is the shared base compose file and includes `service-compose/*.yaml` snippets for each service.
- Each service snippet builds from a sibling repo using `../../<service-name>` as the Docker build context and typically mounts `src` and `package.json` from that repo for rapid local development.
- Local dependencies commonly include an AWS emulator (LocalStack or Floci), MongoDB and sometimes Redis. The Docker network name used across compose files is `fcp-sfd`.
- Container and image naming convention: `{service}-development`.