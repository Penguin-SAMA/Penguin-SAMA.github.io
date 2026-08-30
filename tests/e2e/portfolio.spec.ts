import { expect, test, type Page, type TestInfo } from '@playwright/test'

const viewports = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-320x720', width: 320, height: 720 },
] as const

async function openPortfolio(
  page: Page,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('main')).toBeVisible()
  await page.waitForLoadState('networkidle')
}

test.describe('responsive portfolio shell', () => {
  for (const viewport of viewports) {
    test(`has no horizontal overflow at ${viewport.name}`, async ({ page }, testInfo: TestInfo) => {
      await openPortfolio(page, viewport)

      const layout = await page.evaluate(() => {
        const root = document.documentElement
        const body = document.body
        const clientWidth = root.clientWidth
        const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth)
        const offenders = Array.from(body.querySelectorAll<HTMLElement>('*'))
          .map((element) => {
            const rect = element.getBoundingClientRect()
            return {
              element: element.tagName.toLowerCase(),
              className: element.className.toString().slice(0, 100),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
            }
          })
          .filter(({ left, right }) => left < -1 || right > clientWidth + 1)
          .slice(0, 12)

        return { clientWidth, scrollWidth, offenders }
      })

      expect(
        layout.scrollWidth,
        `Horizontal overflow at ${viewport.name}: ${JSON.stringify(layout, null, 2)}`,
      ).toBeLessThanOrEqual(layout.clientWidth + 1)

      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}.png`),
        fullPage: true,
      })
    })
  }
})

test('desktop navigation scrolls to the selected section', async ({ page }) => {
  await openPortfolio(page, { width: 1440, height: 900 })

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const projectsLink = navigation.getByRole('link', { name: '作品', exact: true })
  const projectsSection = page.locator('#projects')

  await projectsLink.click()

  await expect(page).toHaveURL(/#projects$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  await expect.poll(() => projectsSection.evaluate((section) => {
    const rect = section.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.bottom > 0
  })).toBe(true)
})

test('requested brand and hero title stay on one line', async ({ page }) => {
  await openPortfolio(page, { width: 1440, height: 900 })

  const brand = page.locator('header strong')
  const heading = page.locator('h1')
  await expect(brand).toHaveText('毛启德-个人作品集')
  await expect(heading).toHaveAccessibleName('个人作品集')

  for (const element of [brand, heading]) {
    const metrics = await element.evaluate((node) => {
      const style = getComputedStyle(node)
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
      const lineTops: number[] = []
      let textNode = walker.nextNode()

      while (textNode) {
        const range = document.createRange()
        range.selectNodeContents(textNode)
        lineTops.push(
          ...Array.from(range.getClientRects(), (rect) => Math.round(rect.top)),
        )
        textNode = walker.nextNode()
      }

      return {
        lineCount: new Set(lineTops).size,
        whiteSpace: style.whiteSpace,
      }
    })

    expect(metrics.whiteSpace).toBe('nowrap')
    expect(metrics.lineCount).toBe(1)
  }
})

test('language switch updates copy, document language, and the URL query', async ({ page }) => {
  await openPortfolio(page, { width: 1440, height: 900 })

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('heading', { level: 1, name: '个人作品集' })).toBeVisible()

  const languageGroup = page.getByRole('group', { name: '切换语言' })
  await languageGroup.getByRole('button', { name: 'EN', exact: true }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible()
  await expect.poll(() => new URL(page.url()).searchParams.get('lang')).toBe('en')
  await expect(page.getByRole('group', { name: 'Switch language' })
    .getByRole('button', { name: 'EN', exact: true }))
    .toHaveAttribute('aria-pressed', 'true')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible()
  expect(new URL(page.url()).searchParams.get('lang')).toBe('en')
})

test('game project tags use distinct tinted backgrounds', async ({ page }) => {
  await openPortfolio(page, { width: 1440, height: 900 })

  const expectedCounts = [7, 4, 3]
  for (let projectIndex = 0; projectIndex < expectedCounts.length; projectIndex += 1) {
    const card = page.getByTestId('project-card').nth(projectIndex)
    await card.scrollIntoViewIfNeeded()
    const tags = card.getByRole('list', { name: '项目标签' }).getByRole('listitem')
    await expect(tags).toHaveCount(expectedCounts[projectIndex] ?? 0)

    const backgrounds = await tags.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).backgroundImage),
    )
    expect(new Set(backgrounds).size).toBe(backgrounds.length)
    expect(backgrounds.every((background) => background !== 'none')).toBe(true)
  }
})

test('mobile menu can be opened and navigated using only the keyboard', async ({ page }) => {
  await openPortfolio(page, { width: 390, height: 844 })

  const menuButton = page.locator('button[aria-controls="primary-navigation"]')
  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const homeLink = navigation.getByRole('link', { name: '首页', exact: true })
  const projectsLink = navigation.getByRole('link', { name: '作品', exact: true })

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await menuButton.focus()
  await expect(menuButton).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(navigation).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(homeLink).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(projectsLink).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  await expect(page).toHaveURL(/#projects$/)
})

test('reduced-motion preference disables hidden reveals and the cursor trail', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openPortfolio(page, { width: 1440, height: 900 })

  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

  const hiddenRevealCount = await page.locator('[data-testid="project-card"]').evaluateAll((cards) =>
    cards.reduce((count, card) => {
      const hiddenChildren = Array.from(card.children).filter(
        (child) => getComputedStyle(child).opacity === '0',
      )
      return count + hiddenChildren.length
    }, 0),
  )
  expect(hiddenRevealCount).toBe(0)

  await page.mouse.move(240, 180)
  const cursorLayerCount = await page.locator('[aria-hidden="true"]').evaluateAll((elements) =>
    elements.filter((element) => {
      const style = getComputedStyle(element)
      return style.position === 'fixed'
        && style.pointerEvents === 'none'
        && element.children.length === 2
    }).length,
  )

  expect(cursorLayerCount).toBe(0)
  await expect(page.locator('html')).not.toHaveAttribute('data-cursor-active', 'true')
})

test('placeholder media stays passive while the Reforge gallery switches real media', async ({ page }, testInfo) => {
  await openPortfolio(page, { width: 1440, height: 900 })

  const imageFrames = page.locator('[data-media-type="image"]')
  const placeholderLabels = page.getByText('项目素材待补充', { exact: true })
  await expect(imageFrames).toHaveCount(2)
  await expect(placeholderLabels).toHaveCount(3)

  for (let index = 0; index < await placeholderLabels.count(); index += 1) {
    const mediaContainer = placeholderLabels.nth(index).locator('xpath=ancestor::*[img][1]')
    await expect(mediaContainer.locator('button')).toHaveCount(0)
    await expect(mediaContainer.locator('video, iframe')).toHaveCount(0)
  }

  await expect(imageFrames.locator('button')).toHaveCount(0)
  await expect(imageFrames.locator('video, iframe')).toHaveCount(0)

  const reforgeCard = page.getByTestId('project-card').nth(0)
  await reforgeCard.scrollIntoViewIfNeeded()
  const gameplayVideo = reforgeCard.getByLabel('Reforge 原型演示视频', { exact: true })
  await expect(gameplayVideo).toBeVisible()
  await expect(gameplayVideo).toHaveAttribute('controls', '')
  await expect(gameplayVideo).toHaveAttribute('preload', 'metadata')
  await expect(gameplayVideo.locator('source')).toHaveAttribute('src', '/media/projects/reforge/reforge-gameplay.mp4')
  await expect(reforgeCard.getByRole('button')).toHaveCount(11)
  await reforgeCard.screenshot({ path: testInfo.outputPath('reforge-gallery-1440.png') })

  await reforgeCard.getByRole('button', { name: '切换至：PCG 森林生成效果' }).click()
  await expect(reforgeCard.getByRole('img', { name: '程序化生成的森林区域' })).toBeVisible()
  await expect(reforgeCard.getByText(/PCG 森林：/)).toBeVisible()

  await reforgeCard.getByRole('button', { name: '切换至：主角 GAS 系统演示' }).click()
  await expect(reforgeCard.getByLabel('主角 GAS 系统演示', { exact: true })).toBeVisible()
  await expect(reforgeCard.getByLabel('主角 GAS 系统演示', { exact: true }).locator('source'))
    .toHaveAttribute('src', '/media/projects/reforge/character-gas.mp4')

  const changjiangCard = page.getByTestId('project-card').nth(1)
  await changjiangCard.scrollIntoViewIfNeeded()
  const changjiangVideo = changjiangCard.getByLabel('《长江行》游戏演示', { exact: true })
  await expect(changjiangVideo).toBeVisible()
  await expect(changjiangVideo).toHaveAttribute('poster', '/media/projects/changjiang-journey/changjiang-journey-poster.webp')
  await expect(changjiangVideo.locator('source')).toHaveAttribute(
    'src',
    '/media/projects/changjiang-journey/changjiang-journey-demo.mp4',
  )
  await expect(changjiangCard.getByText(/01 \/ 01/)).toBeVisible()
  await changjiangCard.screenshot({ path: testInfo.outputPath('changjiang-journey-1440.png') })
})
