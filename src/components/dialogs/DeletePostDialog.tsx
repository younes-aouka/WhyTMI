import { DeletePostApi } from "@/APIResponseTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import showToaster from "./ShowToaster";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function DeletePostDialog({article_id,router}:{article_id:number,router:AppRouterInstance}) {

    const deletePost = async()=>{
        try{
            const data = await fetch('/apis/post',{
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({articleId:article_id})
            });
            const res:DeletePostApi = await data.json()
            if(res.success){
                router.refresh();
            }else{
                router.push('/')//not authorized
            }
        }catch(e){
            showToaster();
        }
    };
        
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
            <Button className="bg-red-700 cursor-pointer">
                <TrashIcon />
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete that Post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deletePost}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
