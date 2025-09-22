import { toast } from "sonner"


export default function showToaster(){
    toast('error happen!',{
        description: 'bla bla bla',
        action:{
            label: 'OK',
            onClick: ()=> console.log('')
        }
    });
}