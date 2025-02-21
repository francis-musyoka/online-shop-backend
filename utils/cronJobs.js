const cron = require('node-cron');
const {clearExpiredGuestCarts} = require('../controller/guestCartController');

//  Runs everday 
cron.schedule('0 0 * * *', async() => {

    console.log('Running task: Clearing expired guest carts...');
    await clearExpiredGuestCarts();

});