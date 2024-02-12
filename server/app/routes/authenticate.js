module.exports = (express, pool, jwt, secret, bcrypt) => {
    const authRouter = express.Router();

    authRouter.use(async (req, res, next) => {
        // req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token
        let token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.json({ "status": "NOT OK", "description": "Token expired" });
                    } else {
                        res.status(403).send({
                            "success": false,
                            "message": "Token error"
                        });
                    }
                } else {
                    let conn;
                    try {
                        conn = await pool.getConnection();

                        let userList = await conn.query("SELECT * FROM Users WHERE username = ?;", [req.body.username]);
                        let user = {
                            id: userList[0].id,
                            username: userList[0].username,
                            name: userList[0].name,
                            surname: userList[0].surname,
                            email: userList[0].email,
                            memType: (await conn.query(
                                "SELECT type FROM MembershipTypes WHERE id = ?;",
                                [(await conn.query(
                                    "SELECT idMembershipType FROM Memberships WHERE idUser = ?;",
                                    userList[0].id
                                ))[0].idMembershipType]
                            ))[0].type,
                            hashedPass: userList[0].password
                        }
                        res.json({
                            "status": "OK",
                            "token": jwt.sign(user, secret, { expiresIn: 1440 }),
                            "user": user
                        });
                    } catch (err) {
                        console.log(err);
                        res.json({ "status": "Error with the query" });
                    } finally {
                        if (conn) {
                            conn.release();
                        }
                    }
                }
            });
        } else {
            next();
        }
    })

    authRouter.post('/', async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();

            let userList = await conn.query("SELECT * FROM Users WHERE username = ?;", [req.body.username]);
            if (userList.length == 0) {
                res.json({ "status": "NOT OK", "description": "Username doesn't exist"});
            } else if (bcrypt.compareSync(req.body.password, userList[0].password)) {
                let idMembTypeList = await conn.query(
                    "SELECT idMembershipType FROM Memberships WHERE idUser = ?;",
                    userList[0].id
                );
                if (idMembTypeList.length == 0) {
                    res.json({ "status": "NOT OK", "description": "Membership non existant"});
                } else {
                    let user = {
                        id: userList[0].id,
                        username: userList[0].username,
                        name: userList[0].name,
                        surname: userList[0].surname,
                        email: userList[0].email,
                        memType: (await conn.query(
                            "SELECT type FROM MembershipTypes WHERE id = ?;",
                            [idMembTypeList[0].idMembershipType]))[0].type,
                        hashedPass: userList[0].password
                    }
                    res.json({
                        "status": "OK",
                        "token": jwt.sign(user, secret, { expiresIn: 1440 }),
                        "user": user
                    });
                }
            } else {
                res.json({ "status": "NOT OK", "description": "Wrong password"});
            }
        } catch (err) {
            console.log(err);
            res.json({ "status": "Error with the query" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    })

    return authRouter;
};
