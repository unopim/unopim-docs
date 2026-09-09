# Configuring Supervisor for UnoPim

The Supervisor and cron setup for UnoPim is documented in **[Queue & Scheduler Setup](queue-scheduler-setup)**.

That guide covers:

- Queue driver configuration (Redis, database, sync)
- Supervisor installation and configuration for Ubuntu/Debian and CentOS/RHEL
- Worker tuning (`--queue`, `--tries`, `--timeout`, `--max-jobs`, `--max-time`, `numprocs`)
- Cron entry for the Laravel scheduler
- Failed-job monitoring and queue-size inspection
- Common troubleshooting steps

For Docker installations, queue and scheduler containers are started automatically — see [Installation with Docker](installation-docker).
