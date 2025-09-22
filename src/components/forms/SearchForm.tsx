'use client';
import React from "react"
import { Search } from "lucide-react"
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"
import showToaster from "@/components/dialogs/ShowToaster";


export default function SearchForm() {
    const searchParams = new URLSearchParams(useSearchParams());
    const searchRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const submit = async (e: React.FormEvent) => {
    try {
        e.preventDefault();
        let search = searchRef.current?.value || null;

        const path = '/posts'

        if (search) {
            search = search.replaceAll(" ", "-").trim();
            searchParams.set("search", search);
            router.push(path + "?" + searchParams.toString());
        } else {
            searchParams.delete("search");
            router.push(path + "?" + searchParams.toString());
        }
    } catch (e) {
        showToaster();
    }
    };

    return (
        <form onSubmit={(e)=>{submit(e)}} encType="application/x-www-form-urlencoded"
        className="flex items-center gap-1 p-1 ">
            <input type="text" name="search" placeholder="search for posts"
            className="bg-gray-600 px-2 py-1 rounded-lg border-solid border-black border-2" ref={searchRef}/>
            <button type="submit" className="cursor-pointer">
                <Search stroke="white"/>
            </button>
        </form>
  )
}
