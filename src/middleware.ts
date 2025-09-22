import { NextRequest,NextResponse } from "next/server"; 
import { checkSignIn } from "./utils/checkSignIn";

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const signIn = await checkSignIn(session);
    if(
        signIn&&
        (
            request.nextUrl.pathname==='/sign-in'||
            request.nextUrl.pathname==='/sign-up'||
            request.nextUrl.pathname==='/reset-password'||
            request.nextUrl.pathname==='/verify-email'||
            request.nextUrl.pathname==='/apis/sign-in'||
            request.nextUrl.pathname==='/apis/sign-up'||
            request.nextUrl.pathname==='/apis/reset-password'
        )
    ){
        return NextResponse.redirect(new URL("/", request.url));
    }
    else if(
        !signIn&&
        (
            request.nextUrl.pathname==='/profile'||
            request.nextUrl.pathname==='/my-posts'||
            request.nextUrl.pathname.startsWith('/my-posts/')||
            request.nextUrl.pathname==='/new-post'||
            request.nextUrl.pathname==='/apis/user'||
            request.nextUrl.pathname==='/apis/post'||
            request.nextUrl.pathname==='/apis/comment'
        )
    ){
        return NextResponse.redirect(new URL("/sign-in", request.url)) ;
    }else{
        return NextResponse.next();
    }
}
