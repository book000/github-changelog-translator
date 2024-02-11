import axios from 'axios'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import fs from 'node:fs'
import path from 'node:path'

async function translate(
  message: string,
  before: string,
  after: string
): Promise<string | null> {
  const GASUrl = process.env.GAS_URL
  if (!GASUrl) {
    throw new Error('GAS_URL is not set')
  }
  const response = await axios.post(
    GASUrl,
    {
      before,
      after,
      text: message,
      mode: 'html',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
  )
  if (response.status !== 200) {
    return null
  }
  console.log(response.data)
  return response.data.response.result
}

async function main() {
  const githubChangeLogURL =
    process.env.GITHUB_CHANGELOG_URL || 'https://github.blog/changelog/feed/'
  const beforeLanguage = process.env.BEFORE_LANGUAGE || 'en'
  const afterLanguage = process.env.AFTER_LANGUAGE || 'ja'
  const outputChangeLogPath =
    process.env.OUTPUT_CHANGELOG_PATH || 'output/changelog.xml'

  const parser = new XMLParser({
    ignoreAttributes: false,
  })
  const response = await axios.get(githubChangeLogURL)
  const oldFeed = parser.parse(response.data)
  for (const item of oldFeed.rss.channel.item) {
    const title = item.title

    item.title = await translate(title, beforeLanguage, afterLanguage)
    item['content:encoded'] = await translate(
      item['content:encoded'],
      beforeLanguage,
      afterLanguage
    )
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
  })
  const feed = builder.build(oldFeed)

  const outputDirectory = path.dirname(outputChangeLogPath)
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }
  fs.writeFileSync(outputChangeLogPath, feed.toString())
}

;(async () => {
  await main()
})()
