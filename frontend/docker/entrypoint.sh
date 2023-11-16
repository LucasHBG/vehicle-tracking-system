#!/bin/bash
echo "$0: creating .env file"
cd /usr/app
if [ ! -f .env ]
then
	cp .env.example .env
fi