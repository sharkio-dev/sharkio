var proxy = require('express-http-proxy');
var app = require('express')();
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
var https = require('https')

function snifferMiddleWare(req, res, next) {
    console.log({ req: { ...req } })
    next();
}

const parsed = yargs(hideBin(process.argv)).command('sniff [HOSTNAME]', '- proxy and sniff requests to HOSTNAME', (yargs) => {
    return yargs
        .positional('port', {
            describe: 'port to bind on',
            default: 5000
        })
}, (argv) => {
    const { HOSTNAME } = argv;
    console.log({ argv })
    app.use(snifferMiddleWare);
    app.use('*', proxy(HOSTNAME));
    app.listen(5012, () => { console.log('server started listening') });
    console.log(`start sniffing requests for ${HOSTNAME}`)
}).parse();