require('dotenv-yaml').config()
const config = require('./config')
const logger = require('./logger')(config)

const { Webhook, MessageBuilder } = require('discord-webhook-node')
const hook = new Webhook(config.HOOK_URL)

const Gamedig  = require('gamedig');
const SECONDS  = 1000
const INTERVAL = config.PING_INTERVAL * SECONDS

const createMonitor = () => {
    let serverStatus = null

    const notifyDiscord = ({ serverIsUp, state }) => {
        if (config.ENABLE_DISCORD) {
            const message = new MessageBuilder()

            if (!serverIsUp) {
                message.setTitle('Server is offline')
                message.setColor("#E53E3E")

            } else {
                const nameText = state.name + (state.map ? ` - [${state.map}]` : '')
                message.setTitle('Server is online')
                message.setColor("#38A169")
                message.addField(nameText, state.connect)
                message.addField("Ping", state.ping)
            }

            hook.send(message)
            .then(() => logger.info("Discord Notification sent"))
            .catch(error => logger.error("Discord Error: ", JSON.stringify(error, null, 2)))

        } else {
            logger.info(`ENABLE_DISCORD: false, serverIsUp: ${serverIsUp}, state: ${JSON.stringify(state, null, 2)}`)
        }
    }

    const query = () => Gamedig.query({ type: 'arkse', host: config.HOST, port: config.PORT })
        .then(state  => {
            logger.info(`Server is online: ${state.name}`)
            if (!serverStatus) {
                logger.info(`Notify...`)
                notifyDiscord({ serverIsUp: true, state })
                serverStatus = state
            }
        })
        .catch(error => {
            logger.info("Server is offline", JSON.stringify(error, null, 2))
            if (serverStatus) {
                logger.info(`Notify...`)
                notifyDiscord({ serverIsUp: false })
                serverStatus = null
            }
        })

    const ping = (fn, interval) => {
        logger.info(`Querying: ${config.HOST}:${config.PORT}...`)
        fn()
        return setInterval(fn, interval)
    }

    let intervalId = null
    const start = () => {
        intervalId = ping(query, INTERVAL)
    }
    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
            logger.info("Stopped")
        }
    }

    return { start, stop }
}

module.exports = createMonitor
