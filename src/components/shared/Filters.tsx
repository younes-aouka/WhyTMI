'use client'
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import showToaster from "@/components/dialogs/ShowToaster";

const Filters = ({children}:{children?: React.ReactNode}) => {
    const currentPath = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();
    const selectRef = useRef<HTMLSelectElement>(null);

    const submit = async (e: React.FormEvent)=>{
        try {
            e.preventDefault();
            const categorie = selectRef.current?.value || null;
            if(categorie){
                searchParams.set("categorie",categorie)
                router.push(currentPath+'?'+searchParams);
            }else{
                searchParams.delete('categorie');
                router.push(currentPath+'?'+searchParams);            
            }
        }catch(e){
            showToaster();
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl underline text-orange-500 m-3">Filters</h2>
            <form className="flex flex-col gap-4" onSubmit={(e)=>{submit(e)}}>
                <label>
                    <span className="">Categories: </span>
                    <select name="categorie" className="border-solid border-black border-2 rounded-lg" ref={selectRef}>
                        {children}
                    </select>
                </label>
                <button type="submit" className="cursor-pointer p-3 rounded-lg bg-orange-500 text-lg">Filter</button>
            </form>
        </div>

    )
}

export default Filters
