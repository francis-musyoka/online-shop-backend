
const db = require('./database');
const {Wishlist,Cart,GuestCart,OrderCounter,sequelize} = db;

const generateOrderNumber = async () => {
    return await sequelize.transaction(async (t) => {
            const counter = await OrderCounter.findOrCreate({
            where: { id: 1 }, 
            defaults: { current: 100000 },
            transaction: t
            });
            const currentCount = counter.count;
            counter.count += 1;
            await counter.save({ transaction: t });

            const now = new Date();
            const yymm = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
            const randomTwo = Math.floor(Math.random() * 90 + 10);

            return `RF${yymm}${currentCount}${randomTwo}`;

    });
};

