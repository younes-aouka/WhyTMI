import pgPromise from "pg-promise";

const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL!);

// Export db instance
export { db,pgp };
