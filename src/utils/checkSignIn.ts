import { jwtVerify } from "jose";

type Session = {
  name: string;
  value: string;
};

export async function checkSignIn(session: Session | undefined): Promise<boolean> {
  if (!session) return false;

  try {
    const secret = new TextEncoder().encode(process.env.Private_Key);
    await jwtVerify(session.value, secret);
    return true;
  } catch {
    return false;
  }
}
