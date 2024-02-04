module.exports = {
    port: process.env.PORT || 6600,
    pool: {
        connectionLimit: 100,
        host: "localhost",
        user: "root",
        database: "library",
        debug: false
    },
    secret: "craftingclearcodepromotesmaintainabilityandreadability"
};
