#!/bin/bash

echo "If this doesn't work run ssh-add -K on the host machine"

rsync -avzh -e "ssh -p 18765" $REMOTE_SSH_USER@$REMOTE_SSH_HOST:"$REMOTE_UPLOAD_PATH" "$UPLOAD_PATH"