'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormShema,ProfileFormValues } from "@/Shemas";
import clsx from "clsx";
import Image from "next/image";
import { PatchUserApi } from "@/APIResponseTypes";
import { useRouter } from "next/navigation";
import showToaster from "@/components/dialogs/ShowToaster";


type userInfo = {
    full_name:string,
    email:string,
    profile_img_path:string
}

export default function ProfileForm({full_name,email,profile_img_path}:userInfo){
  const {register,formState:{errors,isSubmitting,isDirty},setFocus,handleSubmit,setError} = useForm<ProfileFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues:{
        email:email,
        fullName:full_name,
    },
    resolver: zodResolver(ProfileFormShema)
  });

  const router = useRouter();

  const onSubmit:SubmitHandler<ProfileFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/user',{
        method: "PATCH",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
        const serverValidatingResult:PatchUserApi = await res.json()
        if(serverValidatingResult.success===false){
          if(serverValidatingResult.errors.db===true){
            serverValidatingResult.errors.fullName?setError("fullName",{message:"this name is already used, please pick another name !",type:"server"}):''
          }else{
            serverValidatingResult.errors.fullName?setError("fullName",{message:"your fullName must be between 4 and 15 characters !",type:"server"}):'';
            serverValidatingResult.errors.password?setError("password",{message:"please enter a valid password !(between 4 and 7 characters) !",type:"server"}):'';
          }
        }else{
          router.push('/');
        }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<ProfileFormValues> = (errors) =>{
    console.log('error in validation: ',errors);
  }
   
  return (
    <div className="px-4 py-7 flex flex-col items-center">
      <Image src={profile_img_path} width={100} height={100} className="rounded-full translate-x-2/4" alt="avatar" />
      <form className="w-min" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
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
                  className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px] bg-gray-300"
                    disabled={true}
                    value={email}
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
            <tr className="">
              <td className="px-2 py-2 relative left-1/2">
                <button type="submit" className={clsx("p-2 rounded-lg text-lg",{'bg-orange-500 cursor-pointer':isDirty,'bg-gray-300':!isDirty})} disabled={!isDirty}>
                  {isSubmitting&&<p>Updating...</p>}
                  {!isSubmitting&&<p>Update</p>}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}