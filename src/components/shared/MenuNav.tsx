"use client"
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import SearchForm from "../forms/SearchForm";
import { LogOutIcon, PlusSquareIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import showToaster from "@/components/dialogs/ShowToaster";

const navList = [
  {
    name: "Posts",
    link: "/posts"
  }
];

export default function MenuNav({signIn}:{signIn:boolean}) {

  const [menuHidden,setMenuHidden] = useState(true);

  const hideNav = (e:React.MouseEvent)=>{
    e.stopPropagation();
    setMenuHidden(true)    
  }
  const router = useRouter();

  const submit = async(e:React.FormEvent)=>{
    try{
      e.stopPropagation();
      e.preventDefault();
      await fetch('/apis/logout',{method: 'POST'});
      setMenuHidden(true)
      router.refresh();
    }catch(e){
      showToaster();
    }
  }

  return (
    <div>
        <button type="button" onClick={()=>{setMenuHidden(!menuHidden)}} className="cursor-pointer">Menu</button>
        <ul className={clsx("bg-black absolute top-13 left-0 z-10 w-full overflow-hidden rounded-lg md:top-16 md:left-[70%] md:w-[30%]",
                            {"hidden":menuHidden})}>
          <hr />
          <li className="md:hidden px-4 py-2 flex justify-center">
            <SearchForm />
          </li>
          {navList.map((el,index)=>{
            return (
                <li key={index} >
                  <Link href={el.link} className="block px-4 py-2 hover:text-orange-400" onClick={hideNav}>{el.name}</Link>
                  <hr />
                </li>
            )
          })
          }
          {signIn&&
          <li>
            <Link href='/new-post' className="px-4 py-2 hover:text-orange-400 flex items-center gap-1" onClick={hideNav}>
              <p>New Post</p>
              <PlusSquareIcon width={20}/> 
            </Link>
            <hr />
          </li>}
          {signIn&&
          <li>
            <Link href='/my-posts' className="px-4 py-2 hover:text-orange-400 flex items-center gap-1" onClick={hideNav}>
              <p>My Posts</p>
              <UserIcon width={20}/> 
            </Link>
            <hr />
          </li>}
          {signIn&&
          <li className="hover:text-orange-400 ">
            <form onSubmit={(e)=>{submit(e)}}
            className="px-4 py-2 flex items-center gap-1 cursor-pointer">
              <button type="submit" className="cursor-pointer">Logout</button>
              <LogOutIcon/>
            </form>
          </li>}
        </ul>
    </div>
  )
}