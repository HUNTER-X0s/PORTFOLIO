import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Anurag Swain - AI Engineer and Full Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#020209',
          color: '#f5f7fb',
          padding: 72,
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 18% 20%, rgba(0,229,255,0.32), transparent 34%), radial-gradient(circle at 86% 18%, rgba(255,107,43,0.26), transparent 30%), radial-gradient(circle at 64% 88%, rgba(124,58,237,0.34), transparent 38%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 32,
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 28,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              color: '#00e5ff',
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            AI Engineer | Full Stack Developer | ML Portfolio
          </div>
          <div
            style={{
              fontSize: 86,
              lineHeight: 0.98,
              fontWeight: 800,
              letterSpacing: 0,
              maxWidth: 940,
            }}
          >
            Anurag Swain
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: '#c8d0e0',
              maxWidth: 920,
            }}
          >
            Building AI, machine learning, data science, and full-stack web systems with
            Python, React, Next.js, and deep learning tools.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 18,
            zIndex: 1,
            fontSize: 28,
            color: '#f5f7fb',
          }}
        >
          {['GCE Kalahandi', 'Bhubaneswar, India', 'Open to SDE / AI / ML roles'].map((item) => (
            <div
              key={item}
              style={{
                padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
