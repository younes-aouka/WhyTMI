'use client';
import { PostExtended } from "@/app/my-posts/page";
import { PenSquareIcon } from "lucide-react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { DeletePostDialog } from "./dialogs/DeletePostDialog";

export default function UserPost({post,index}:{post:PostExtended,index:number}){
    const router = useRouter();
    return (
            <li key={index} className="bg-gray-100 border-black border-[1.5px] rounded-lg p-6 flex justify-between">
                <div className="flex flex-col justify-between">
                    {/* error */}
                    <p className="text-xs">pubished at: {post.published_at.getDate()}/{post.published_at.getFullYear()}</p>
                    <Link
                    href={`/posts/${post.title.replaceAll(" ", "-")}`}
                    className="underline text-orange-400 text-2xl font-semibold mb-3">
                    {post.title}
                    </Link>
                    <p className="flex-grow">{String(post.text_content).slice(0, 100)}...</p>
                </div>
                <div className="flex flex-col justify-between">
                    <Button className="bg-orange-400 cursor-pointer" onClick={()=>{
                        router.push('/my-posts/'+post.title.replaceAll(' ','-'))
                    }}>
                        <PenSquareIcon />
                    </Button>
                    <DeletePostDialog article_id={post.article_id} router={router}/>
                </div>
            </li>
    );
}