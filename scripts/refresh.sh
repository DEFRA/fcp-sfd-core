#!/bin/bash

# Safer shell execution
# -e If a command fails, set -e will make the whole script exit, instead of just
#    resuming on the next line
# -u Treat unset variables as an error, and immediately exit
set -eu

# Use when you guickly want to switch everything back to the main branch and pull the latest code

# Helper drops into a named folder, checks out `main` (or `master`) and then runs git pull
function refresh_repo {
  # Combines the workspaceFolder with the repo name to create an absolute path to where we need to run the refresh
  cd $1/repos/$2

  echo "-- Refreshing $2 --"
  if git show-ref --quiet refs/heads/main; then
    git checkout main
  else
    git checkout master
  fi
  git pull
  printf "\n\n"

  cd $1
}

# Project repos that are the various micro-services that make up the SFD 'service'
refresh_repo $1 fcp-sfd-comms
refresh_repo $1 fcp-sfd-frontend
refresh_repo $1 fcp-sfd-frontend-internal
refresh_repo $1 fcp-sfd-comms-publisher-stub
refresh_repo $1 fcp-sfd-crm
refresh_repo $1 fcp-sfd-object-processor

echo "All done! 🎉"
