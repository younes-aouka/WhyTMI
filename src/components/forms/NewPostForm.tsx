'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPostFormShema,NewPostFormValues } from "@/Shemas";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostPostApi } from "@/APIResponseTypes";
import { Button } from "@/components/ui/button"
import showToaster from "@/components/dialogs/ShowToaster";


export default function NewPostForm({children}:{children:React.ReactNode}) {
  const router = useRouter();
  const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<NewPostFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(NewPostFormShema)
  });

  const onSubmit:SubmitHandler<NewPostFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/post',{
        method: "POST",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
      const serverValidatingResult:PostPostApi = await res.json()
      if(serverValidatingResult.success===false){
        if(serverValidatingResult.errors.db===true){
          setError("title",{message:"this title is already used! please try another one",type:"server"})
        }else{
          serverValidatingResult.errors.title?setError("title",{message:"please enter a valid title!(between 3 and 50 characters)",type:"server"}):'';
          serverValidatingResult.errors.categorie?setError("categorie",{message:"please choose a categorie!",type:"server"}):'';
          serverValidatingResult.errors.post?setError("post",{message:"your post should be between 3 and 200 characters!",type:"server"}):'';
        }
      }else{
        router.push('/posts');
      }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<NewPostFormValues> = (errors) =>{
    console.log(errors);
  }
   
  useEffect(()=>{
    setFocus('title') ;
  },[])

  return (
    <div className="px-4 py-7 flex justify-center">
      <form className="w-min" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
        <table className="">
          <tbody>
            {/* title */}
            {/* error */}
            <tr>
              <td></td>
              <td >
                {errors.title&&
                <p className="text-red-600 text-sm">{errors.title.message}</p>}
              </td>
            </tr>
            <tr className="">
              <td className="py-4">
                <label>Title</label>
              </td>
              <td>
                <input
                  type="text"
                  {...register('title')}
                  className="px-2 py-1 rounded-lg border-2 border-black w-[200px] md:w-[250px]"
                />
              </td>
            </tr>
            {/* categorie */}
            {/* error */}
            <tr>
              <td></td>
              <td >
                {errors.categorie&&
                <p className="text-red-600 text-sm">{errors.categorie.message}</p>}
              </td>
            </tr>
            <tr className="">
              <td className="py-4">
                <label>Categorie</label>
              </td>
              <td>
                <select {...register('categorie')} className="border-solid border-black border-2 rounded-lg ">
                      {children}
                </select>                   
              </td>
            </tr>
            {/* post */}
            {/* error */}
            <tr>
              <td></td>
              <td >
                {errors.post&&
                <p className="text-red-600 text-sm">{errors.post.message}</p>}
              </td>
            </tr>
            <tr>
              <td className="py-4">
                <label>Post</label>
              </td>
              <td >
                <textarea {...register('post')} className="px-2 py-1 rounded-lg border-2 border-black w-[250px] md:w-[550px] h-[400px] resize-none"
                ></textarea>
              </td>
            </tr>
            <tr className="">
              <td className="px-2 py-2 relative left-1/2">
                <Button type="submit" className="bg-orange-500 text-lg cursor-pointer">
                  {isSubmitting&&<p>Publishing...</p>}
                  {!isSubmitting&&<p>Publish</p>}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}





