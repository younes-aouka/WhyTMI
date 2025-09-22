'use client';
import { useForm,SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePostFormShema,UpdatePostFormValues } from "@/Shemas";
import { useRouter } from "next/navigation";
import { PutPostApi } from "@/APIResponseTypes";
import { Button } from "@/components/ui/button";
import showToaster from "@/components/dialogs/ShowToaster";


export default function EditPostForm(
    {children,title,categorie,text_content,articleId}:
    {children:React.ReactNode,title:string,categorie:string,text_content:string,articleId:number}
){
  const router = useRouter();
  const {register,formState:{errors,isSubmitting},setFocus,handleSubmit,setError} = useForm<UpdatePostFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues:{
        title: title,
        categorie:categorie,
        post: text_content,
        articleId:articleId
    },
    resolver: zodResolver(UpdatePostFormShema)
  });

  const onSubmit:SubmitHandler<UpdatePostFormValues> = async(data) => {
    try{
      const res = await fetch('/apis/post',{
        method: "PUT",
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json'
        }
      })
      const serverValidatingResult:PutPostApi = await res.json()
      if(serverValidatingResult.success===false){
        if(serverValidatingResult.errors.authorization===true){
          setError("title",{message:"You not authorized to edit that post!",type:"server"})
        }else{
            if(serverValidatingResult.errors.db===true){
              setError("title",{message:"this title is already used! please try another one",type:"server"})
            }else{
              serverValidatingResult.errors.title?setError("title",{message:"please enter a valid title!(between 3 and 50 characters)",type:"server"}):'';
              serverValidatingResult.errors.categorie?setError("categorie",{message:"please choose a categorie!",type:"server"}):'';
              serverValidatingResult.errors.post?setError("post",{message:"your post should be between 3 and 200 characters!",type:"server"}):'';
            }
        }
      }else{
        router.push('/posts/'+data.title.replaceAll(' ','-'));
      }
    }catch(e){
      showToaster();
    }
  }

  const onError: SubmitErrorHandler<UpdatePostFormValues> = (errors) =>{
    console.log(errors);
  }
   
  return (
    <div className="px-4 py-7 flex justify-center">
      <form className="w-min" onSubmit={handleSubmit(onSubmit,onError)} noValidate>
        <table className="">
          <tbody>
            {/* error */}
            {/* categorie */}
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
            {/* Post */}
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
            {/* submit button */}
            <tr className="">
              <td className="px-2 py-2 relative left-1/2">
                <Button type="submit" className="bg-orange-500 text-lg cursor-pointer">
                  {!isSubmitting&&<p>Update</p>}
                  {isSubmitting&&<p>Updating...</p>}
                </Button>
              </td>
            </tr>
            {/* article id */}
            <tr>
                <td>
                    <input type="hidden" {...register('articleId')}/>
                </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
