#!/bin/bash

# Safer shell execution
# -e If a command fails, set -e will make the whole script exit, instead of just
#    resuming on the next line
# -u Treat unset variables as an error, and immediately exit
set -eu

# Helper that clones the various remote Git repositories used by the project
#
# Params
# $1 workspaceFolder passed in from vscode task
# $2 https url to clone the repo
function clone_repo {
  # Extracts the host, for example, github.com
  git_host=`echo $2 | awk -F/ '{print $3}'`

  # Extracts just the repo name, for example, fcp-sfd-frontend
  repo_dir=${2##*/}
  repo_dir=${repo_dir%%.git}

  # Combines the workspaceFolder with the repo name to create an absolute path to where we want to clone it to
  full_dir=$1/repos/$repo_dir

  # Check the repo doesn't already exist locally, then clone it
  if [[ ! -d $full_dir ]]; then
    echo "-- Getting ${repo_dir} from ${git_host} --"
    git clone $2 $full_dir
    printf "\n\n"
  fi
}

# $1 is passed in from vscode and represents the absolute path to the current project. In our case, $1 represents
# wherever a dev has fcp-sfd-core cloned on their machine

# Create a tmp folder we'll use to share files between the host and the dev environment that we don't want added to
# source control
# Note - Added to this script as there didn't seem any better place to put it, and we expect this to be the first script
# run when fcp-sfd-core is cloned
mkdir -p $1/tmp

# Get all the repos required for SFD
# Project repos that are the various micro-services that make up the SFD 'service'
clone_repo $1 https://github.com/defra/fcp-sfd-comms.git
clone_repo $1 https://github.com/defra/fcp-sfd-data.git
clone_repo $1 https://github.com/defra/fcp-sfd-frontend.git
clone_repo $1 https://github.com/defra/fcp-sfd-frontend-internal.git
clone_repo $1 https://github.com/defra/fcp-sfd-comms-publisher-stub.git
clone_repo $1 https://github.com/defra/fcp-sfd-crm.git
clone_repo $1 https://github.com/defra/fcp-sfd-messaging-gateway.git
clone_repo $1 https://github.com/defra/fcp-sfd-object-processor.git

echo "All done! 🎉"
