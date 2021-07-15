const createMonitor = require('./app/monitor')
const monitor = createMonitor()

monitor.start()
process.on('SIGINT', () => monitor.stop())
