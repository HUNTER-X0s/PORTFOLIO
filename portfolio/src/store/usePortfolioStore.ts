import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { RoleId, ChatMessage } from '@/types'

interface PortfolioStore {
  // Role system
  activeRole: RoleId
  setActiveRole: (role: RoleId) => void

  // UI state
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  isChatOpen: boolean
  setChatOpen: (open: boolean) => void
  chatMessages: ChatMessage[]
  addChatMessage: (message: ChatMessage) => void
  clearChat: () => void

  // Music
  musicEnabled: boolean
  musicAsked: boolean
  setMusicEnabled: (enabled: boolean) => void
  setMusicAsked: (asked: boolean) => void

  // Theme
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void

  // Cursor
  cursorVariant: 'default' | 'hover' | 'click' | 'text'
  setCursorVariant: (variant: 'default' | 'hover' | 'click' | 'text') => void

  // Navigation
  activeSection: string
  setActiveSection: (section: string) => void

  // Sound
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void

  // Loading
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void

  // Modal
  activeProjectId: string | null
  setActiveProjectId: (id: string | null) => void
}

export const usePortfolioStore = create<PortfolioStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        // Role
        activeRole: 'fullstack',
        setActiveRole: (role) => set({ activeRole: role }),

        // Command palette
        isCommandPaletteOpen: false,
        setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

        // Chat
        isChatOpen: false,
        setChatOpen: (open) => set({ isChatOpen: open }),
        chatMessages: [],
        addChatMessage: (message) =>
          set((state) => ({
            chatMessages: [...state.chatMessages, message],
          })),
        clearChat: () => set({ chatMessages: [] }),

        // Music
        musicEnabled: false,
        musicAsked: false,
        setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
        setMusicAsked: (asked) => set({ musicAsked: asked }),

        // Theme
        theme: 'dark',
        setTheme: (theme) => set({ theme }),

        // Cursor
        cursorVariant: 'default',
        setCursorVariant: (variant) => set({ cursorVariant: variant }),

        // Navigation
        activeSection: 'hero',
        setActiveSection: (section) => set({ activeSection: section }),

        // Sound
        soundEnabled: true,
        setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

        // Loading
        isLoaded: false,
        setIsLoaded: (loaded) => set({ isLoaded: loaded }),

        // Modal
        activeProjectId: null,
        setActiveProjectId: (id) => set({ activeProjectId: id }),
      }),
      {
        name: 'portfolio-store',
        partialize: (state) => ({
          activeRole: state.activeRole,
          musicEnabled: state.musicEnabled,
          musicAsked: state.musicAsked,
          theme: state.theme,
          soundEnabled: state.soundEnabled,
        }),
      }
    )
  )
)
