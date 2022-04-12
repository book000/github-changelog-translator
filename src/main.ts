import axios from 'axios'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import fs from 'fs'

async function translate(
  message: string,
  before = 'en',
  after = 'ja'
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
  const parser = new XMLParser({
    ignoreAttributes: false,
  })
  const response = await axios.get('https://github.blog/changelog/feed/')
  const oldFeed = parser.parse(response.data)
  for (const item of oldFeed.rss.channel.item) {
    const title = item.title

    item.title = await translate(title)
    item['content:encoded'] = await translate(item['content:encoded'])
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
  })
  const feed = builder.build(oldFeed)

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output')
  }
  fs.writeFileSync('output/changelog.xml', feed.toString())
}

;(async () => {
  await main()
})()
