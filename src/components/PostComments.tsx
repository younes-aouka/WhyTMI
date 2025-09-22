'use client';
import { useRef, useState } from "react";
import { userPost } from "@/app/posts/[title]/page";
import { CommentShema } from "@/Shemas";
import { Comment } from "@/Shemas";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostCommentApi } from "@/APIResponseTypes";
import { Button } from "./ui/button";
import showToaster from "./dialogs/ShowToaster";
import { UpdateCommentDialog } from "./dialogs/UpdateCommentDialog";
import { DeleteCommentDialog } from "./dialogs/DeleteCommentDialog";

export default function PostComments(
    {post,postComments,signIn,userId}:
    {post:userPost,postComments:Array<Comment>,signIn:boolean,userId:(number|null)}
){
    const commentRef = useRef<HTMLInputElement>(null);
    const [error,setError] = useState<boolean>(false);
    const router = useRouter();
    const [isSubmiting,setIsSubmiting] = useState<boolean>(false)

    const submit =async (e:React.FormEvent)=>{
        setIsSubmiting(true);
        try{
            e.preventDefault();
            if(signIn){
                const parsingResult = CommentShema.safeParse(commentRef.current?.value);
                if(parsingResult.success===true){
                    const res = await fetch('/apis/comment',{
                        method: 'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            articleId: post.article_id,
                            comment:commentRef.current?.value
                        })
                    });
                    const result:PostCommentApi = await res.json();
                    if(result.success===true){

                        commentRef.current? commentRef.current.value = "":'';
                        router.refresh();
                        setError(false);
                    }else{
                        setError(true);
                    }
                }else{
                    setError(true);
                }
            }
        }catch(e){
            showToaster();
        }
        setIsSubmiting(false);
    }

    return (
        <section className="flex flex-col gap-2 w-full">
            {error && (
                <p className="font-semibold text-xs text-red-500">
                your comment should be between 1 and 200 character
                </p>
            )}
            {/* make a comment */}
            <form onSubmit={(e) => {submit(e)}} className="flex gap-3 items-center">
                <div>
                    <input
                        type="text"
                        ref={commentRef}
                        placeholder="make a comment!"
                        className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                    />
                </div>
                {signIn && (
                <Button type="submit" className="bg-orange-500 text-lg cursor-pointer" disabled={isSubmiting}>
                    {!isSubmiting&&<p>
                        Submit
                    </p>}
                    {isSubmiting&&<p>
                        Submiting...    
                    </p>}
                </Button>
                )}
                {!signIn && (
                <Link href={"/sign-in"} className="text-blue-500 underline">
                    Sign-in to comment
                </Link>
                )}
            </form>
            {/* comments list */}
            <div className="w-full">
                <ul className="w-full flex flex-col gap-4 py-4">
                {postComments.map((comment, index) => {
                    return (
                    <li key={index} className="w-full flex justify-between py-4 px-4 bg-gray-100 border-[1.5px] border-black rounded-lg">
                        {/* commet details */}
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center ">
                                <Image
                                    src={comment.avatar}
                                    alt="avatar"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <p className="px-1">{comment.commenter_name}</p>
                                <p className="text-xs font-semibold text-gray-500">
                                    <span>#Published at:</span>{" "}
                                    {post.published_at.getDate()}/{post.published_at.getFullYear()}
                                </p>
                            </div>
                            <p className="pl-10 text-lg wrap-anywhere whitespace-normal">{comment.comment_content}</p>
                        </div>
                        {/* comment actions */}
                        <div className="flex flex-col gap-3">
                            {signIn&&userId===comment.commenter_id&&
                            <UpdateCommentDialog commentId={comment.comment_id} comment={comment.comment_content} router={router} />
                            }
                            {signIn&&userId===comment.commenter_id&&
                                <DeleteCommentDialog comment_id={comment.comment_id} router={router}/>
                            }
                        </div>                    
                    </li>
                    );
                })}
                </ul>
            </div>
        </section>
    )
}