#!/usr/bin/env bash

HOST=$1

if [ -n "$(grep $HOST /etc/hosts)" ]; then

    bash ./docker/util/message.sh info "Host $HOST already present in hosts file."

else

	sudo -- sh -c -e "echo '127.0.0.1\t$HOST' >> /etc/hosts"

	if [ -n "$(grep $HOST /etc/hosts)" ]; then
		bash ./docker/util/message.sh success "Host $HOST added to hosts file."
	fi

fi