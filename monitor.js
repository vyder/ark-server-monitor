require('dotenv-yaml').config()
const config = require('./config')
const logger = require('./logger')(config)

const { Webhook } = require('discord-webhook-node')
const hook = new Webhook(config.HOOK_URL)

const Gamedig  = require('gamedig');
const SECONDS  = 1000
const INTERVAL = config.PING_INTERVAL * SECONDS

let serverStatus = null

logger.info(`Querying: ${config.HOST}:${config.PORT}...`)

const tellDiscord = msg => {
    if (config.ENABLE_DISCORD) {
        try {
            // hook.send(msg)
        } catch(error) {
            logger.error(`DISCORD:`, error)
        }
    }
    logger.info(`DISCORD: ${msg}`)
}

const query = () => Gamedig.query({ type: 'arkse', host: config.HOST, port: config.PORT })
    .then(state  => {
        logger.info(`Server is online: ${state.name}`)
        if (!serverStatus) {
            logger.info(`Notify...`)
            tellDiscord(`Server is online: ${state.name}`)
            serverStatus = state
        }
    })
    .catch(error => {
        logger.info("Server is offline")
        if (serverStatus) {
            logger.info(`Notify...`)
            tellDiscord(`Server is offline`)
            serverStatus = null
        }
    })

const ping = (fn, interval) => {
    fn()
    return setInterval(fn, interval)
}

const intervalId = ping(query, INTERVAL)
