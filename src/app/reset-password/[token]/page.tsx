import { jwtVerify, errors,JWTPayload } from "jose";
import NewPasswordForm from "@/components/forms/NewPasswordForm";

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
    // you can use id if needed
  }catch (err: any) {
    result.success = false;
    if (err instanceof errors.JWTExpired) {
      result.errors.TokenExpiredError = true;
    }
    if (err instanceof errors.JWTInvalid || err instanceof errors.JWSSignatureVerificationFailed) {
      result.errors.JsonWebTokenError = true;
    }
  }

  if (result.success) {
    return <NewPasswordForm token={token} />;
  } else {
    return (
      <div className="h-[calc(100vh-4rem)] px-4 py-7">
        <section className="relative top-1/4 left-1/2 -translate-1/2 text-center">
          {result.errors.TokenExpiredError && (
            <p className="text-xl">
              please try to sign in again to get new link, this old link is expired ! &#128533;
            </p>
          )}
          {result.errors.JsonWebTokenError && (
            <p className="text-xl">
              Hi! please make sure you entered the correct link to activate your account &#128533;
            </p>
          )}
        </section>
      </div>
    );
  }
}
