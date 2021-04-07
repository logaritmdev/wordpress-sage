#!/bin/bash

ssh -p $REMOTE_SSH_PORT $REMOTE_SSH_USER@$REMOTE_SSH_HOST "mysqldump -u $REMOTE_DB_USER -p\"$REMOTE_DB_PASS\" $REMOTE_DB_NAME > /tmp/dump.sql"
scp -P $REMOTE_SSH_PORT $REMOTE_SSH_USER@$REMOTE_SSH_HOST:/tmp/dump.sql dump.sql

sed -i '' "s/$REMOTE_DOMAIN/$APP_NAME.test/g" dump.sql

docker exec -i "$APP_NAME-mysql" mysql --user=$DB_USER --password=$DB_PASS $DB_NAME < dump.sql

rm dump.sql