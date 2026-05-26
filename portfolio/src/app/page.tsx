'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { personalInfo } from '@/data/portfolio'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useActiveSection } from '@/hooks'

// Layout (Static)
import Navbar from '@/components/layout/Navbar'
import ScrollProgress from '@/components/layout/ScrollProgress'
import Footer from '@/components/layout/Footer'

// Dynamic Component Imports (SSR-disabled for performance & code-splitting)
const CustomCursor = dynamic(() => import('@/components/layout/CustomCursor'), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/layout/CommandPalette'), { ssr: false })
const MusicModal = dynamic(() => import('@/components/layout/MusicModal'), { ssr: false })
const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false })

// Hero is above the fold — keep statically imported for FCP
import Hero from '@/components/sections/Hero'

// Below-fold sections stay code-split, but still server-render for crawlable HTML.
const About = dynamic(() => import('@/components/sections/About'))
const Skills = dynamic(() => import('@/components/sections/Skills'))
const Projects = dynamic(() => import('@/components/sections/Projects'))
const Experience = dynamic(() => import('@/components/sections/Experience'))
const GitHub = dynamic(() => import('@/components/sections/GitHub'))
const ValueProp = dynamic(() => import('@/components/sections/ValueProp'))
const Analytics = dynamic(() => import('@/components/sections/Analytics'))
const Blog = dynamic(() => import('@/components/sections/Blog'))
const Contact = dynamic(() => import('@/components/sections/Contact'))

// AI Chatbot & Voice Assistant (Dynamically Loaded)
const ChatBot = dynamic(() => import('@/components/ai/ChatBot'), { ssr: false })
const VoiceAssistant = dynamic(() => import('@/components/voice/VoiceAssistant'), { ssr: false })

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
          <section id="hero" style={{ scrollMarginTop: '72px' }}>
            <Hero />
          </section>

          <section id="about" style={{ scrollMarginTop: '72px' }}>
            <About />
          </section>

          <section id="skills" style={{ scrollMarginTop: '72px' }}>
            <Skills />
          </section>

          <section id="projects" style={{ scrollMarginTop: '72px' }}>
            <Projects />
          </section>

          <section id="experience" style={{ scrollMarginTop: '72px' }}>
            <Experience />
          </section>

          <section id="github" style={{ scrollMarginTop: '72px' }}>
            <GitHub />
          </section>

          <section id="value" style={{ scrollMarginTop: '72px' }}>
            <ValueProp />
          </section>

          <section id="analytics" style={{ scrollMarginTop: '72px' }}>
            <Analytics />
          </section>

          <section id="blog" style={{ scrollMarginTop: '72px' }}>
            <Blog />
          </section>

          <section id="contact" style={{ scrollMarginTop: '72px' }}>
            <Contact />
          </section>
        </main>

        <Footer />
      </div>

      {/* Floating AI Chatbot & Voice Assistant */}
      <ChatBot />
      <VoiceAssistant />
    </>
  )
}
