import { z } from "zod";

export const SignInFormShema = z.object({
  email: z.email({message:'please enter a valid email !'}).trim(),
  password: z.string().min(4,{message: 'please enter a valid password !(at least 4 characters)'})
  .max(7,{message:'password should not pass 7 characters !'}).trim()
});
export type SignInFormValues = z.infer<typeof SignInFormShema>;


export const SignUpFormShema = z.object({
  fullName: z.string().min(4,{message:'your full_name must be at least 4 characters !'})
  .max(15,{message:'your full_name lenght must not pass 15 characters'}).trim(),
  email: z.email({message:'please enter a valid email !'}).trim(),
  password: z.string().min(4,{message: 'please enter a valid password !(at least 4 characters)'})
  .max(7,{message:'password should not pass 7 characters !'}).trim(),
  confirmPassword: z.string().trim()
}).refine(({password,confirmPassword})=>{
  return password === confirmPassword
},{message:'passwords should match !',path: ["confirmPassword"]});
export type SignUpFormValues = z.infer<typeof SignUpFormShema>;


export const ResetPasswordFormShema = z.object({
  email: z.email({message:'please enter a valid email !'}).trim(),
})
export type resetPasswordFormValues = z.infer<typeof ResetPasswordFormShema>;


export const NewPasswordFormShema = z.object({
  token: z.string(),
  password: z.string().min(4,{message: 'please enter a valid password !(at least 4 characters)'})
  .max(7,{message:'password should not pass 7 characters !'}).trim(),
  confirmPassword: z.string().trim()
}).refine(({password,confirmPassword})=>{
  return password === confirmPassword
},{message:'passwords should match !',path: ["confirmPassword"]});
export type NewPasswordFormValues = z.infer<typeof NewPasswordFormShema>;


export const ProfileFormShema = z.object({
  fullName: z.string().min(4,{message:'your full_name must be at least 4 characters !'}).trim()
  .max(15,{message:'your full_name lenght must not pass 15 characters'}),
  email: z.email({message:'please enter a valid email !'}),
  password: z.string().min(4,{message: 'please enter a valid password !(at least 4 characters)'})
  .max(7,{message:'password should not pass 7 characters !'}).trim(),
});
export type ProfileFormValues = z.infer<typeof ProfileFormShema>;


export const NewPostFormShema = z.object({
  title: z.string().min(3,{message:'please enter a valid title!(between 3 and 50 characters)'}).max(50).trim() ,
  categorie: z.string().nonempty('please choose a categorie!'),
  post: z.string().trim().min(3,{message:'your post should be at least 3 characters'})
  .max(200,{message:'your post shouldn\'t pass 200 characters!'})
});
export type NewPostFormValues = z.infer<typeof NewPostFormShema>;


export const UpdatePostFormShema = z.object({
  title: z.string().min(3,{message:'please enter a valid title!(between 3 and 50 characters)'}).max(50).trim() ,
  categorie: z.string().nonempty('please choose a categorie!'),
  post: z.string().trim().min(3,{message:'your post should be at least 3 characters'})
  .max(200,{message:'your post shouldn\'t pass 200 characters!'}),
  articleId: z.number()
});
export type UpdatePostFormValues = z.infer<typeof UpdatePostFormShema>;


export const CommentShema = z.string()
.min(1,{message:'comment should be at least 1 character long!'})
.max(200,{message:'comment shouldn\'t pass 200 characters'}).trim();
export type Comment = {
  comment_id:number,
  commenter_id:number,
  commenter_name:string,
  avatar:string,
  created_at:Date,
  comment_content:string
}


