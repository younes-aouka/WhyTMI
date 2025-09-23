import pgPromise from "pg-promise";

// dev mode
// const pgp = pgPromise();
// const db = pgp({
//   host: "localhost",
//   port: 5432,
//   database: process.env.Database_Name,
//   user: process.env.User_Name,
//   password: process.env.Database_Password,
// });
// export { db };

// production mode
const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL!);
export { db,pgp };