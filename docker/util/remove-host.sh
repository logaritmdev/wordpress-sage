#!/usr/bin/env bash

HOST=$1
LINE="127.0.0.1\t$HOST"

if [ -n "$(grep $HOST /etc/hosts)" ]; then

	sudo sed -i '' "/$HOST/d" /etc/hosts

	if [ -z "$(grep $HOST /etc/hosts)" ]; then
		bash ./docker/util/message.sh success "Host $HOST removed from hosts file."
	fi

fi
