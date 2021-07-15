require('dotenv-yaml').config()
const { HOST, PORT, HOOK_URL, ENABLE_DISCORD, PING_INTERVAL } = process.env

const { Webhook } = require('discord-webhook-node')
const hook = new Webhook(HOOK_URL)

const Gamedig  = require('gamedig');
const SECONDS  = 1000
const INTERVAL = PING_INTERVAL * SECONDS

let serverStatus = null

console.log(`Querying: ${HOST}:${PORT}...`)
let count = 1

const log = msg => {
    console.log(`${count}: ${msg}`)
    count += 1
}

const tellDiscord = (...args) => {
    if (ENABLE_DISCORD) {
        hook.send(...args)
    }
}

const query = () => Gamedig.query({ type: 'arkse', host: HOST, port: PORT })
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
