import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';


export default function Home() {
  return (
    <div>
      <main className="bg-slate-50 text-slate-900">
      
      {/* === Hero Section === */}
      {/* A modern hero with a gradient background, a "bento box" grid, and social proof. */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
          
          <div className="max-w-3xl text-center mx-auto">
            <div className='flex'><Image src="/logo.png" width={70}height={50}alt='logo' className='p-2'></Image> 
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl leading-tight flex text-center">              
              TaskManager
            </h1></div>
            <div className="flex justify-center items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                    <Star fill="currentColor" className="w-5 h-5" />
                </div>
                <span className="text-sm text-slate-600 font-medium">Loved by 50,000+ users</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl leading-tight">
              Where Great Work <span className="text-blue-600">Begins</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop scattering your tasks across different apps. TaskManager is the all-in-one command center for your personal and professional projects.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login" className="group flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                Get Started Free <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          
        </div>
      </section>

      {/* === Features Section === */}
      {/* This section uses a cleaner, more spaced-out layout with modern icons. */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base font-semibold leading-7 text-blue-600">Your Workflow, Supercharged</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A Better Way to Manage Everything
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              TaskManager is designed to be flexible and adapt to your needs, not the other way around.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    {/* Icon placeholder */}
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
                  </div>
                  Focus on What Matters
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Create custom views, filters, and tags to see only the tasks relevant to you right now.</p>
                </dd>
              </div>
               <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    {/* Icon placeholder */}
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  Hit Every Deadline
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">Use our timeline and calendar views to plan your projects and ensure nothing slips through the cracks.</p>
                </dd>
              </div>
               <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                     {/* Icon placeholder */}
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.752 3.752 0 01-4.131 0m3.75 14.25a3.752 3.752 0 01-4.131 0M3 3h18M3 7.5h18M3 12h18m-9.75 4.5h4.5m-12 4.5h12m-3.75-13.5h3.75" /></svg>
                  </div>
                  Scale with Your Team
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">From solo freelancers to enterprise teams, TaskManager provides the tools you need to collaborate effectively.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      
      {/* === Final CTA Section === */}
      {/* A bold, simple, and direct call-to-action to drive conversions. */}
      <section className="bg-white">
          <div className="container mx-auto px-6 py-24 sm:py-32 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Ready to dive in?
                      <br />
                      Start your free trial today.
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                      Take control of your productivity. No credit card required, cancel anytime.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                      <Link href="/signup" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                          Sign Up for Free
                      </Link>
                  </div>
              </div>
          </div>
      </section>

    </main>
    </div>
  );
}
