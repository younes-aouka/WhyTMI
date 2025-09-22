import { NextRequest,NextResponse } from "next/server";
import { ResetPasswordFormShema,resetPasswordFormValues,
        NewPasswordFormShema,NewPasswordFormValues } from "@/Shemas";
import { db } from "@/ConnectDB";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { sendResetingPasswordEmail } from "@/Mailing";
import bcrypt from "bcrypt";



export async function POST(req: NextRequest) {
  try {
    const data: resetPasswordFormValues = await req.json();
    const parsingResult = ResetPasswordFormShema.safeParse(data);
    if (parsingResult.success === true){
      const accountCheck = await db.oneOrNone(
        "SELECT * FROM account WHERE email= ${email}",
        { email: data.email.toLowerCase() }
      );
      if(accountCheck){
        const secret = new TextEncoder().encode(process.env.Private_Key);
        const token = await new SignJWT({ id: accountCheck.user_id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("5m")
        .sign(secret);
        await sendResetingPasswordEmail(accountCheck.email, token);
        return NextResponse.json({
          success: true,
          errors: {
            db: false,
            email: false,
          },
        });
      }else{
        return NextResponse.json({
          success: false,
          errors: {
            db: true,
            email: true,
          },
        });
      }
    }else {
      return NextResponse.json({
        success: false,
        errors: {
          db: false,
          email: true,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const data: NewPasswordFormValues = await req.json();
    const parsingResult = NewPasswordFormShema.safeParse(data);

    if (parsingResult.success === true) {
      let tokenVerificationResult = {
        success: true,
        userId: 0,
      };
      try {
        const secret = new TextEncoder().encode(process.env.Private_Key);
        const { payload } = await jwtVerify(data.token, secret);
        const { id } = payload as { id: number };
        tokenVerificationResult.userId = id;
      } catch (err) {
        tokenVerificationResult.success = false;
      }
      if(tokenVerificationResult.success === true) {
        data.password = await bcrypt.hash(data.password,5);
        await db.query(
          "UPDATE account SET password_hash = ${password} where user_id = ${userId}",
          { password: data.password, userId: tokenVerificationResult.userId }
        );
        return NextResponse.json({
          success: true,
          errors: {
            token: false,
            password: false,
            confirmPassword: false,
          },
        });
      }else {
        return NextResponse.json({
          success: false,
          errors: {
            token: true,
            password: false,
            confirmPassword: false,
          },
        });
      }
    }else {
      const errors = parsingResult.error.issues;
      const errorsPath = errors.map((err) => err.path[0]);

      return NextResponse.json({
        success: false,
        errors: {
          token: errorsPath.includes("token"),
          password: errorsPath.includes("password"),
          confirmPassword: errorsPath.includes("confirmPassword"),
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
}


