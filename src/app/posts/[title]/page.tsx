import { db } from "@/ConnectDB"
import { Post } from "@/app/posts/page";
import PostComments from "@/components/PostComments";
import Image from "next/image";
import { Comment } from "@/Shemas";
import { cookies } from "next/headers";
import { checkSignIn } from "@/utils/checkSignIn";
import { notFound } from "next/navigation";
import { getUserId } from "@/utils/getUserId";

export interface userPost extends Post {
    article_id: number,
    auther_id:number
}

export default async function page({params}:{params:Promise<{title:string}>}) {
    const {title} = await params ;
    const myResolvedTitle = title.replaceAll('-',' ').trim() ;
    const post:userPost|null = await db.oneOrNone("SELECT * FROM article where title ILIKE ${title}",{title: myResolvedTitle});
    if(post){
        const postComments:Array<Comment> = await db.query(`
        select
            comment_id,commenter_id,full_name as commenter_name,profile_img_path as avatar,c.created_at,comment_content
        from 
            comment as c inner join account as a
            on c.commenter_id = user_id
        where article_id = \${id};`,{id:post.article_id});
        const {full_name,profile_img_path} = await db.oneOrNone('SELECT full_name,profile_img_path from account where user_id = ${id} ;',
                {id:post.auther_id}
        );
        const cookiesList = await cookies();
        const session = cookiesList.get('session');
        const signIn = await checkSignIn(session);
        const userId = await getUserId(cookiesList);
        return (
            <>
                {/*Post details */}
                <div className="py-8 px-8 my-8 border-solid bg-gray-100 border-black border-[1.5px] rounded-lg ">
                    <div className="flex items-center">
                        <Image src={profile_img_path} alt="avatar" width={30} height={30} className="rounded-full"/>
                        <p className="px-1">{full_name}</p>
                        <p className="text-xs font-semibold text-gray-500">
                            <span >#Pubished at:</span> {post.published_at.getDate()}/{post.published_at.getFullYear() }<br/>
                        </p>
                    </div>
    
                    <h2 className="text-2xl underline font-semibold mb-1">{post.title}</h2>
                    <p className="mt-2 text-lg break-words whitespace-normal">{post.text_content}</p>
                </div>
                {/* Comments */}
                <PostComments post={post} postComments={postComments} signIn={signIn} userId={userId}/>
            </>
        )
    }else{
        notFound();
    }
}
