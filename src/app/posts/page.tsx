import Link from "next/link"
import { db } from "@/ConnectDB"
import Filters from "@/components/shared/Filters";
import Categories from "@/components/shared/Categories";

export interface Post{
  title: string ,
  published_at: Date,
  text_content: string
}

export default async function page({searchParams}: {searchParams: Promise<{ search?: string,categorie?:string }>;}) {
  let { search,categorie } = await searchParams;
  search = search?.replaceAll('-',' ') || '' ;
  let posts:Post[] ;
  if(search&&categorie){
    posts = await db.query(`SELECT title,published_at,text_content
                             FROM
                                article a INNER JOIN article_categorie ac
	                              ON a.article_id = ac.article_id
                                where
                                  categorie_id = (
                                    SELECT categorie_id FROM categorie
                                    where categorie_name = \${categorie})
                                    AND title ILIKE \${title};`,{categorie:categorie,title:`%${search}%`}) ;
  }else if(search){
    posts = await db.query('SELECT title,published_at,text_content FROM article WHERE title ILIKE ${title};',{title:`%${search}%`}) ;
  }else if(categorie){
    posts = await db.query(`SELECT title,published_at,text_content
                             FROM
                                article a INNER JOIN article_categorie ac
	                              ON a.article_id = ac.article_id
                                where
                                  categorie_id = (
                                    SELECT categorie_id FROM categorie
                                    where categorie_name = \${categorie});`,{categorie:categorie}) ;
  }else {
    posts = await db.query('SELECT title,published_at,text_content FROM article;') ;
  }
  return (
    <div>
      <Filters >
        <Categories />
      </Filters>
      {posts.length>0&&<ul className="mt-8 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          return (
            <li
              key={index}
              className="bg-gray-100 border-black border-[1.5px] rounded-lg p-6 flex flex-col justify-between"
            >
              <p className="text-xs">pubished at: {post.published_at.getDate()}/{post.published_at.getFullYear()}</p>
              <Link
                href={`/posts/${post.title.replaceAll(" ", "-")}`}
                className="underline text-orange-400 text-2xl font-semibold mb-3"
              >
                {post.title}
              </Link>
              <p className="flex-grow">{String(post.text_content).slice(0, 100)}...</p>
            </li>
          );
        })}
      </ul>}
      {posts.length===0&&<h3 className="text-center font-semibold text-2xl mt-10">There is no post!</h3>}
    </div>
  )
}
