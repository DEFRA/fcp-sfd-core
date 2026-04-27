## Housekeeping

> ❗️All developers should read this section❗️

To keep your local environment running smoothly and avoid issues across our services, we recommend running housekeeping tasks regularly. This helps ensure you’re working with the latest code, dependencies, and shared setup.

### Core tasks

1. **⬇️ Down (SFD)** - stops and removes any running containers
1. **🧲 Latest (SFD)** - pulls the latest environment configuration
1. **🔄 Refresh (SFD)** - pulls the latest code across repositories
1. **⚙️ Update (SFD)** - installs the latest package updates
1. **⬆️ Up (SFD)** - starts the environment

### Additional tasks

- **🪄 Magic (SFD)** — runs any additional setup tasks that have been added to the repos (recommended to run regularly)
- **🙈 Ignore commits (SFD)** — applies `.git-blame-ignore-revs` where configured, helping keep `git blame` output clean (e.g. ignoring large formatting commits)

### Notes

- Environment variables are managed via Bitwarden, so there is no env sync step
- We do not run database migrations in SFD, as services rely on APIs rather than a shared database
- Not all repositories are required for all work. For example, the frontend can be run independently of other services

Current SFD repositories:
- `fcp-sfd-comms`
- `fcp-sfd-data`
- `fcp-sfd-frontend`
- `fcp-sfd-frontend-internal`

Run the tasks that are relevant to what you're working on, but aim to do a full housekeeping run regularly (e.g. weekly) to stay up to date.
