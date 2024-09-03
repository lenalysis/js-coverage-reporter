import * as core from '@actions/core'
import { CoverageSummary, readJsonSummaryFile } from './read-json-summary-file'
import { writeFileAsync } from './write-file-async'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const title: string = core.getInput('title')
    const srcBasePath: string = core.getInput('src-base-path')
    const urlBasePath: string = core.getInput('url-base-path')
    const jsonSummaryFilePath: string = core.getInput('json-summary-file-path')
    const outputFilePath: string = core.getInput('output-file-path')

    core.debug(`Title: ${title}`)
    core.debug(`SrcBasePath: ${srcBasePath}`)
    core.debug(`UrlBasePath: ${urlBasePath}`)
    core.debug(`JsonSummaryFilePath: ${jsonSummaryFilePath}`)
    core.debug(`OutputFilePath: ${outputFilePath}`)

    const jsonSummary = await readJsonSummaryFile(jsonSummaryFilePath)
    const modifiedSummary: CoverageSummary = {}
    const total = jsonSummary.total
    let md = ''
    for (const key in jsonSummary) {
      if (key === 'total') {
        continue
      }
      if (!key.startsWith(srcBasePath)) {
        core.debug(`key ${key} does not start with ${srcBasePath}`)
        continue
      }
      const modifiedKey = key.substring(srcBasePath.length)
      modifiedSummary[modifiedKey] = jsonSummary[key]
    }

    core.debug(`Modified summary: ${JSON.stringify(modifiedSummary)}`)

    md += `### ${title}\n`
    md += '|File|% Stmts|% Branch|% Funcs|% Lines\n'
    md += '|----|-------|--------|-------|-------\n'
    md += `|(total)|${total.statements.pct}|${total.branches.pct}|${total.functions.pct}|${total.lines.pct}\n`
    for (const shortName in modifiedSummary) {
      const fullName = `${urlBasePath}${shortName}`
      const entry = modifiedSummary[shortName]
      md += `|[${shortName}](${fullName})|${entry.statements.pct}|${entry.branches.pct}|${entry.functions.pct}|${entry.lines.pct}\n`
    }

    await writeFileAsync(outputFilePath, md)

    core.setOutput('coverage', md)
  } catch (error) {
    // Fail the workflow run if an error occurs
    const err = error as ErrorWithMessage
    if (err) {
      core.setFailed(err.message)
    }
  }
}

interface ErrorWithMessage {
  message: string
}
