'use client'

import { useEffect } from 'react'
import { personalInfo } from '@/data/portfolio'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useActiveSection } from '@/hooks'

// Layout
import CustomCursor from '@/components/layout/CustomCursor'
import Navbar from '@/components/layout/Navbar'
import CommandPalette from '@/components/layout/CommandPalette'
import MusicModal from '@/components/layout/MusicModal'
import ScrollProgress from '@/components/layout/ScrollProgress'

// Background
import ParticleField from '@/components/three/ParticleField'

// Sections
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import GitHub from '@/components/sections/GitHub'
import ValueProp from '@/components/sections/ValueProp'
import Analytics from '@/components/sections/Analytics'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'

// AI Chatbot
import ChatBot from '@/components/ai/ChatBot'

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'github',
  'value',
  'analytics',
  'blog',
  'contact',
]

export default function HomePage() {
  const { isLoaded, setIsLoaded, musicAsked } = usePortfolioStore()

  // Activate section tracking
  useActiveSection(SECTION_IDS)

  // Mark app as loaded after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [setIsLoaded])

  // Preload sounds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        document.body.classList.add('mobile')
      }
    }
  }, [])

  return (
    <>
      {/* Global UI Layer */}
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      {!musicAsked && <MusicModal />}

      {/* 3D Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleField />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />

        <main className="noise-overlay">
          {/* Grid overlay */}
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-grid opacity-40"
            aria-hidden="true"
          />

          {/* Ambient glow orbs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full opacity-[0.06]"
              style={{ background: 'radial-gradient(circle, #00E5FF, transparent 70%)' }}
            />
            <div
              className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
            />
            <div
              className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]"
              style={{ background: 'radial-gradient(circle, #FF6B2B, transparent 70%)' }}
            />
          </div>

          {/* Page Sections */}
          <section id="hero">
            <Hero />
          </section>

          <section id="about">
            <About />
          </section>

          <section id="skills">
            <Skills />
          </section>

          <section id="projects">
            <Projects />
          </section>

          <section id="experience">
            <Experience />
          </section>

          <section id="github">
            <GitHub />
          </section>

          <section id="value">
            <ValueProp />
          </section>

          <section id="analytics">
            <Analytics />
          </section>

          <section id="blog">
            <Blog />
          </section>

          <section id="contact">
            <Contact />
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.05] py-8">
          <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-sm text-text-secondary">
              <span className="text-cyan">{'>'}</span>{' '}
              <span className="text-text-primary font-semibold">{personalInfo.name}</span> — Crafted with
              Next.js, Three.js & ♥
            </p>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <span className="font-mono">v1.0.0</span>
              <span>·</span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:text-cyan transition-colors duration-200"
              >
                {personalInfo.email}
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating AI Chatbot */}
      <ChatBot />
    </>
  )
}
