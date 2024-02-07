module.exports = (express, pool, jwt, secret, bcrypt) => {
    const apiRouter = express.Router();

    apiRouter.route("/users").get(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            res.json({
                status: "OK",
                users: await conn.query(
                    `SELECT u.*, mt.type
                    FROM Users AS u INNER JOIN
                        Memberships AS m ON u.id = m.idUser INNER JOIN
                        MembershipTypes AS mt ON m.idMembershipType = mt.id;`
                )
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
        let conn;
        try {
            conn = await pool.getConnection();
            
            if ((await conn.query("SELECT id FROM Users WHERE username = ?", [req.body.username])).length > 0) {
                return res.json({ "status": "NOT OK", "description": "Username is already taken" });
            }

            bcrypt.hash(req.body.password, null, null, async (err, hash) => {
                let insertId = (await conn.query("INSERT INTO Users(username, password, name, surname, email) VALUES(?, ?, ?, ?, ?);",
                    [req.body.username, hash, req.body.name, req.body.surname, req.body.email])).insertId;
                let memType = await conn.query("SELECT * FROM MembershipTypes WHERE type = 'basic';");
                await conn.query("INSERT INTO Memberships(idMembershipType, idUser) VALUES(?, ?);", [memType[0].id, insertId]);

                res.json({
                    "status": "OK",
                    insertId: insertId,
                    memType: memType[0].type
                });
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

    apiRouter.route("/users/username").get(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
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
        let token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.json({ "status": "NOT OK", "description": "Token expired" });
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "Token error"
                        });
                    }
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

    apiRouter.route("/books").get(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            let books = await conn.query(
                `SELECT b.*, g.*, a.* 
                FROM Books AS b INNER JOIN
                    Genres AS g ON b.idGenre = g.id INNER JOIN
                    Authors AS a ON b.idAuthor = a.id;`
            );

            res.json({
                "status": "OK",
                books: books
            });
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }).post(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            
            let insertGenreId = (await conn.query(
                "SELECT id FROM Genres WHERE type = ?;",
                [req.body.genreType]
            ))[0].id;
            if (!insertGenreId) {
                insertGenreId = (await conn.query(
                    "INSERT INTO Genres(type) VALUES(?);",
                    [req.body.genreType]
                )).insertId;
            }

            let insertAuthorId = (await conn.query(
                "SELECT id FROM Authors WHERE name = ? AND surname = ?;",
                [req.body.authorName, req.body.authorSurname]
            ))[0].id;
            if (!insertAuthorId) {
                insertAuthorId = (await conn.query(
                    "INSERT INTO Authors(name, surname) VALUES(?, ?);",
                    [req.body.authorName, req.body.authorSurname]
                )).insertId;
            }

            let insertBookId = (await conn.query(
                "INSERT INTO Books(idGenre, idAuthor, title) VALUES(?, ?, ?);",
                [insertGenreId, insertAuthorId, req.body.bookTitle]
            )).insertId;

            res.json({
                "status": "OK",
                insertBookId: insertBookId,
                insertGenreId: insertGenreId,
                insertAuthorId: insertAuthorId
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

    apiRouter.get("/me", (req, res) => res.send({ status: "OK", user: req.decoded }));

    return apiRouter;
};
