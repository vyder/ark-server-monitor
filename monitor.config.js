module.exports = {
    apps: [{
        name: "ark-server-monitor",
        script: "./monitor.js",
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        },
    }]
}
