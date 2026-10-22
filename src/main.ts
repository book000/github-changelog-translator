import XMLBuilder from 'fast-xml-builder'
import { XMLParser } from 'fast-xml-parser'
import fs from 'node:fs'
import path from 'node:path'

interface Feed {
  rss: {
    '@_xmlns:content': string
    '@_xmlns:wfw': string
    '@_xmlns:dc': string
    '@_xmlns:atom': string
    '@_version': string
    '@_xmlns:sy': string
    '@_xmlns:slash': string
    channel: {
      title: string
      link: string
      description: string
      lastBuildDate: string
      generator: string
      item: {
        title: string | null
        link: string
        comments: string
        pubDate: string
        category: string
        guid: string
        description: string
        'content:encoded': string | null
        'wfw:commentRss': string
        'slash:comments': string
      }[]
    }
  }
}

/**
 * Google Apps Script 経由でテキストを翻訳する。
 *
 * HTTP ステータスが 200 以外の場合、通信エラーの場合、レスポンスの JSON が不正な場合、
 * 翻訳結果が空文字の場合は、いずれも翻訳失敗として null を返す。
 * 呼び出し側は null の場合に原文を維持すること。
 *
 * @param message 翻訳対象のテキスト
 * @param before 翻訳元の言語
 * @param after 翻訳先の言語
 * @returns 翻訳結果。翻訳に失敗した場合は null
 * @throws GAS_URL が設定されていない場合
 */
async function translate(
  message: string,
  before: string,
  after: string
): Promise<string | null> {
  const GASUrl = process.env.GAS_URL
  if (!GASUrl) {
    throw new Error('GAS_URL is not set')
  }
  try {
    const response = await fetch(GASUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        before,
        after,
        text: message,
        mode: 'html',
      }),
    })
    if (response.status !== 200) {
      console.warn(`Translation API returned status ${response.status}`)
      return null
    }
    const data = (await response.json()) as {
      response?: {
        result?: unknown
      }
    }
    console.log(data)
    const result = data.response?.result
    if (typeof result !== 'string' || result.trim() === '') {
      console.warn('Translation API returned an empty or invalid result')
      return null
    }
    return result
  } catch (error) {
    console.warn('Translation API request failed:', error)
    return null
  }
}

/**
 * テキストを翻訳する。翻訳に失敗した場合は原文を返す。
 *
 * @param message 翻訳対象のテキスト
 * @param before 翻訳元の言語
 * @param after 翻訳先の言語
 * @returns 翻訳結果と、翻訳に成功したかどうか
 */
async function translateOrKeep(
  message: string,
  before: string,
  after: string
): Promise<{ text: string; translated: boolean }> {
  const result = await translate(message, before, after)
  return result === null
    ? { text: message, translated: false }
    : { text: result, translated: true }
}

async function main() {
  const githubChangeLogURL =
    process.env.GITHUB_CHANGELOG_URL ?? 'https://github.blog/changelog/feed/'
  const beforeLanguage = process.env.BEFORE_LANGUAGE ?? 'en'
  const afterLanguage = process.env.AFTER_LANGUAGE ?? 'ja'
  const outputChangeLogPath =
    process.env.OUTPUT_CHANGELOG_PATH ?? 'output/changelog.xml'

  const parser = new XMLParser({
    ignoreAttributes: false,
  })
  const response = await fetch(githubChangeLogURL)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const oldFeed: Feed = parser.parse(await response.text())
  let failedCount = 0
  for (const item of oldFeed.rss.channel.item) {
    const title = item.title
    const content = item['content:encoded']
    if (!title || !content) {
      continue
    }

    // 翻訳に失敗した場合は、タイトル・本文ごとに原文を維持する
    const translatedTitle = await translateOrKeep(
      title,
      beforeLanguage,
      afterLanguage
    )
    item.title = translatedTitle.text
    if (!translatedTitle.translated) {
      failedCount++
      console.warn(`Failed to translate title: ${item.link}`)
    }

    const translatedContent = await translateOrKeep(
      content,
      beforeLanguage,
      afterLanguage
    )
    item['content:encoded'] = translatedContent.text
    if (translatedContent.translated) {
      continue
    }

    failedCount++
    console.warn(`Failed to translate content: ${item.link}`)
  }
  if (failedCount > 0) {
    console.warn(
      `${failedCount} translation(s) failed; original text was kept for them`
    )
  }
  const builder = new XMLBuilder({
    ignoreAttributes: false,
  })
  const feed: string = builder.build(oldFeed)

  const outputDirectory = path.dirname(outputChangeLogPath)
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }
  fs.writeFileSync(outputChangeLogPath, feed)
}

;(async () => {
  await main()
})()
