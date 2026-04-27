# Single Front Door Core
Local development support for orchestrating all Single Front Door microservices.

## Prerequisites
* Docker
* Docker Compose
* Node.js 22.13 LTS - We recommend using [NVM](https://github.com/nvm-sh/nvm) for Unix-based systems or [NVM-Windows](https://github.com/coreybutler/nvm-windows).

## Onboarding Guide

For new software developers joining the SFD team, there is an [onboarding guide](https://github.com/DEFRA/fcp-sfd-core/blob/main/onboarding-guide/README.md) with useful links to help you get started.

## Housekeeping

> ❗️All developers should run housekeeping regularly ❗️

To keep your local environment up to date and avoid issues across our repos, we recommend running the housekeeping tasks on a regular basis. These tasks ensure you’re working with the latest code, dependencies, and configuration used across the team.

We use VS Code tasks to run housekeeping. Please see [`housekeeping/README.md`](./housekeeping/README.md) for full instructions on how to run them and what each task does.

## Repositories
| Service | Type | Quality gate |
| --- | --- | --- |
| [fcp-sfd-comms](https://github.com/defra/fcp-sfd-comms) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-comms&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-comms) |
| [fcp-sfd-data](https://github.com/defra/fcp-sfd-data) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-data&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-data) |
| [fcp-sfd-frontend](https://github.com/defra/fcp-sfd-frontend) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend) |
| [fcp-sfd-frontend-internal](https://github.com/defra/fcp-sfd-frontend-internal) | Customer | [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend-internal&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend-internal) |

## Local Development

You will need to clone this repository before running any scripts.
```bash
git clone https://github.com/DEFRA/fcp-sfd-core

cd fcp-sfd-core

npm install
```

### Cloning Repositories
This project contains a script to clone all the required repositories. This works by checking the service-compose directory for the services and cloning them if they do not exist.

To clone the repositories, run the following command:

```bash
npm run clone
```

### Starting the Services
A single docker-compose project has been created that orchestrates all microservices, dependencies, and performs any necessary setup tasks such as database migrations.

All configuration is stored in the `.env` file. Before starting the services, ensure that the `.env` file is correctly configured. See the `.env.example` file for an example configuration.

If you need assistance with finding the correct values for the `.env` file, please refer to the [onboarding guide](#onboarding-guide) or ask another developer for help.

To start all services, run the following command:

```bash
docker-compose up --build
```

To stop the services, run the following command:

```bash
docker-compose down
```

The services can still be started individually directly from their respective repositories. However, this project is intended to streamline local development by having a common entry point for all services.

## Adding a New Service
Adding a new service to the core project is partially automated. The `add-service` script will scaffold a new microservice docker-compose project in the `service-compose` directory.

To add a new service, run the following command:

```bash
npm run add-service
```

### Databases
For the ease of local development we are using local instance of mongoDB


## Script Documentation
This project contains a number of scripts to streamline local microservice development.

### Add Service
Scaffolds a new microservice docker-compose project in the `service-compose` directory.

```bash
npm run add-service
```

### Clone
Clones the repositories for each microservice into the parent directory.

```bash
npm run clone
```

### Latest Versions
List latest GitHub release version for each microservice.

```bash
npm run latest-versions
```

### Pull
Pulls the latest remote changes for each microservice.

```bash
npm run pull
```

### Update
Switches to and pulls the latest main branch for each microservice.

```bash
npm run update
```

## GitHub Copilot

Custom Copilot prompts, skills, and agents are stored here on the core repo for use on any SFD service. The table below summarises the current Copilot resources that are available.
| Resource | Copilot Type | Purpose | When to Use |
| --- | --- | --- | --- |
| [sonar-qube-cloud-fix](.github/agents/sonar-qube-cloud-fix.agent.md) | Agent | Runs the SonarQube Cloud local code scan, parses the output, and implements fixes for all identified code quality and security issues. | A SonarQube Cloud scan fails, a quality gate is failing, or there are open bugs, vulnerabilities, code smells, or security hotspots to resolve. |
| [enhance-local-sfd-development-experience](.github/prompts/enhance-local-sfd-development-experience.prompt.md) | Prompt | Applies a standard set of local development enhancements to any SFD service. Covers migrating the linter from `standard` to `neostandard`, adding convenience Docker npm scripts, creating a Docker debug compose override, and setting up VS Code tasks. | Setting up or onboarding a new or existing SFD service with the team's standard local development tooling. |
