'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, ArrowUpRight, Sparkles } from 'lucide-react'
import { personalInfo, navItems } from '@/data/portfolio'

function ThreadsIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 192 192"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C77.0123 44.745 61.4284 55.4858 54.3414 74.2435C48.0697 90.8415 50.4908 111.458 60.7725 125.753C70.1837 138.835 84.767 146.255 101.895 146.255C120.301 146.255 135.035 137.669 141.564 122.842C144.385 116.438 145.827 109.112 145.856 101.077H126.791C126.657 121.217 114.739 129.213 101.328 129.213C85.5771 129.213 71.3653 118.847 68.3297 95.8451C73.3444 98.4116 79.2882 100.089 86.0617 100.49C96.7997 101.127 107.563 98.0566 114.869 92.2773C122.88 85.9388 127.353 76.5186 127.445 65.7383C127.561 52.0723 118.665 44.745 97.222 44.745C80.3644 44.745 68.0494 54.4092 63.4862 70.9785C59.7126 84.6781 60.5283 102.735 69.1767 114.761C76.2483 124.596 87.4114 130.222 100.672 130.222C115.756 130.222 125.438 121.849 125.759 107.135C125.793 105.589 125.793 104.043 125.759 102.497L141.537 88.9883ZM108.643 78.4316C104.757 81.5088 98.6656 83.1816 91.4365 82.7539C84.3496 82.334 78.415 80.0879 73.7431 76.082C76.8407 68.3496 83.9579 61.7871 97.222 61.7871C107.96 61.7871 110.871 66.8633 110.803 72.8223C110.745 74.9629 109.967 76.9941 108.643 78.4316Z" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Helper to render correct icon based on platform string
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github size={18} />
      case 'linkedin': return <Linkedin size={18} />
      case 'twitter': return <Twitter size={18} />
      case 'instagram': return <Instagram size={18} />
      case 'threads': return <ThreadsIcon size={18} />
      default: return <ArrowUpRight size={18} />
    }
  }

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
                  {renderSocialIcon(social.platform)}
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
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-text-tertiary">Engineered with</span>
            <Sparkles size={14} className="text-cyan animate-pulse" />
            <span className="text-text-tertiary">&amp; neural precision by</span>
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
