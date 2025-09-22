'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordFormShema,NewPasswordFormValues } from "@/Shemas";
import { useEffect } from "react";
import { useState } from "react";
import { PatchResetPasswordApi } from "@/APIResponseTypes";
import showToaster from "@/components/dialogs/ShowToaster";


export default function Page({token}:{token:string}) {
  const [success,setSuccess] = useState<Boolean>(false);
  const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<NewPasswordFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(NewPasswordFormShema)
  });

  const onSubmit:SubmitHandler<NewPasswordFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/reset-password',{
        method: "PATCH",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
      const serverValidatingResult:PatchResetPasswordApi = await res.json()
      if(serverValidatingResult.success===false){
        serverValidatingResult.errors.password?setError("password",{message:"please enter a valid password !(between 4 and 7 characters) !",type:"server"}):'';
        serverValidatingResult.errors.confirmPassword?setError("confirmPassword",{message:"passwords should match !",type:"server"}):'';
        serverValidatingResult.errors.token?setError("token",{message:"there is a problem in your link !, please try with a new one",type:"server"}):'';
      }else{
        setSuccess(true);
      }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<NewPasswordFormValues> = (errors) =>{}
   
  useEffect(()=>{
    setFocus('password') ;
  },[])

  if(success===true){
        return (
          <div className='px-4 py-7'>
              <section className='flex flex-col items-center text-center gap-4'>
                  <h2 className='max-w-[400px] bg-orange-200 text-2xl font-semibold border-2 border-black border-solid p-2 rounded-lg'>Your password is reseted successfully &#9989;</h2>
                  <p className='text-lg'>you can now sign-in with your new password</p>
              </section>
          </div>
        )
  }else{
      return (
          <div className="h-[calc(100vh-4rem)] px-4 py-7">
            <form className="w-min relative top-2/4 left-1/2 -translate-1/2" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
              <table className="">
                <tbody>
                  {/* error */}
                  <tr>
                    <td></td>
                    <td>
                      {errors.password&&
                      <p className="text-red-600 text-sm">{errors.password.message}</p>}
                    </td>
                  </tr>
                  <tr className="">
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
                  {/* error */}
                  <tr>
                    <td></td>
                    <td>
                      {errors.confirmPassword&&
                      <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                    </td>
                  </tr>
                  <tr className="">
                    <td className="px-3 py-3">
                      <label>Confirm Password</label>
                    </td>
                    <td >
                      <input
                        type="password"
                        {...register('confirmPassword')}
                        className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                      />
                    </td>
                  </tr>
                  {/* error */}
                  <tr>
                    <td></td>
                    <td>
                      {errors.token&&
                      <p className="text-red-600 text-sm">{errors.token.message}</p>}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input type="hidden" {...register('token')} value={token}/>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="px-2 py-2 relative left-1/2">
                      <button type="submit" className="cursor-pointer p-2 rounded-lg bg-orange-500 text-lg">
                        {isSubmitting&&<p>Submiting...</p>}
                        {!isSubmitting&&<p>Reset</p>}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        )
  }
}
