import Link from "next/link";
import SearchForm from "./forms/SearchForm";
import MenuNav from "./shared/MenuNav";
import Image from "next/image";
import { Brain } from "lucide-react"

export default function Header({signIn}:{signIn:boolean}){
    return (
        <header className="bg-black text-white p-3 flex items-center gap-20 h-16 rounded-b-lg sticky top-0 left-0 z-10">
          <div className="hidden md:block">
            <SearchForm />
          </div>
          <Link href={"/"} className="flex items-center">
            <Brain className="w-6 h-6 text-orange-500" />
            <h3 className={"md:text-xl text-orange-500 font-bold"}>WhyTMI</h3>
          </Link>
          <div className="grow-1 flex justify-end items-center gap-4">
            <MenuNav signIn={signIn}/>
            {!signIn&&<Link href="/sign-in" className="">sign in</Link>}
            {signIn&&
            <Link href="/profile" className="">
              <Image src={'/images/default_avatar.png'} alt="avatar" width={35} height={35} className="rounded-full"/>
            </Link>}
          </div>
        </header>        
    )
}