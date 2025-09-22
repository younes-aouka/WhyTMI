import { NextRequest,NextResponse } from "next/server";
import {
    NewPostFormShema,NewPostFormValues,
    UpdatePostFormValues,UpdatePostFormShema
} from "@/Shemas";
import { db } from "@/ConnectDB";
import { cookies } from "next/headers";
import { getUserId } from "@/utils/getUserId";

export async function POST(req:NextRequest) {
        const data:NewPostFormValues = await req.json();
        const parsingResult = NewPostFormShema.safeParse(data);
        if(parsingResult.success===true){
            const titleCheck = await db.oneOrNone(
            'SELECT * FROM article WHERE title= ${title};',
            { title:data.title});
            if(titleCheck){
                return  NextResponse.json({
                    success: false,
                    errors:{
                        db: true,
                        title: true,
                        post: false,
                        categorie:false
                    } 
                });                 
            }else{
                const cookieStore = await cookies();
                const userId = await getUserId(cookieStore);
                const {article_id} = await db.one('INSERT INTO article(auther_id,title,text_content) values (${user_id},${title},${post}) RETURNING article_id;',
                    {user_id:userId,title:data.title,post:data.post}
                );
                const {categorie_id} = await db.one('SELECT categorie_id from categorie where categorie_name = ${name}',{name:data.categorie});
                await db.query('INSERT INTO article_categorie values(${article_id},${categorie_id})',{article_id:article_id,categorie_id:categorie_id})
                console.log(article_id,'\n',categorie_id);
                return  NextResponse.json({
                    success: true,
                    errors:{
                        db: false,
                        title: false,
                        post: false,
                        categorie:false
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
                    title: errorsPath.includes("title"),
                    post: errorsPath.includes("post"),
                    categorie: errorsPath.includes('categorie')
                } 
            });        
        }
}

export async function DELETE(req:NextRequest){
        const cookieStore = await cookies();
        const userId = await getUserId(cookieStore);
        const {articleId} = await req.json();
        const {auther_id} = await db.one('SELECT auther_id from article WHERE article_id = ${articleId}',{articleId:articleId});
        if(auther_id===userId){
            await db.query('Delete From article WHERE article_id = ${articleId}',{articleId:articleId});
            return NextResponse.json({success:true});
        }else{
            return NextResponse.json({success:false});
        }
}

export async function PUT(req:NextRequest) {
        const data:UpdatePostFormValues = await req.json();
        const cookieStore = await cookies();
        const userId = await getUserId(cookieStore);
        const {auther_id} = await db.one('select auther_id from article where article_id = ${articleId} ;',
            {articleId:data.articleId}
        );
        if(auther_id===userId){
            const parsingResult = UpdatePostFormShema.safeParse(data);
            if(parsingResult.success===true){
                const titleCheck = await db.oneOrNone(
                'SELECT * FROM article WHERE title= ${title};',
                { title:data.title});
                if(titleCheck){
                    const {article_id} = await db.oneOrNone(
                    'SELECT article_id FROM article WHERE title= ${title};',
                    { title:data.title});
                    if(article_id===data.articleId){
                        await db.query('update article set text_content = ${textContent} where article_id = ${articleId} ;',
                            {textContent:data.post,articleId:data.articleId});
                        const {categorie_id} = await db.one('select categorie_id from categorie where categorie_name = ${name};',{
                            name:data.categorie
                        });
                        await db.query('update article_categorie set categorie_id = ${categorieId} where article_id = ${articleId}',
                            {categorieId:categorie_id,articleId:data.articleId}
                        )
                        return  NextResponse.json({
                            success: true,
                            errors:{
                                authorization:false,
                                db: false,
                                title: false,
                                post: false,
                                categorie:false
                            } 
                        });                    
                    }else{
                        return  NextResponse.json({
                            success: false,
                            errors:{
                                authorization:false,
                                db: true,
                                title: true,
                                post: false,
                                categorie:false
                            } 
                        });                    
                    }                                
                }else{
                    await db.query('update article set title = ${title},text_content = ${post} where article_id = ${id};',
                        {title:data.title,post:data.post,id:data.articleId}
                    )
                    return  NextResponse.json({
                        success: true,
                        errors:{
                            authorization:false,
                            db: false,
                            title: false,
                            post: false,                        
                            categorie:false
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
                        authorization:false,
                        db:null, 
                        title: errorsPath.includes("title"),
                        post: errorsPath.includes("post"),
                        categorie: errorsPath.includes('categorie')
                    } 
                });        
            }
        }else{
            return  NextResponse.json({
                success: false,
                errors:{
                    authorization:true, 
                    db:null,
                    title: null,
                    post: null,
                    categorie: null
                } 
            });
        }        
}


