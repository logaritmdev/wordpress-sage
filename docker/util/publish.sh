#!/bin/bash

PWD=$(dirname $0)

cd "$THEME_PATH"
npm run build:prod
cd "$PWD"

rsync -avzh --exclude node_modules -e "ssh -p $REMOTE_SSH_PORT" "$THEME_PATH" $REMOTE_SSH_USER@$REMOTE_SSH_HOST:"$REMOTE_THEME_PATH"