import { jwtVerify,JWTPayload } from "jose";
import { db } from "@/ConnectDB";
type Session = { name: string; value: string; };
interface MyTokenPayload extends JWTPayload { id: number; }

export async function checkSignInNonMiddlware(session: Session | undefined): Promise<boolean> {
    if (!session) return false;
    try {
        const secret = new TextEncoder().encode(process.env.Private_Key);
        const { payload } = await jwtVerify(session.value, secret);
        const { id } = payload as MyTokenPayload; 
        const exist = await db.oneOrNone('select true from account where user_id = ${id}',{id:id}); 
        if(exist) return true
        return false; 
    } catch { 
        return false; 
    } 
}