import { cookies } from "next/headers";
import { getUserId } from "@/utils/getUserId";
import { db } from "@/ConnectDB";
import { Post } from "@/app/posts/page";
import UserPost from "@/components/UserPost";


export interface PostExtended extends Post {
  article_id: number
}

export default async function MyPostsPage() {
  const cookieStore = await cookies();
  const userId = await getUserId(cookieStore);
  const postsList:PostExtended[] = await db.query('SELECT * FROM article WHERE auther_id = ${userId};',{userId:userId});
  if(postsList.length!==0){
    return (
        <ul className="mt-8 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          { 
            postsList.map((post, index) => {
              return (
                <UserPost post={post} index={index} />
              )
            })
          }
        </ul>
    );
  }else{
    return(
      <h3 className="text-center font-semibold text-2xl mt-10">you have no post yet!</h3>
    )
  }
}
