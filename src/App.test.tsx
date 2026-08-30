import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import App from './App'
import { LOCALE_STORAGE_KEY } from './hooks/useLocale'

const projectTitles = [
  '基于 UE5.8 的第一人称射击游戏 DEMO',
  '基于 UE5.6 的俯视角多人联机生存建造游戏',
  '基于 Godot 的武汉历史文化文字冒险游戏',
  'Hazel C++ 游戏引擎的现代化改造',
]

describe('portfolio page', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/portfolio')
    document.documentElement.lang = 'en'
  })

  afterEach(() => {
    cleanup()
    delete document.body.dataset.menuOpen
  })

  it('renders Chinese by default', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '个人作品集',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '精选作品' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '跳到主要内容' })).toBeInTheDocument()

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('zh-CN')
      expect(document.title).toBe('毛启德｜游戏客户端开发作品集')
    })
  })

  it('switches to English and synchronizes URL and localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'EN' }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Portfolio',
        }),
      ).toBeInTheDocument()
      expect(window.location.search).toBe('?lang=en')
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en')
      expect(document.documentElement.lang).toBe('en')
      expect(document.title).toBe('Qide Mao | Game Client Development Portfolio')
    })
  })

  it('keeps the four resume projects in strict order', () => {
    render(<App />)

    const cards = screen.getAllByTestId('project-card')
    expect(cards).toHaveLength(4)
    expect(
      cards.map((card) => within(card).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(projectTitles)
  })

  it('uses the exact public email and GitHub destinations', () => {
    render(<App />)

    const emailLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href="mailto:penguinsama8@gmail.com"]',
      ),
    )
    const githubLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href="https://github.com/Penguin-SAMA"]',
      ),
    )

    expect(emailLinks).toHaveLength(1)
    expect(emailLinks[0]).toHaveAttribute(
      'href',
      'mailto:penguinsama8@gmail.com',
    )
    expect(githubLinks.length).toBeGreaterThanOrEqual(2)
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://github.com/Penguin-SAMA')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('does not expose private resume fields or a resume download', () => {
    const { container } = render(<App />)
    const publicText = container.textContent ?? ''
    const hrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a'))
      .map((link) => link.getAttribute('href') ?? '')
      .join(' ')

    expect(publicText).not.toMatch(/(?:^|\D)1[3-9]\d{9}(?:\D|$)/)
    expect(publicText).not.toMatch(
      /手机(?:号|号码)?|联系电话|电话号码|微信(?:号|号码)?|性别|证件照|简历下载|下载简历/i,
    )
    expect(publicText).not.toMatch(
      /\b(?:phone|mobile|wechat|gender|sex|resume download|download resume|download cv)\b/i,
    )
    expect(container.querySelector('a[download]')).not.toBeInTheDocument()
    expect(hrefs).not.toMatch(
      /\.pdf(?:[?#]|$)|(?:^|\/)(?:resume|curriculum-vitae|cv)(?:[./?#]|$)/i,
    )
  })

  it('renders placeholder images without play or empty detail controls', () => {
    render(<App />)

    const cards = screen.getAllByTestId('project-card')
    cards.forEach((card) => {
      const image = within(card).getByRole('img')
      expect(image).toHaveAttribute('src', expect.stringMatching(/^\/media\/placeholders\/.+\.webp$/))
      expect(within(card).getByText('项目素材待补充')).toBeInTheDocument()
      expect(within(card).queryByRole('button')).not.toBeInTheDocument()
      expect(within(card).queryByRole('link')).not.toBeInTheDocument()
    })

    expect(screen.queryByText(/查看详情|View details/i)).not.toBeInTheDocument()
  })
})
