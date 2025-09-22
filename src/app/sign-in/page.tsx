'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormShema,SignInFormValues } from "@/Shemas";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostSignInApi } from "@/APIResponseTypes";
import showToaster from "@/components/dialogs/ShowToaster";


export default function Page() {
  const router = useRouter();
  const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<SignInFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(SignInFormShema)
  });

  const onSubmit:SubmitHandler<SignInFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/sign-in',{
        method: "POST",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
        const serverValidatingResult:PostSignInApi = await res.json()
        if(serverValidatingResult.success===false){
          if(serverValidatingResult.errors.db===true){
            serverValidatingResult.errors.email?setError("email",{message:"there is no account with that email!",type:"server"}):'';
            serverValidatingResult.errors.password?setError("password",{message:"wrong password!",type:"server"}):'';
          }else{
            serverValidatingResult.errors.email?setError("email",{message:"please enter a valid email !",type:"server"}):'';
            serverValidatingResult.errors.password?setError("password",{message:"please enter a valid password !(between 4 and 7 characters)",type:"server"}):'';
          }
        }else{
          if(serverValidatingResult.email_verified===true){
            window.location.href = '/';
          } 
          else{
            router.push('/verify-email');
          } 
        }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<SignInFormValues> = (errors) =>{
    console.log(errors)
  }
   
  useEffect(()=>{
    setFocus('email') ;
  },[])

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
            {/* error */}
            <tr>
              <td></td>
              <td>
                {errors.password&&
                <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-3">
                <label>Password</label>
              </td>
              <td >
                <input
                  type="password"
                  {...register('password')}
                  className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                />
              </td>
            </tr>
            {/* other links */}
            <tr>
              <td></td>
              <td className="flex justify-between">
                <Link href={'/reset-password'} className="text-sm underline hover:text-orange-500">forgot your password ?</Link>
                <Link href={'/sign-up'} className="text-sm underline hover:text-orange-500">create account</Link>
              </td>
            </tr>
            <tr className="">
              <td className="px-2 py-2 relative left-1/2">
                <button type="submit" className="cursor-pointer p-2 rounded-lg bg-orange-500 text-lg">
                  {isSubmitting&&<p>Submiting...</p>}
                  {!isSubmitting&&<p>Sign-in</p>}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
