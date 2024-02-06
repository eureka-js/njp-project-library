module.exports = {
    port: process.env.PORT || 6600,
    pool: {
        connectionLimit: 100,
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "library",
        debug: false
    },
    secret: "craftingclearcodepromotesmaintainabilityandreadability"
};
