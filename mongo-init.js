db.createCollection("bikemapper", {});
db.createUser(
        {
            user: "mongo",
            pwd: "mongo",
            roles: [
                {
                    role: "readWrite",
                    db: "bikemapper"
                }
            ]
        }
);
