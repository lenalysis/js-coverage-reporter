import * as fs from 'fs'

/**
 * @param {string} fileName - The name of the file to read
 * @returns {Promise<CoverageSummary>} - the JSON contents of the file
 */
export async function readJsonSummaryFile(
  fileName: string
): Promise<CoverageSummary> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) reject(err)
      try {
        resolve(JSON.parse(data))
      } catch (err) {
        reject(err)
      }
    })
  })
}

export type CoverageSummary = { [key: string]: CoverageSummaryEntry }

export interface CoverageSummaryEntry {
  lines: CoverageSummaryStat
  branches: CoverageSummaryStat
  statements: CoverageSummaryStat
  functions: CoverageSummaryStat
}

export interface CoverageSummaryStat {
  total: number
  covered: number
  pct: number
}
