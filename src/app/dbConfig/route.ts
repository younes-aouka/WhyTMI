import { db, pgp } from "@/ConnectDB";


export async function GET(){
    try {
        const result = await db.query(`select * from account;`);
            console.log(result)
        return new Response('<h1>good!</h1>',{
            headers:{
                'Content-Type':'text/html'
            }
        })
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        pgp.end(); // closes the pool
    }
}