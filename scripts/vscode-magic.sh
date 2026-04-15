#!/bin/bash

# Safer shell execution
# -e If a command fails, set -e will make the whole script exit, instead of just
#    resuming on the next line
# -u Treat unset variables as an error, and immediately exit
set -eu

# Use when you quickly want to add or update VSCode magic

# Checks to see if the .vscode folder exists and create it if not
function add_magic {
  echo "-- Adding the magic to $2 --"
  mkdir -p $1/repos/$2/.vscode

  # If the file exists to copy, copy it!
  if [[ -e docs/vscode/$3.tasks.json ]] ; then
    cp docs/vscode/$3.tasks.json $1/repos/$2/.vscode/tasks.json
  fi

  if [[ -e docs/debug/$3.launch.json ]] ; then
    cp docs/debug/$3.launch.json $1/repos/$2/.vscode/launch.json
  fi

  echo "-- Copied files --"
  printf "\n\n"
}

# $1 is passed in from vscode and represents the absolute path to the current project

# Project repos that are to have the magic added
# The second argument refers to the prefix of the files in the debug and vscode folders respectively
add_magic $1 fcp-sfd-frontend
add_magic $1 fcp-sfd-frontend-internal
add_magic $1 fcp-dal-api


echo "All done! 🎉"
