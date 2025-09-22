import { jwtVerify } from "jose";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


export async function getUserId(cookies:ReadonlyRequestCookies):Promise<number|null>{
    const session = cookies.get("session");
    let userId: number | null = null;
    if (session) {
        const secret = new TextEncoder().encode(process.env.Private_Key);
        const { payload } = await jwtVerify(session.value, secret);
        userId = Number(payload.id); 
    }
    return userId
}