import { jwtVerify, errors,JWTPayload } from "jose";
import { db } from "@/ConnectDB";

interface MyTokenPayload extends JWTPayload {
  id: number;
}

export default async function page({ params }: { params: Promise<{ token: string }> }) {
  const result = {
    success: true,
    errors: {
      TokenExpiredError: false,
      JsonWebTokenError: false,
    },
  };

  const { token } = await params;

  try {
    const secret = new TextEncoder().encode(process.env.Private_Key);
    const { payload } = await jwtVerify(token, secret);
    const { id } = payload as MyTokenPayload;

    await db.query("update account SET is_verified = true WHERE user_id = ${id}", { id });
  } catch (err: any) {
    result.success = false;
    if (err instanceof errors.JWTExpired) {
      result.errors.TokenExpiredError = true;
    }
    if (err instanceof errors.JWTInvalid || err instanceof errors.JWSSignatureVerificationFailed) {
      result.errors.JsonWebTokenError = true;
    }
  }

  if (result.success) {
    return (
        <section className='flex flex-col items-center text-center gap-4 pt-10'>
            <h2 className='max-w-[400px] bg-orange-200 text-2xl font-semibold border-2 border-black border-solid p-2 rounded-lg'>Account activated successfully &#9989;</h2>
        </section>
    );
  } else {
    return (
      <div className="h-[calc(100vh-4rem)] px-4 py-7">
        <section className="relative top-1/4 left-1/2 -translate-1/2 text-center">
          {result.errors.TokenExpiredError && (
            <p className="text-xl">
              please try to sign in again to get new link, this old link is expired !
            </p>
          )}
          {result.errors.JsonWebTokenError && (
            <p className="text-xl">
              Hi! please make sure you entered the correct link to activate your account
            </p>
          )}
        </section>
      </div>
    );
  }
}
