import { readJsonSummaryFile } from '../src/read-json-summary-file'

describe('read-json-summary-file', () => {
  describe('reading-bad-json', () => {
    it('throws for missing file', async () => {
      await expect(
        async () => await readJsonSummaryFile('/bad/file/name')
      ).rejects.toThrow()
    })
    it('throws for bad file', async () => {
      await expect(
        async () =>
          await readJsonSummaryFile('./__tests__/data/badJson.json.bad')
      ).rejects.toThrow()
    })
  })
})
