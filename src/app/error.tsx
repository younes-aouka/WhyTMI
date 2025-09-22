'use client';
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import AlertBox from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";

const error = ({error,reset}:{error: Error,reset: ()=>void}) => {
    const router = useRouter();
    function reload(){
        startTransition(async()=>{
            router.refresh();
            reset();
        })
    }
    return (
        <div className="flex flex-col items-center mt-10 text-2xl font-semibold">
            <AlertBox />
            <Button onClick={reload} className="cursor-pointer bg-orange-400 mt-4">Retry</Button>
        </div>
    )
}

export default error