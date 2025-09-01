"use client"
import React from 'react'
const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.248c-1.645,3.242-2.584,6.938-2.584,10.752c0,3.814,0.939,7.51,2.584,10.752
      l-5.657,5.657C1.046,37.893,0,31.25,0,24C0,16.75,1.046,10.107,2.929,5.591L8.586,11.248
      C7.45,12.477,6.712,13.34,6.306,14.248z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-5.657-5.657c-1.896,1.295-4.225,2.093-6.752,2.093
      c-4.434,0-8.23-2.636-9.866-6.289l-5.656,5.656C11.583,38.42,17.38,44,24,44z"
    />
    <path
      fill="#1565C0"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
      l5.657,5.657C39.849,36.31,44,30.603,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);


const page = () => {
  return (
    <div>
       <style jsx global>{`
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        /* New Fade-in Animation */
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards; /* 0.8s duration, ease-out timing */
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); } /* Start slightly below and invisible */
            to { opacity: 1; transform: translateY(0); }     /* End at original position and fully visible */
        }
      `}</style>
    
      <div className="fixed inset-0 bg-slate-900 overflow-hidden">
        
        {/* Container for the animated blobs */}
        <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-lighten filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Container for the centered login card */}
        <div className="relative min-h-full flex items-center justify-center">
          <div className="w-full max-w-md m-4">
            {/* The Login Panel with the new fade-in animation */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-fade-in">
              <div className="p-8 sm:p-10">
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                    Welcome to TaskManager
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base">
                    The command center for your projects. Sign in to continue.
                  </p>
                </div>

                <div className="mt-10">
                  <button
                    className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3.5 text-base font-semibold text-slate-800 transition-transform duration-300 hover:scale-105 active:scale-100"
                  >
                    <GoogleIcon />
                    <span className="relative">Sign in with Google</span>
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-400">
                    By signing in, you agree to our{' '}
                    <a href="#" className="font-semibold text-slate-300 hover:text-white">
                      Terms of Service
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default page
