.PHONY: setup up down restart logs status send-sample test clean

COMPOSE = docker compose

setup:
	@if [ ! -f .env ]; then cp .env.example .env 2>/dev/null || touch .env; fi

up: setup
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

status:
	$(COMPOSE) ps

send-sample:
	@echo "Sending sample logs to Ingestion API..."
	python3 samples/post_logs.py
	@if [ -f samples/send_syslog.sh ]; then bash samples/send_syslog.sh; fi
