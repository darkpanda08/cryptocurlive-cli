const program = require('commander')
const chec = require('../commands/check');
const check = require('../commands/check');

program
    .command('price')
    .description('Check price of coins')
    .option('--coin <type>', 'Add specific coin types in CSV format', 'BTC,ETH,XRP')
    .option('--cur <currency>', 'Change the currency', 'INR')
    .action(cmd => check.price(cmd))

program.parse(process.argv);