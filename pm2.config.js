module.exports = {
    apps: [{
        name: "ark-monitor",
        script: "./index.js",
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        },
    }]
}
