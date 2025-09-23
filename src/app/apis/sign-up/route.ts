import { NextRequest,NextResponse } from "next/server";
import { SignUpFormShema,SignUpFormValues } from "@/Shemas";
import { db } from "@/ConnectDB";
import { sendVerificationEmail } from "@/Mailing";
import { SignJWT } from "jose";
import bcrypt from "bcrypt"

export async function POST(req:NextRequest) {
    try{
        const data:SignUpFormValues = await req.json();
        const parsingResult = SignUpFormShema.safeParse(data);
        if(parsingResult.success===true){
            const fullNameCheck = await db.oneOrNone(
            'SELECT true AS exist FROM account WHERE full_name ILIKE ${full_name}',
            { full_name: data.fullName});
            const emailCheck = await db.oneOrNone(
            'SELECT true AS exist FROM account WHERE email ILIKE ${email}',
            { email: data.email})            
            if(fullNameCheck===null&&emailCheck===null){
                data.password = await bcrypt.hash(data.password,Number(process.env.BCRYPT_SALT_ROUNDS)) ;
                const {user_id} = await db.one('INSERT INTO account(full_name,email,password_hash) values (${fullName},${email},${password}) RETURNING user_id',
                {fullName: data.fullName,email:data.email,password:data.password}) ;
                //sent a verification code to his email
                const secret = new TextEncoder().encode(process.env.Private_Key);
                const token = await new SignJWT({ id: user_id })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("60m") // 5 minutes
                .sign(secret);
                await sendVerificationEmail(data.email, token);
                return NextResponse.json({
                    success:true,
                    errors:{
                        db: false,
                        fullName: false,
                        email: false,
                        password: false,
                        confirmPassword: false,                        
                    }                    
                });                               
            }else{
                return  NextResponse.json({
                    success: false,
                    errors:{
                        db: true,
                        fullName: !(fullNameCheck===null),
                        email: !(emailCheck===null),
                        password: false,
                        confirmPassword: false,
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
                errors:{
                    db:null, 
                    fullName: errorsPath.includes("fullName"),
                    email: errorsPath.includes("email"),
                    password: errorsPath.includes("password"),
                    confirmPassword: errorsPath.includes("confirmPassword"),
                } 
            });        
        }
    }catch(e){
        console.log(e);
    }
}