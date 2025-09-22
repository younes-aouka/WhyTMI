import { NextRequest,NextResponse } from "next/server";
import { ProfileFormShema,ProfileFormValues } from "@/Shemas";
import { db } from "@/ConnectDB";
import { getUserId } from "@/utils/getUserId";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";


export async function PATCH(req:NextRequest) {
    try{
        const data:ProfileFormValues = await req.json();
        const parsingResult = ProfileFormShema.safeParse(data);
        if(parsingResult.success===true){
            const fullNameCheck = await db.oneOrNone(
            'SELECT user_id FROM account WHERE full_name ILIKE ${full_name}',
            { full_name: data.fullName});
            const cookieStore = await cookies();
            const userId = await getUserId(cookieStore);
            if(fullNameCheck===null){
                await db.query('UPDATE account SET full_name=${fullName},password_hash=${password_hash} where user_id = ${userId}',
                                {fullName:data.fullName,password_hash:data.password,userId:userId});
                return NextResponse.json({
                    success:true,
                    errors:{
                        db: false,
                        fullName: false,
                        password: false,
                    }                    
                });                               
            }else{
                if(userId===fullNameCheck.user_id){
                    data.password = await bcrypt.hash(data.password,Number(process.env.BCRYPT_SALT_ROUNDS));
                    await db.query('UPDATE account SET full_name=${fullName},password_hash=${password_hash} where user_id = ${userId}',
                                {fullName:data.fullName,password_hash:data.password,userId:userId});                    
                    return  NextResponse.json({
                        success: true,
                        errors:{
                            db: false,
                            fullName: false,
                            password: false,
                        } 
                    });
                }
                else{
                    return  NextResponse.json({
                        success: false,
                        errors:{
                            db: true,
                            fullName: !(fullNameCheck===null),
                            password: false,
                        } 
                    })
                } 
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
                    password: errorsPath.includes("password"),
                } 
            });        
        }
    }catch(e){
        console.log(e);
    }
}