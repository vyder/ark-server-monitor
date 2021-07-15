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
```

## [LICENSE](https://github.com/vyder/ark-server-monitor/blob/master/LICENSE)
