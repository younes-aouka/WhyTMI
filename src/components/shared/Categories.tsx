import { db } from "@/ConnectDB"

type categorie = {
    categorie_name: string
}

export default async function Categories() {
    const categories: Array<categorie> = await db.query('SELECT categorie_name FROM categorie;');
    return (
        <>
            <option value="">-- Select a categorie --</option>
            {categories.map((categorie,index)=>{
                return(
                    <option value={categorie.categorie_name} key={index} className="">{categorie.categorie_name}</option>
                )
            })}
        </>

    )
}
