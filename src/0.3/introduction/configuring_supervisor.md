# Configuring Supervisor for UnoPIM



Supervisor is used to manage the job queue daemon for UnoPIM. Follow these steps to set it up.

## Step 1: Install Supervisor

1. Update your package manager:

   ```bash
   sudo apt update
   ```

2. Install Supervisor:

   ```bash
   sudo apt install supervisor
   ```

3. Verify the installation:

   ```bash
   supervisorctl status
   ```

---

## Step 2: Configure Supervisor for UnoPIM

1. Navigate to the Supervisor configuration directory:

   ```bash
   cd /etc/supervisor/conf.d
   ```

2. Create a configuration file named `unopim_queue_daemon.conf`:

   ```bash
   sudo nano /etc/supervisor/conf.d/unopim_queue_daemon.conf
   ```

3. Add the following content:

   ```ini
    [program:unopim-worker]
    command=/path/to/php /path/to/your/unopim/artisan queue:work --timeout=1800
    autostart=true
    autorestart=true
    user=my_user
    numprocs=8
    process_name=%(program_name)s_%(process_num)02d
    stderr_logfile=/var/log/unopim_worker.err.log
    stdout_logfile=/var/log/unopim_worker.out.log
    stopasgroup=true
   ```

   ### Notes:
   - Replace `/path/to/php` with the path to your PHP binary.
   - Replace `/path/to/your/unopim` with the installation directory of UnoPIM.
   - Replace `my_user` with the user that runs PHP-FPM (e.g., `www-data`).

---

## Step 3: Apply Changes

Run the following commands to apply the new Supervisor configuration:

```bash
$ supervisorctl reread
$ supervisorctl update
```

---

## Step 4: Start the Daemon

Start the UnoPIM queue daemon:

```bash
$ supervisorctl start unopim_queue_daemon
```

---

## Logs

- **Error Log**: `/var/log/unopim_worker.err.log`
- **Output Log**: `/var/log/unopim_worker.out.log`

Monitor these logs for troubleshooting and ensure the queue daemon runs as expected.