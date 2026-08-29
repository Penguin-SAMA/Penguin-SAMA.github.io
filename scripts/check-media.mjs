import { readdir, stat } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const MEBIBYTE = 1024 * 1024
const MAX_VIDEO_BYTES = 20 * MEBIBYTE
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.mov'])

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..')
const mediaRoot = join(projectRoot, 'public', 'media')

const displayPath = (path) => relative(projectRoot, path).split(sep).join('/')
const displaySize = (bytes) => `${(bytes / MEBIBYTE).toFixed(2)} MiB`

async function collectVideos(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const videos = []

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      videos.push(...(await collectVideos(entryPath)))
      continue
    }

    if (entry.isFile() && VIDEO_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      videos.push(entryPath)
    }
  }

  return videos
}

async function main() {
  let videos

  try {
    videos = await collectVideos(mediaRoot)
  } catch (error) {
    if (error?.code === 'ENOENT') {
      console.log('Media check: public/media does not exist; checked 0 video files.')
      return
    }

    throw error
  }

  console.log(
    `Media check: maximum video size is 20 MiB (${MAX_VIDEO_BYTES.toLocaleString('en-US')} bytes).`,
  )

  const oversized = []

  for (const video of videos) {
    const { size } = await stat(video)
    const exceedsLimit = size > MAX_VIDEO_BYTES
    const result = exceedsLimit ? 'FAIL' : 'OK'

    console.log(`[${result}] ${displayPath(video)} - ${displaySize(size)} (${size} bytes)`)

    if (exceedsLimit) {
      oversized.push({ path: video, size })
    }
  }

  if (videos.length === 0) {
    console.log('Media check: no .mp4, .webm, .ogg, or .mov files found under public/media.')
  }

  console.log(`Media check: checked ${videos.length} video file${videos.length === 1 ? '' : 's'}.`)

  if (oversized.length > 0) {
    console.error(`Media check failed: ${oversized.length} video file${oversized.length === 1 ? '' : 's'} exceed 20 MiB:`)

    for (const video of oversized) {
      console.error(`- ${displayPath(video.path)} (${displaySize(video.size)})`)
    }

    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('Media check failed unexpectedly.')
  console.error(error)
  process.exitCode = 1
})
