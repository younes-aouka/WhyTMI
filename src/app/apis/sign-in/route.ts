import { NextRequest,NextResponse } from "next/server";
import { SignInFormShema,SignInFormValues } from "@/Shemas";
import { db } from "@/ConnectDB";
import { SignJWT } from "jose";
import { sendVerificationEmail } from "@/Mailing";
import bcrypt from "bcrypt";

export async function POST(req:NextRequest) {
    try{
        const data:SignInFormValues = await req.json();
        const parsingResult = SignInFormShema.safeParse(data);
        if(parsingResult.success===true){
            const accountCheck = await db.oneOrNone(
            'SELECT * FROM account WHERE email= ${email};',
            { email: data.email.toLowerCase(), password: data.password.toLowerCase()});
            if(accountCheck){
                const {password_hash} = accountCheck ;
                const match = await bcrypt.compare(data.password,password_hash);
                if(match){
                    if(accountCheck.is_verified){
                        const response = NextResponse.json({
                            success:true,
                            email_verified:true,
                            errors:{
                                db: false,
                                email: false,
                                password: false
                            }                         
                        });
                        const secret = new TextEncoder().encode(process.env.Private_Key);
                        const token = await new SignJWT({ id: accountCheck.user_id })
                        .setProtectedHeader({ alg: "HS256" })
                        .setExpirationTime("60d") // same as expiresIn
                        .sign(secret);
                        response.cookies.set({
                            name: 'session',
                            value: token,
                            maxAge: 60 * 60 * 24 * 60,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: 'lax'
                        })
                        return response ;
                    }else{
                        //send a verification code to his email 
                        const secret = new TextEncoder().encode(process.env.Private_Key);
                        const token = await new SignJWT({ id: accountCheck.user_id })
                        .setProtectedHeader({ alg: "HS256" })
                        .setExpirationTime("60m") // 5 minutes
                        .sign(secret);
                        await sendVerificationEmail(accountCheck.email, token);
                        // redirect him to a page that said the verification code is sented
                        return  NextResponse.json({
                            success: true,
                            email_verified: false,
                            errors:{
                                db: false,
                                email: false,
                                password: false
                            }                        
                        });
                    }
                }else{
                    return NextResponse.json({
                        success:false,
                        email_verified:null,
                        errors:{
                            db: true,
                            email: false,
                            password: true
                        }                         
                    });                    
                } 
            }else{
                return  NextResponse.json({
                    success: false,
                    email_verified: null,
                    errors:{
                        db: true,
                        email: true,
                        password: null
                    } 
                }); 
            } 
        }else{
            const errors = parsingResult.error.issues
            const errorsPath = errors.map((err)=>{
                return err.path[0] ;
            })
            return  NextResponse.json({
                success: false,
                email_verified: null,
                errors:{
                    db:null, 
                    email: errorsPath.includes("email"),
                    password: errorsPath.includes("password")
                    } 
                });        
        }
    }catch(e){
        console.log(e);
    }

}