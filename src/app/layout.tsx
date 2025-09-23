import "./globals.css";
import { cairo } from "@/components/fonts";
import { cookies} from "next/headers";
import { checkSignInNonMiddlware } from "@/utils/checkSignInNonMiddlware";
import { Toaster } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'WhyTMI',
  description:'WhyTMI helps you understand complex problems with clear explanations and community feedback. Search, share, and solve together.',
  icons:{
    icon: "/images/favicon.ico",
    shortcut: "/favicon.ico"
  }
}

export default async function RootLayout({children,}:{children: React.ReactNode;}) {
  const session = (await cookies()).get('session');
  const signIn = await checkSignInNonMiddlware(session)
  return (
    <html lang="en">
      <body className={cairo.className}>

        <Toaster position="top-center"/>

        <Header signIn={signIn} />

        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>

        <Footer />
        
      </body>
    </html>
  );
}
