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
const AmbientSound = dynamic(() => import('@/components/layout/AmbientSound'), { ssr: false })
const MusicModal = dynamic(() => import('@/components/layout/MusicModal'), { ssr: false })
const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false })
const HUDOverlay = dynamic(() => import('@/components/space/HUDOverlay'), { ssr: false })

// Page Sections (Statically imported for instant rendering and zero black-screen lag on anchor jumps)
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Education from '@/components/sections/Education'
import ValueProp from '@/components/sections/ValueProp'
import Certifications from '@/components/sections/Certifications'
import Blog from '@/components/sections/Blog'
import Contact from '@/components/sections/Contact'

// AI Chatbot & Voice Assistant (Dynamically Loaded)
const ChatBot = dynamic(() => import('@/components/ai/ChatBot'), { ssr: false })
const VoiceAssistant = dynamic(() => import('@/components/voice/VoiceAssistant'), { ssr: false })

const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'value',
  'certifications',
  'blog',
  'contact',
]

export default function HomePage() {
  const { isLoaded, setIsLoaded } = usePortfolioStore()

  // Activate section tracking
  useActiveSection(SECTION_IDS)

  // Mark app as loaded after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [setIsLoaded])

  // Handle direct anchor link navigation smoothly upon page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Global UI Layer */}
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      <AmbientSound />
      <MusicModal />
      <HUDOverlay />

      {/* 3D Particle Background â€” sharp stars, 3D dynamic */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleField />
      </div>
      {/* Subtle dark veil to separate background from foreground text */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(2,2,9,0.25) 0%, rgba(2,2,9,0.15) 50%, rgba(2,2,9,0.3) 100%)' }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />

        <main className="noise-overlay">
          {/* Page Sections */}
          <section id="hero" style={{ scrollMarginTop: '72px' }}>
            <Hero />
          </section>

          <section id="about" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <About />
          </section>

          <section id="skills" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Skills />
          </section>

          <section id="projects" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Projects />
          </section>

          <section id="experience" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Experience />
          </section>

          <section id="education" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Education />
          </section>

          <section id="value" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <ValueProp />
          </section>

          <section id="certifications" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Certifications />
          </section>

          <section id="blog" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
            <Blog />
          </section>

          <section id="contact" className="section-optimized" style={{ scrollMarginTop: '72px' }}>
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
