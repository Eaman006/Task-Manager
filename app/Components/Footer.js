import { Mail, Phone, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <div>
        <footer className="bg-slate-800 text-slate-400">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left Side: Attribution */}
          <div className="text-center md:text-left">
            <p className="font-bold text-lg text-white">TaskManager</p>
            <p className="text-sm">Created by Eaman Adeep</p>
          </div>

          {/* Right Side: Social and Contact Links */}
          <div className="flex items-center gap-6">
            <a 
              href="mailto:eamanadeep006@gmail.com" 
              aria-label="Email"
              className="hover:text-white transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a 
              href="tel:+919330703931" 
              aria-label="Phone"
              className="hover:text-white transition-colors"
            >
              <Phone className="w-6 h-6" />
            </a>
            <a 
              href="https://github.com/Eaman006" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/md-eaman-adeep-219628278" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TaskManager. All rights reserved.</p>
        </div>
      </div>
    </footer>
      
    </div>
  )
}

export default Footer
