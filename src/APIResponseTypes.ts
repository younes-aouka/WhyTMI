
export type PostSignInApi = {
    success: boolean,
    email_verified: boolean| null,
    errors:{
        db: boolean|null, 
        email: boolean,
        password: boolean
    } 
}

export type PostSignUpApi = {
    success:boolean,
    errors:{
        db: boolean|null,
        fullName: boolean,
        email: boolean,
        password: boolean,
        confirmPassword: boolean,                        
    }                    
}

export type PatchUserApi = {
    success:boolean,
    errors:{
        db: boolean|null,
        fullName: boolean,
        password: boolean,
    }                    
}

export type PostResetPasswordApi ={
    success: boolean,
    errors: {
        db: boolean|null,
        email: boolean
    },
}

export type PatchResetPasswordApi = {
    success: boolean,
    errors: {
        token: boolean,
        password: boolean,
        confirmPassword: boolean,
    },
}

export type PostPostApi = {
    success: boolean,
    errors:{
        db: boolean|null,
        title: boolean,
        post: boolean,
        categorie:boolean
    } 
}

export type DeletePostApi = {
    success:boolean
}

export type PutPostApi ={
    success: boolean,
    errors:{
        authorization:boolean, 
        db:boolean|null,
        title: boolean|null,
        post: boolean|null,
        categorie: boolean|null
    } 
}

export type PostCommentApi = {
    success:boolean
}

export type DeleteCommentApi = {
    success:boolean
}

export type PutCommentApi = {
    success: boolean,
    errors:{
        authorization:boolean|null,
    }    
}