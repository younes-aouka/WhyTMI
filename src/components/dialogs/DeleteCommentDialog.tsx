import { DeleteCommentApi } from "@/APIResponseTypes";
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

export function DeleteCommentDialog({comment_id,router}:{comment_id:number,router:AppRouterInstance}) {

        const deleteComment = async()=>{
            try{
                const data = await fetch('/apis/comment',{
                    method: 'DELETE',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({commentId:comment_id})
                });
                const res:DeleteCommentApi = await data.json()
                if(res.success){
                    router.refresh();
                }else{
                    router.push('/')//not authorized
                }
            }catch(e){
                showToaster();
            }        
        }
        
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
            <Button className="bg-red-700 cursor-pointer">
                <TrashIcon />
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete that comment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteComment}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
