"use client"

export default function AboutPage() {
  return (
    <section className="container mx-auto px-6 py-12 max-w-3xl">
      {/* Hero / Title */}
      <h1 className="text-4xl font-bold mb-6 text-orange-500">
        About WhyTMI
      </h1>

      {/* What it is */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">What is WhyTMI?</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        Think of it like a lightweight Reddit, but focused purely on learning, problems, and solutions. 
        Whether you’re stuck on a coding issue, facing a technical roadblock, or just curious how others think through problems — WhyTMI gives you a space to ask and share.
      </p>

      {/* Purpose */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Why I Built It</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        WhyTMI started as a side project to sharpen my <span className="font-semibold">Next.js</span> and full-stack skills. 
        I wanted to challenge myself by building something real, and at the same time create a tool that can actually help people exchange knowledge.
      </p>

      <p className="text-sm text-gray-500 italic mt-10">
        Thanks for checking out WhyTMI. 🚀
      </p>
    </section>
  )
}
