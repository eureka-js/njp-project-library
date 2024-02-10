module.exports = (express, pool, jwt, secret, bcrypt) => {
    const apiRouter = express.Router();
    const dateFormat = "%d/%m/%Y";

    apiRouter.route("/users").get(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            res.json({
                status: "OK",
                users: await conn.query(
                    `SELECT u.id, u.username, u.name, u.surname, u.email, mt.type AS memType, u.password
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
                return res.json({
                    "status": "NOT OK",
                    "description": "Username is already taken"
                });
            }

            bcrypt.hash(req.body.password, null, null, async (err, hash) => {
                let insertId = (await conn.query("INSERT INTO Users(username, password, name, surname, email) VALUES(?, ?, ?, ?, ?);",
                    [req.body.username, hash, req.body.name, req.body.surname, req.body.email])).insertId;
                let memType = await conn.query("SELECT * FROM MembershipTypes WHERE type = 'basic';");
                await conn.query("INSERT INTO Memberships(idMembershipType, idUser) VALUES(?, ?);", [memType[0].id, insertId]);

                res.json({
                    "status": "OK",
                    "insertId": insertId,
                    "memType": memType[0].type
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
                            "success": false,
                            "message": "Token error"
                        });
                    }
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                "success": false,
                "message": "No token"
            });
        }
    });

    apiRouter.route("/user/:id").delete(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query("DELETE FROM Memberships WHERE idUser = ?;", [req.params.id]);
            await conn.query("DELETE FROM Users WHERE id = ?;", [req.params.id]);

            res.json({ "status": "OK" });
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }).put(async (req, res) => {
                let conn;
        try {
            conn = await pool.getConnection();

            let userPass = (await conn.query("SELECT password FROM Users WHERE id = ?;", [req.params.id]))[0]?.password;
            if (!userPass) {
                return res.json({"status": "NOT OK" });
            }

            if (req.body.password === userPass || bcrypt.compareSync(req.body.password, userPass)) {
                await conn.query(
                    `UPDATE Users
                    SET username = ?, name = ?, surname = ?, email = ?
                    WHERE id = ?;`,
                    [req.body.username, req.body.name, req.body.surname, req.body.email, req.params.id]
                );

                res.json({
                    "status" : "OK",
                    "hashedPass": userPass
                });
            } else {
                bcrypt.hash(req.body.password, null, null, async (err, hash) => {
                    await conn.query(
                        `UPDATE Users
                        SET username = ?, name = ?, surname = ?, email = ?, password = ?
                        WHERE id = ?;`,
                        [req.body.username, req.body.name, req.body.surname, req.body.email, hash, req.params.id]
                    );

                    res.json({
                        "status" : "OK",
                        "hashedPass": hash
                    });
                })
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


    apiRouter.route("/userMemType/:id").put(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            let memType = (await conn.query(
                "SELECT * FROM MembershipTypes WHERE type <> ?;",
                [req.body.memType]
            ))[0];
            await conn.query(
                "UPDATE Memberships SET idMembershipType = ? WHERE idUser = ?;",
                [memType.id, req.params.id]
            );

            res.json({
                "status": "OK",
                "memType": memType.type
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

    apiRouter.route("/books").get(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            let books = await conn.query(
                `SELECT b.*,
                    g.type AS genreType,
                    a.name, a.surname,
                    c.id AS idCheckout, c.idMembership, c.idCheckoutDate,
                    DATE_FORMAT(cd.checkoutDate, "${dateFormat}") AS checkoutDate,
                        DATE_FORMAT(cd.returnDate, "${dateFormat}") AS returnDate,
                    m.idMembershipType, m.idUser,
                    mt.type AS memType
                FROM Books AS b LEFT JOIN
                    Genres AS g ON b.idGenre = g.id LEFT JOIN
                    Authors AS a ON b.idAuthor = a.id LEFT JOIN
                    Checkouts AS c ON b.id = c.idBook LEFT JOIN
                    CheckoutDates AS cd ON c.idCheckoutDate = cd.id LEFT JOIN
                    Memberships AS m ON c.idMembership = m.id LEFT JOIN
                    MembershipTypes AS mt ON m.idMembershipType = mt.id;`
            );

            res.json({
                "status": "OK",
                "books": books
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
            
            let genreInsertId = (await conn.query(
                "SELECT id AS insertId FROM Genres WHERE type = ?;",
                [req.body.genreType]
            ));
            if (genreInsertId.length === 0) {
                genreInsertId = [{ insertId: (await conn.query(
                    "INSERT INTO Genres(type) VALUES(?);",
                    [req.body.genreType]
                )).insertId }];
            }

            let authorInsertId = await conn.query(
                "SELECT id AS insertId FROM Authors WHERE name = ? AND surname = ?;",
                [req.body.authorName, req.body.authorSurname]
            );
            if (authorInsertId.length === 0) {
                authorInsertId = [{ insertId: (await conn.query(
                    "INSERT INTO Authors(name, surname) VALUES(?, ?);",
                    [req.body.authorName, req.body.authorSurname]
                )).insertId }];
            }

            let insertBookId = (await conn.query(
                "INSERT INTO Books(idGenre, idAuthor, title) VALUES(?, ?, ?);",
                [genreInsertId[0].insertId, authorInsertId[0].insertId, req.body.bookTitle]
            )).insertId;

            res.json({
                "status": "OK",
                "insertBookId": insertBookId,
                "insertGenreId": genreInsertId,
                "insertAuthorId": authorInsertId
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

    apiRouter.route("/book/:id").delete(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            let idsList = await conn.query("SELECT idGenre, idAuthor FROM Books WHERE id = ?;", [req.params.id]);
            if (idsList.length > 0) {
                await conn.query("DELETE FROM Books WHERE id = ?;", [req.params.id]);
                if ((await conn.query("SELECT COUNT(*) FROM Books WHERE idGenre = ?;", [idsList[0].idGenre]))[0]['COUNT(*)'] ==  0) {
                    await conn.query("DELETE FROM Genres WHERE id = ?", [idsList[0].idGenre]);
                }
                if ((await conn.query("SELECT COUNT(*) FROM Books WHERE idAuthor = ?;", [idsList[0].idAuthor]))[0]['COUNT(*)'] == 0) {
                    await conn.query("DELETE FROM Authors WHERE id = ?", [idsList[0].idAuthor]);
                }
            } else {
                res.json({ 
                    "status": "OK",
                    "description": "Book not found"
                });
            }

            res.json({ "status": "OK"});
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK" });
        } finally {
            if (conn) {
                conn.release();
            }
        }
    });

    apiRouter.route("/bookLend").put(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();

            if ((await conn.query("SELECT id FROM Checkouts WHERE idBook = ?;", [req.body.bookId])).length > 0) {
                return res.json({
                    "status": "NOT OK",
                    "description": "Book is already lent"
                });
            }

            let checkoutDate = new Date();
            let returnDate = (new Date(checkoutDate));
            returnDate.setMonth(returnDate.getMonth() + 1);
            checkoutDate = checkoutDate.toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric"});
            returnDate = returnDate.toLocaleString(undefined, { year: "numeric", month: "numeric", day: "numeric"});
            let chDateInsertId = await conn.query(
                `SELECT id AS insertId
                FROM CheckoutDates
                WHERE checkoutDate = STR_TO_DATE(?, "${dateFormat}") AND returnDate = STR_TO_DATE(?, "${dateFormat}");`,
                [checkoutDate, returnDate]
            );
            if (chDateInsertId.length === 0) {
                chDateInsertId = [{ insertId: (await conn.query(
                    `INSERT INTO CheckoutDates(checkoutDate, returnDate)
                    VALUES(STR_TO_DATE(?, "${dateFormat}"), STR_TO_DATE(?, "${dateFormat}"));`,
                    [checkoutDate, returnDate]
                )).insertId}];
            }

            await conn.query(
                `INSERT INTO Checkouts(idMembership, idBook, idCheckoutDate)
                VALUES(
                    (SELECT id FROM Memberships WHERE idUser = ? LIMIT 1),
                    ?, ?
                );`,
                [req.body.userId, req.body.bookId, chDateInsertId[0].insertId]
            );


            res.json({
                "status": "OK",
                "checkout": (await conn.query(
                    `SELECT c.id AS idCheckout, c.idMembership, c.idCheckoutDate,
                        DATE_FORMAT(cd.checkoutDate, "${dateFormat}") AS checkoutDate,
                            DATE_FORMAT(cd.returnDate, "${dateFormat}") AS returnDate,
                        m.idMembershipType, m.idUser
                    FROM Checkouts AS c INNER JOIN
                        CheckoutDates AS cd ON c.idCheckoutDate = cd.id INNER JOIN
                        Memberships AS m ON c.idMembership = m.id
                    WHERE c.idBook = ?;`,
                    [req.body.bookId]
                ))[0]
            });
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK"});
        } finally {
            if (conn) {
                conn.release();
            }
        }
    });

    apiRouter.route("/bookCheckout/:id").delete(async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();

            let chDateId = (await conn.query("SELECT idCheckoutDate FROM Checkouts WHERE idBook = ?;", [req.params.id]))[0].idCheckoutDate;
            if (chDateId) {
                await conn.query("DELETE FROM Checkouts WHERE idBook = ?;", [req.params.id]);
                if ((await conn.query("SELECT id FROM Checkouts WHERE idCheckoutDate = ?;",
                    [chDateId])).length === 0) {
                    await conn.query("DELETE FROM CheckoutDates WHERE id = ?;", [chDateId]);
                }
            }

            res.json({ "status": "OK" });
        } catch (err) {
            console.log(err);
            res.json({ "status": "NOT OK"});
        } finally {
            if (conn) {
                conn.release();
            }
        }
    });

    apiRouter.get("/me", (req, res) => res.send({ "status": "OK", "user": req.decoded }));

    return apiRouter;
};
