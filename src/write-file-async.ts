import fs from 'node:fs'

export async function writeFileAsync(
  fileName: string,
  contents: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, contents, {}, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}
