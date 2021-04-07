#!/usr/bin/env bash
if [ -f "./backup/mysql.sql.gz" ]; then
    bash ./docker/util/message.sh info "Restoring ./backup/mysql.sql.gz"
    zcat "backup/mysql.sql.gz" | docker exec -i $(docker-compose ps -q db) mysql -u root -ppassword wp
    echo "FLUSH PRIVILEGES;" | docker exec -i $(docker-compose ps -q db) mysql -u root -ppassword
    bash ./docker/util/message.sh success "Restore successful!"
else
    bash ./docker/util/message.sh info "No backup found: backup/mysql.sql.gz"
fi
