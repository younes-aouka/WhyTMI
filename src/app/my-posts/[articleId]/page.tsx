import { db } from "@/ConnectDB";
import EditPostForm from "@/components/forms/EditPostForm";
import { getUserId } from "@/utils/getUserId";
import { cookies } from "next/headers";
import Categories from "@/components/shared/Categories"

export default async function page({params}:{params:Promise<{articleId:number}>}){
    
    let {articleId} = await params ;
    const {auther_id} = await db.one('SELECT auther_id from article WHERE article_id = ${articleId}',{articleId:articleId});
    const cookieStore = await cookies();
    const userId = await getUserId(cookieStore);
    if(auther_id===userId){
        const {text_content,title} = await db.one('SELECT title,text_content from article WHERE article_id = ${articleId}',{articleId:articleId});
        const {categorie_id} = await db.one('SELECT categorie_id from article_categorie WHERE article_id = ${articleId}',{articleId:articleId});
        const {categorie_name} = await db.one('SELECT categorie_name from categorie WHERE categorie_id = ${categorie_id}',{categorie_id:categorie_id});
        return (
            <EditPostForm title={title} categorie={categorie_name} text_content={text_content} articleId={articleId}>
                <Categories />
            </EditPostForm>
        )
    }else{
        return (
            <p className="font-semibold text-3xl mt-6">You don't have acces to edit that post!</p>
        )
    }
}
