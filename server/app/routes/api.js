module.exports = (app, express, pool, jwt, secret, bcrypt) => {
    const apiRouter = express.Router();

    apiRouter.route("/users").get(async (req, res) => {
        try {
            let conn = await pool.getConnection();
            res.json({
                status: "OK",
                users: await conn.query("SELECT * FROM Users;")
            });
        } catch (err) {
            console.log(err);
            res.json({ "status": "Error with the query" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }).post(async (req, res) => {
        bcrypt.hash(req.body.password, null, null, async (req, res) => {
            try {
                let conn = pool.getConnection();
                res.json({
                    "status": "OK",
                    insertId: await conn.query(
                        "INSERT INTO Users SET ?;",
                        {
                            username: req.body.username,
                            password: req.body.password,
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email
                        }
                    ).insertId
                });
            } catch (err) {
                console.log(err);
                res.json({ "status": "NOT OK" });
            } finally {
                if (conn) {
                    conn.release();
                }
            }
        });
    });

    apiRouter.route("/users/username").get(async (req, res) => {
        try {
            let conn = await pool.getConnection();
            if ((await conn.query(
                "SELECT * FROM Users WHERE username = ?;", req.params.username)).length === 0) {
                res.json({ "status": "OK" });
            } else {
                res.json({ "status": "NOT OK" });
            }
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    });

    apiRouter.use((req, res, next) => {
        // req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token
        let token = req.headers["x-access-token"];
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: "No token"
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No token"
            });
        }
    });

    return apiRouter;
};
