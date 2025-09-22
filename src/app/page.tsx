import Image from "next/image";

export default function Home() {
    return (
      <div className="px-7 md:px-14">
        <div className="h-[calc(100vh-4rem)] flex justify-between items-center">
          <section className="p-3 lg:max-w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Understand why they made it !</h1>
            <p className="text-xl md:text-2xl font-semibold">tired of technical difinitions that need difinitions ? problem with no solution? you are in the right place , search for your problem or even post it and get feedback from all world wide! </p>
          </section>
          <section className="h-full w-full hidden lg:flex lg:items-center justify-center relative ">
            <Image src={'/images/hero.jpg'} alt="hero image" width={400} height={600}
            className="w-full rounded-lg "/>
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-l from-transparent via-transparent to-white"></div>
          </section> 
        </div>
        <div className="absolute top-0 left-0 w-full h-full lg:w-1/2 bg-linear-to-r
                     from-amber-500 via-amber-400 to-transparent -z-10 rounded-lg"></div>
      </div>
    );
}
