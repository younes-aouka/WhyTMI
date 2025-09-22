import { cookies } from "next/headers";
import { getUserId } from "@/utils/getUserId";
import { db } from "@/ConnectDB";
import ProfileForm from "@/components/forms/ProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = await getUserId(cookieStore);
  const {full_name,email,profile_img_path} = await db.one('SELECT * FROM account WHERE user_id = ${userId};',{userId:userId});
  return (
    <ProfileForm full_name={full_name} email={email} profile_img_path={profile_img_path}/>
  );
}
