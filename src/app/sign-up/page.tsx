'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormShema,SignUpFormValues } from "@/Shemas";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostSignUpApi } from "@/APIResponseTypes";
import showToaster from "@/components/dialogs/ShowToaster";


export default function Page() {
  const router = useRouter();
  const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<SignUpFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(SignUpFormShema)
  });

  const onSubmit:SubmitHandler<SignUpFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/sign-up',{
        method: "POST",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
        const serverValidatingResult:PostSignUpApi = await res.json()
        console.log(serverValidatingResult);
        if(serverValidatingResult.success===false){
          if(serverValidatingResult.errors.db===true){
            serverValidatingResult.errors.fullName?setError("fullName",{message:"this name is already used, please pick another name !",type:"server"}):''
            serverValidatingResult.errors.email?setError("email",{message:"this email already been used !",type:"server"}):''
          }else{
            serverValidatingResult.errors.fullName?setError("fullName",{message:"your fullName must be between 4 and 15 characters !",type:"server"}):'';
            serverValidatingResult.errors.email?setError("email",{message:"please enter a valid email !",type:"server"}):'';
            serverValidatingResult.errors.password?setError("password",{message:"please enter a valid password !(between 4 and 7 characters) !",type:"server"}):'';
            serverValidatingResult.errors.confirmPassword?setError("confirmPassword",{message:"passwords should match !",type:"server"}):'';
          }
        }else{
          router.push('/verify-email');
        }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<SignUpFormValues> = (errors) =>{
    console.log('error in validation: ',errors);
  }
   
  useEffect(()=>{
    setFocus('fullName') ;
  },[])

  return (
    <div className="h-[calc(100vh-4rem)] px-4 py-7">
      <form className="w-min relative top-2/4 left-1/2 -translate-1/2" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
        <table className="">
          <tbody>
            {/* error */}
            <tr>
              <td></td>
              <td >
                {errors.fullName&&
                <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
              </td>
            </tr>
            <tr className="">
              <td className="px-3 py-3">
                <label>Full Name</label>
              </td>
              <td>
                <input
                  type="text"
                  {...register('fullName')}
                  className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                />
              </td>
            </tr>
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
            {/* other links */}
            <tr>
              <td></td>
              <td className="flex justify-between">
                <Link href={'/reset-password'} className="text-sm underline hover:text-orange-500">forgot your password ?</Link>
                <Link href={'/sign-in'} className="text-sm underline hover:text-orange-500">Sign-in</Link>
              </td>
            </tr>
            <tr className="">
              <td className="px-2 py-2 relative left-1/2">
                <button type="submit" className="cursor-pointer p-2 rounded-lg bg-orange-500 text-lg">
                  {isSubmitting&&<p>Submiting...</p>}
                  {!isSubmitting&&<p>Sign-up</p>}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
