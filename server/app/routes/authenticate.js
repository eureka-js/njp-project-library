module.exports = (express, pool, jwt, secret, bcrypt) => {
    const authRouter = express.Router();

    authRouter.post('/', async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();

            let userList = await conn.query("SELECT * FROM Users WHERE username = ?;", req.body.username);
            if (userList.length == 0) {
                res.json({ "status": "NOT OK", "description": "Username doesn't exist"});
            } else if (bcrypt.compareSync(req.body.credentials.password, userList[0].password)) {
                let membList = await conn.query(
                    "SELECT idMemberShipType FROM Memberships WHERE idUser = ?;",
                     userList[0].id
                );
                if (membList.length == 0) {
                    res.json({ "status": "NOT OK", "description": "Membership non existant"});
                } else {
                    res.json({
                        "status": "OK",
                        "token": jwt.sign({
                            id: userList[0].id,
                            username: userList[0].username,
                            name: userList[0].name,
                            surname: userList[0].surname,
                            email: userList[0].email,
                            membType: (await conn.query(
                                "SELECT type FROM MembershipTypes WHERE id = ?;",
                                membList[0].idMembershipType
                            )),
                        }, secret, { expiresIn: 1440 })
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
    });

    return authRouter;
};
