import { db } from "@/ConnectDB";
import EditPostForm from "@/components/forms/EditPostForm";
import { getUserId } from "@/utils/getUserId";
import { cookies } from "next/headers";
import Categories from "@/components/shared/Categories"

export default async function page({params}:{params:Promise<{title:string}>}){
    
    let {title} = await params ;
    title = title.replaceAll('-',' ')
    const {auther_id} = await db.one('SELECT auther_id from article WHERE title = ${title}',{title:title});
    const cookieStore = await cookies();
    const userId = await getUserId(cookieStore);
    if(auther_id===userId){
        const {article_id,text_content} = await db.one('SELECT article_id,text_content from article WHERE title = ${title}',{title:title});
        const {categorie_id} = await db.one('SELECT categorie_id from article_categorie WHERE article_id = ${article_id}',{article_id:article_id});
        const {categorie_name} = await db.one('SELECT categorie_name from categorie WHERE categorie_id = ${categorie_id}',{categorie_id:categorie_id});
        return (
            <EditPostForm title={title} categorie={categorie_name} text_content={text_content} articleId={article_id}>
                <Categories />
            </EditPostForm>
        )
    }else{
        return (
            <p className="font-semibold text-3xl mt-6">You don't have acces to edit that post!</p>
        )
    }
}
