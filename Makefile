ARGS = $(filter-out $@,$(MAKECMDGOALS))
MAKEFLAGS += --silent

#############################
# ENVIRONMENT
#############################

export APP_NAME=EXAMPLE
export DB_HOST=mysql
export DB_NAME=wp
export DB_USER=wp
export DB_PASS=password

export THEME_PATH=/site/web/app/themes/sage/
export UPLOAD_PATH=/site/web/app/uploads/

export REMOTE_DB_USER=xxx
export REMOTE_DB_PASS=xxx
export REMOTE_DB_NAME=xxc
export REMOTE_DOMAIN=domain.com

export REMOTE_SSH_HOST=domain.com
export REMOTE_SSH_USER=user
export REMOTE_SSH_PORT=22

export REMOTE_THEME_PATH=/home/public_html/wp-content/themes/sage/
export REMOTE_UPLOAD_PATH=/home/public_html/wp-content/uploads/

#############################
# CONTAINER ACCESS
#############################

up:
	bash ./docker/util/message.sh info "Starting your project..."
	docker-compose up -d
	make insert-hosts
	make urls

stop:
	bash ./docker/util/message.sh info "Stopping your project..."
	docker-compose stop
	make remove-hosts

destroy: stop
	bash ./docker/util/message.sh info "Deleting all containers..."
	docker-compose down --rmi all --remove-orphans

upgrade:
	bash ./docker/util/message.sh info "Upgrading your project..."
	docker-compose pull
	docker-compose build --pull
	make composer update
	make up

restart: stop up

rebuild: destroy upgrade

remove:
	docker ps -a -q | xargs docker rm

#############################
# UTILS
#############################

mysql-backup:
	bash ./docker/util/mysql-backup.sh

mysql-restore:
	bash ./docker/util/mysql-restore.sh

#############################
# CONTAINER ACCESS
#############################

ssh:
	docker exec -it $$(docker-compose ps -q $(ARGS)) /bin/bash

#############################
# INFORMATION
#############################

urls:
	bash ./docker/util/message.sh headline "You can access your project at the following URLS:"
	bash ./docker/util/message.sh link "Backend:     http://${APP_NAME}.test/wp/wp-admin/"
	bash ./docker/util/message.sh link "Frontend:    http://${APP_NAME}.test/"
	bash ./docker/util/message.sh link "Mailhog:     http://mail.${APP_NAME}.test:8025"
	bash ./docker/util/message.sh link "PHPMyAdmin:  http://phpmyadmin.${APP_NAME}.test:1080"
	echo ""

#############################
# HOSTS
#############################

insert-hosts:
	sudo bash ./docker/util/insert-host.sh ${APP_NAME}.test
	sudo bash ./docker/util/insert-host.sh mail.${APP_NAME}.test
	sudo bash ./docker/util/insert-host.sh phpmyadmin.${APP_NAME}.test

remove-hosts:
	sudo bash ./docker/util/remove-host.sh ${APP_NAME}.test
	sudo bash ./docker/util/remove-host.sh mail.${APP_NAME}.test
	sudo bash ./docker/util/remove-host.sh phpmyadmin.${APP_NAME}.test

state:
	docker-compose ps

logs:
	docker-compose logs -f --tail=50 $(ARGS)

#############################
# Publish / Import
#############################

publish:
	bash ./docker/util/message.sh headline "Publishing"
	bash ./docker/util/publish.sh

import:
	bash ./docker/util/message.sh headline "Import database and uploaded files"
	bash ./docker/util/import-db.sh
	bash ./docker/util/import-upload.sh

import-db:
	bash ./docker/util/message.sh headline "Import database"
	bash ./docker/util/import-db.sh

import-upload:
	bash ./docker/util/message.sh headline "Import uploaded files..."
	bash ./docker/util/import-upload.sh

#############################
# Argument fix workaround
#############################

%:
	@:
