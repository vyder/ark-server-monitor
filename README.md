# ARK Server Monitor

A node process that monitors your ARK server and posts to your Discord when the server is up/goes down

## Getting Started

Run the following commands:

```
❯ git clone git@github.com:vyder/ark-server-monitor.git
❯ cd ark-server-monitor
❯ npm i
❯ npm install -g pm2
❯ cp sample.env.yml .env.yml
# Edit .env.yml with your configuration
❯ pm2 start pm2.config.js --env production
[PM2][WARN] Applications ark-monitor not running, starting...
[PM2] App [ark-monitor] launched (1 instances)
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ ark-monitor        │ fork     │ 0    │ online    │ 0%       │ 11.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

## [LICENSE](https://github.com/vyder/ark-server-monitor/blob/master/LICENSE)
