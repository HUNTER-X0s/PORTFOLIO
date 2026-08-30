'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'
import { personalInfo, navItems } from '@/data/portfolio'
import { SocialIcon } from '@/components/icons/SocialIcons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-surface-1/80 backdrop-blur-xl pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Bio */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-4">
            <h3 className="text-2xl font-display font-bold text-text-primary tracking-wide">
              {personalInfo.firstName}<span className="text-cyan">.</span>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed pr-4">
              {personalInfo.shortBio}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {personalInfo.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.08] text-text-secondary hover:text-cyan hover:border-cyan/30 hover:bg-cyan/[0.05] transition-all duration-300"
                  title={social.platform}
                >
                  <SocialIcon platform={social.platform} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 lg:ml-8">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">Quick Links</h4>
            <ul className="space-y-3">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="text-cyan/0 group-hover:text-cyan transition-colors duration-200">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#blog" className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-cyan/0 group-hover:text-cyan transition-colors duration-200">›</span> Read Blog
                </Link>
              </li>
              <li>
                <Link href="#analytics" className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-cyan/0 group-hover:text-cyan transition-colors duration-200">›</span> View Analytics
                </Link>
              </li>
              <li>
                <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-cyan/0 group-hover:text-cyan transition-colors duration-200">›</span> Download Resume
                </a>
              </li>
              <li>
                <a href={personalInfo.social[0].url} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-cyan/0 group-hover:text-cyan transition-colors duration-200">›</span> GitHub Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-mono">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${personalInfo.email}`} className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:border-cyan/30 flex items-center justify-center transition-colors">
                    <Mail size={14} className="text-cyan/70 group-hover:text-cyan" />
                  </div>
                  <span className="truncate">{personalInfo.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${personalInfo.phone}`} className="text-sm text-text-secondary hover:text-cyan transition-colors duration-200 flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:border-cyan/30 flex items-center justify-center transition-colors">
                    <Phone size={14} className="text-cyan/70 group-hover:text-cyan" />
                  </div>
                  <span>{personalInfo.phone}</span>
                </a>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:border-cyan/30 flex items-center justify-center transition-colors shrink-0">
                  <MapPin size={14} className="text-cyan/70 group-hover:text-cyan" />
                </div>
                <span className="pt-1.5">{personalInfo.location}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-tertiary">
            &copy; {currentYear} <span className="text-text-secondary">{personalInfo.name}</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-text-tertiary">
            <span>Built by</span>
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue-400 to-violet-400">
              {personalInfo.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400/90 font-medium">Available for Opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
