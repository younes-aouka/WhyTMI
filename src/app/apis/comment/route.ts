import { NextRequest,NextResponse } from "next/server";
import { CommentShema } from "@/Shemas";
import { db } from "@/ConnectDB";
import { cookies } from "next/headers";
import { getUserId } from "@/utils/getUserId";

type newComment = {
    articleId:number,
    comment:string
}

export async function POST(req:NextRequest){
    const data:newComment  = await req.json();
    const parsingResult = CommentShema.safeParse(data.comment);
    if(parsingResult.success===true){
        const cookieStore = await cookies();
        const userId = await getUserId(cookieStore);
        await db.query('INSERT INTO comment(article_id,commenter_id,comment_content) values (${aId},${cId},${content});',
            {aId:data.articleId,cId:userId,content:data.comment}
        );
        return NextResponse.json({
            success:true
        })
    }else{
        return NextResponse.json({
            success:false
        });
    }
}

export async function DELETE(req:NextRequest){
        const cookieStore = await cookies();
        const userId = await getUserId(cookieStore);
        const {commentId} = await req.json();
        const {commenter_id} = await db.one('SELECT commenter_id from comment WHERE comment_id = ${commentId}',
                {commentId:Number(commentId)}
        );
        if(commenter_id===userId){
            await db.query('Delete From comment WHERE comment_id = ${commentId}',{commentId:commentId});
            return NextResponse.json({success:true});
        }else{
            return NextResponse.json({success:false});
        }
}

export async function PUT(req:NextRequest) {
        const cookieStore = await cookies();
        const userId = await getUserId(cookieStore);
        const {commentId,comment} = await req.json();
        const {commenter_id} = await db.one('SELECT commenter_id from comment WHERE comment_id = ${commentId}',
                {commentId:Number(commentId)}
        );
        if(commenter_id===userId){
            const parsingResult = CommentShema.safeParse(comment);
            if(parsingResult.success===true){
                await db.query('update comment set comment_content = ${comment} where comment_id = ${commentId} ;',
                    {comment:comment,commentId:commentId});
                return  NextResponse.json({
                    success: true,
                    errors:{
                        authorization:false,
                    } 
                });                                                
            }else{
                return  NextResponse.json({
                    success: false,
                    errors:{
                        authorization:false,
                    } 
                }); 
            } 
        }else{
            return  NextResponse.json({
                success: false,
                errors:{
                    authorization:true,
                } 
            });        
        }
}