import React from 'react'
import { Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react'

export function ThreadsIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="46 42 102 106"
      fill="currentColor"
      className={className}
      aria-label="Threads"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C77.0123 44.745 61.4284 55.4858 54.3414 74.2435C48.0697 90.8415 50.4908 111.458 60.7725 125.753C70.1837 138.835 84.767 146.255 101.895 146.255C120.301 146.255 135.035 137.669 141.564 122.842C144.385 116.438 145.827 109.112 145.856 101.077H126.791C126.657 121.217 114.739 129.213 101.328 129.213C85.5771 129.213 71.3653 118.847 68.3297 95.8451C73.3444 98.4116 79.2882 100.089 86.0617 100.49C96.7997 101.127 107.563 98.0566 114.869 92.2773C122.88 85.9388 127.353 76.5186 127.445 65.7383C127.561 52.0723 118.665 44.745 97.222 44.745C80.3644 44.745 68.0494 54.4092 63.4862 70.9785C59.7126 84.6781 60.5283 102.735 69.1767 114.761C76.2483 124.596 87.4114 130.222 100.672 130.222C115.756 130.222 125.438 121.849 125.759 107.135C125.793 105.589 125.793 104.043 125.759 102.497L141.537 88.9883ZM108.643 78.4316C104.757 81.5088 98.6656 83.1816 91.4365 82.7539C84.3496 82.334 78.415 80.0879 73.7431 76.082C76.8407 68.3496 83.9579 61.7871 97.222 61.7871C107.96 61.7871 110.871 66.8633 110.803 72.8223C110.745 74.9629 109.967 76.9941 108.643 78.4316Z" />
    </svg>
  )
}

export function SocialIcon({ platform, size = 20, className = '' }: { platform: string; size?: number; className?: string }) {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github size={size} className={className} />
    case 'linkedin':
      return <Linkedin size={size} className={className} />
    case 'twitter':
      return <Twitter size={size} className={className} />
    case 'instagram':
      return <Instagram size={size} className={className} />
    case 'threads':
      return <ThreadsIcon size={size} className={className} />
    default:
      return <ArrowUpRight size={size} className={className} />
  }
}
