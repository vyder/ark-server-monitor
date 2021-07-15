require('dotenv-yaml').config()
const config = require('./config')

const { Webhook } = require('discord-webhook-node')
const hook = new Webhook(config.HOOK_URL)

const Gamedig  = require('gamedig');
const SECONDS  = 1000
const INTERVAL = config.PING_INTERVAL * SECONDS

let serverStatus = null

console.log(`Querying: ${config.HOST}:${config.PORT}...`)
let count = 1

const log = msg => {
    console.log(`${count}: ${msg}`)
    count += 1
}

const tellDiscord = (...args) => {
    if (config.ENABLE_DISCORD) {
        hook.send(...args)
    }
}

const query = () => Gamedig.query({ type: 'arkse', host: config.HOST, port: config.PORT })
    .then(state  => {
        log(`Server is online: ${state.name}`)
        if (!serverStatus) {
            console.log(`Notify...`)
            tellDiscord(`Server is online: ${state.name}`)
            serverStatus = state
        }
    })
    .catch(error => {
        log("Server is offline")
        if (serverStatus) {
            console.log(`Notify...`)
            tellDiscord(`Server is offline`)
            serverStatus = null
        }
    })

const ping = (fn, interval) => {
    fn()
    return setInterval(fn, interval)
}

const intervalId = ping(query, INTERVAL)
