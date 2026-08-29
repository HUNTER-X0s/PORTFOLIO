import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { RoleId, ChatMessage } from '@/types'
import { musicPlaylist } from '@/data/music'

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
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void
  clearChat: () => void

  // Music & Playlist
  musicEnabled: boolean
  musicAsked: boolean
  currentTrackIndex: number
  volume: number
  isMusicPlayerOpen: boolean
  setMusicEnabled: (enabled: boolean) => void
  setMusicAsked: (asked: boolean) => void
  setCurrentTrackIndex: (index: number) => void
  setVolume: (volume: number) => void
  setMusicPlayerOpen: (open: boolean) => void
  nextTrack: () => void
  prevTrack: () => void

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
        updateChatMessage: (id, updates) =>
          set((state) => ({
            chatMessages: state.chatMessages.map((msg) =>
              msg.id === id ? { ...msg, ...updates } : msg
            ),
          })),
        clearChat: () => set({ chatMessages: [] }),

        // Music & Playlist
        musicEnabled: false,
        musicAsked: false,
        currentTrackIndex: 0,
        volume: 0.4,
        isMusicPlayerOpen: false,
        setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
        setMusicAsked: (asked) => set({ musicAsked: asked }),
        setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
        setVolume: (vol) => set({ volume: vol }),
        setMusicPlayerOpen: (open) => set({ isMusicPlayerOpen: open }),
        nextTrack: () =>
          set((state) => ({
            currentTrackIndex: (state.currentTrackIndex + 1) % musicPlaylist.length,
          })),
        prevTrack: () =>
          set((state) => ({
            currentTrackIndex:
              (state.currentTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length,
          })),

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
          theme: state.theme,
          soundEnabled: state.soundEnabled,
        }),
      }
    )
  )
)
