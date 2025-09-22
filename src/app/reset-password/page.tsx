'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormShema,resetPasswordFormValues } from "@/Shemas";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PostResetPasswordApi } from "@/APIResponseTypes";
import showToaster from "@/components/dialogs/ShowToaster";



export default function Page() {
    const [success,setSuccess] = useState<Boolean>(false);
    const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<resetPasswordFormValues>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: zodResolver(ResetPasswordFormShema)
    });

    const onSubmit:SubmitHandler<resetPasswordFormValues> = async(data) => {
        try{
            const res = await fetch('/apis/reset-password',{
                method: "POST",
                body: JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const serverValidatingResult:PostResetPasswordApi = await res.json()
            if(serverValidatingResult.success===false){
                if(serverValidatingResult.errors.db===true){
                        setError("email",{message:"please make sure you already have and account !",type:"server"})
                  }else{
                        serverValidatingResult.errors.email?setError("email",{message:"please enter a valid email !",type:"server"}):'';
                    }
            }else{
                setSuccess(true)
            }
        }catch(e){
            showToaster();
        }
    }

    const onError: SubmitErrorHandler<resetPasswordFormValues> = (errors) =>{}
    
    useEffect(()=>{
        setFocus('email') ;
    },[])
    if(success===true){
        return (
            <div className='h-[calc(100vh-4rem)] px-4 py-7'>
                <section className='relative top-1/4 left-1/2 -translate-1/2 flex flex-col items-center text-center gap-4'>
                    <h2 className='max-w-[400px] bg-orange-200 text-2xl font-semibold border-2 border-black border-solid p-2 rounded-lg'>Reseting link is sented successfully to your email &#9989;</h2>
                    <p className='text-lg'>please check your email and enter the link to reset your password</p>
                </section>
            </div>
        )
    }else{
        return (
            <div className="h-[calc(100vh-4rem)] px-4 py-7">
            <form className="w-min relative top-1/4 left-1/2 -translate-1/2" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
                <table className="">
                    <tbody>
                        {/* error */}
                        <tr>
                            <td></td>
                            <td >
                                {errors.email&&
                                <p className="text-red-600 text-sm">{errors.email.message}</p>}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-3 py-3">
                                <label>Email</label>
                            </td>
                            <td>
                                <input
                                type="email"
                                {...register('email')}
                                className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                                />
                            </td>
                        </tr>
                        {/* other links */}
                        <tr>
                            <td></td>
                            <td className="flex justify-between">
                                <Link href={'/sign-in'} className="text-sm underline hover:text-orange-500">sign-in</Link>
                                <Link href={'/sign-up'} className="text-sm underline hover:text-orange-500">create account</Link>
                            </td>
                        </tr>
                        {/* submit button */}
                        <tr className="">
                            <td className="px-2 py-2 relative left-1/2">
                                <button type="submit" className="cursor-pointer p-2 rounded-lg bg-orange-500 text-lg">
                                {isSubmitting&&<p>Submiting...</p>}
                                {!isSubmitting&&<p>Send</p>}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            </div>
        );
    }
}
