import { ReactNode } from 'react'

interface FeatureCardProps { 
  title: string; 
  desc: string; 
  cta: string; 
  href: string;
  icon: ReactNode;
  gradient: string;
}

export default function FeatureCard({ title, desc, cta, href, icon, gradient }: FeatureCardProps) {
  return (
    <a 
      href={href} 
      className="group block card p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      aria-label={`${title} - ${desc}`}
    >
      {/* Icon */}
      <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-neutral-600 leading-relaxed text-lg">
          {desc}
        </p>
        
        {/* CTA */}
        <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
          <span>{cta}</span>
          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </a>
  )
}
