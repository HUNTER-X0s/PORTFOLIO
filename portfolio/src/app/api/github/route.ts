import { NextResponse } from 'next/server'

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'HUNTER-X0s'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
}
if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour instead of generating statically at build

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`, { headers }),
    ])

    if (!userRes.ok) {
      throw new Error('Failed to fetch GitHub user')
    }

    const user = await userRes.json()
    const repos = await reposRes.json()

    // Compute stats
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0)

    // Language frequency
    const languageCounts: Record<string, number> = {}
    repos.forEach((repo: any) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    })
    const totalLangCount = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languageColors: Record<string, string> = {
      Python: '#3572A5',
      TypeScript: '#2b7489',
      JavaScript: '#f1e05a',
      CSS: '#563d7c',
      Shell: '#89e051',
      HTML: '#e34c26',
      Java: '#b07219',
      Go: '#00ADD8',
    }
    const topLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangCount) * 100),
        color: languageColors[name] || '#8B8BA7',
      }))

    return NextResponse.json({
      username: user.login,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      topLanguages,
      profileUrl: user.html_url,
    })
  } catch (error) {
    console.error('[GitHub API Error]', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 })
  }
}
