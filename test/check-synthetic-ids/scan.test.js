import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import {
  describeViolation,
  findViolations,
  globToRegExp,
  loadRanges,
  parseAllowFile,
  parseDiff
} from '../../scripts/check-synthetic-ids/scan.js'

const ranges = loadRanges()
const noAllow = { globs: [], values: new Set() }

const check = (text, { file = 'src/example.js', allow = noAllow } = {}) =>
  findViolations([{ file, line: 1, text }], { ranges, allow })

describe('parseDiff', () => {
  test('returns added lines with new-file line numbers', () => {
    const diff = [
      'diff --git a/src/a.js b/src/a.js',
      'index 1111111..2222222 100644',
      '--- a/src/a.js',
      '+++ b/src/a.js',
      '@@ -3,0 +4,2 @@ context',
      '+first',
      '+second',
      '@@ -10 +12 @@',
      '-removed',
      '+replaced',
      '\\ No newline at end of file'
    ].join('\n')

    assert.deepEqual(parseDiff(diff), [
      { file: 'src/a.js', line: 4, text: 'first' },
      { file: 'src/a.js', line: 5, text: 'second' },
      { file: 'src/a.js', line: 12, text: 'replaced' }
    ])
  })

  test('handles new, deleted, quoted and multiple files', () => {
    const diff = [
      'diff --git a/new.js b/new.js',
      'new file mode 100644',
      '--- /dev/null',
      '+++ b/new.js',
      '@@ -0,0 +1 @@',
      '+++ looks like a header but is content',
      'diff --git a/gone.js b/gone.js',
      'deleted file mode 100644',
      '--- a/gone.js',
      '+++ /dev/null',
      '@@ -1 +0,0 @@',
      '-old',
      'diff --git "a/dir/with\\"quote.js" "b/dir/with\\"quote.js"',
      '--- "a/dir/with\\"quote.js"',
      '+++ "b/dir/with\\"quote.js"',
      '@@ -0,0 +1 @@',
      '+quoted',
      'diff --git a/has space.js b/has space.js',
      '--- a/has space.js\t',
      '+++ b/has space.js\t',
      '@@ -0,0 +1 @@',
      '+spaced'
    ].join('\n')

    assert.deepEqual(parseDiff(diff), [
      { file: 'new.js', line: 1, text: '++ looks like a header but is content' },
      { file: 'dir/with"quote.js', line: 1, text: 'quoted' },
      { file: 'has space.js', line: 1, text: 'spaced' }
    ])
  })
})

describe('findViolations', () => {
  test('passes numbers inside the synthetic ranges', () => {
    for (const value of ['9000000000', '9500123000', '9999999999', '800000000', '850000123', '899999999']) {
      assert.deepEqual(check(`const id = ${value}`), [], value)
    }
  })

  test('passes numbers inside the legacy SFD edge-case ranges', () => {
    for (const value of ['3000000000', '3000000001', '3099999999', '300900001', '300999999']) {
      assert.deepEqual(check(`const id = '${value}'`), [], value)
    }
  })

  test('fails numbers just outside each range', () => {
    assert.deepEqual(check('crn: 8999999999'), [{ file: 'src/example.js', line: 1, type: 'crn' }])
    assert.deepEqual(check('crn: 3100000000'), [{ file: 'src/example.js', line: 1, type: 'crn' }])
    assert.deepEqual(check('crn: 2999999999'), [{ file: 'src/example.js', line: 1, type: 'crn' }])
    assert.deepEqual(check('sbi: 799999999'), [{ file: 'src/example.js', line: 1, type: 'sbi' }])
    assert.deepEqual(check('sbi: 900000000'), [{ file: 'src/example.js', line: 1, type: 'sbi' }])
    assert.deepEqual(check('sbi: 300900000'), [{ file: 'src/example.js', line: 1, type: 'sbi' }])
    assert.deepEqual(check('sbi: 301000000'), [{ file: 'src/example.js', line: 1, type: 'sbi' }])
  })

  test('reports a line once per identifier type', () => {
    assert.deepEqual(check('1100000000 1100000001 106000000 9000000000'), [
      { file: 'src/example.js', line: 1, type: 'crn' },
      { file: 'src/example.js', line: 1, type: 'sbi' }
    ])
  })

  test('finds numbers next to punctuation and underscores', () => {
    for (const text of ['"1100000000"', 'crn=1100000000,', '/crn/1100000000/', 'crn_1100000000', '(1100000000)', 'CRN 1100000000.']) {
      assert.equal(check(text).length, 1, text)
    }
  })

  test('ignores numbers that are part of something longer', () => {
    for (const text of [
      'ms: 1700000000000',
      'phone: 07700900123',
      'sha: a1100000000b',
      'hash 1100000000abcdef',
      'pi: 3.141592653',
      'version 1100000000.5',
      'short: 12345678'
    ]) {
      assert.deepEqual(check(text), [], text)
    }
  })

  test('skips lines with the inline allow marker', () => {
    assert.deepEqual(check('const timestamp = 1700000000 // sfd-id-check: allow - unix timestamp'), [])
    assert.deepEqual(check('timestamp: 1700000000 # SFD-ID-CHECK:allow'), [])
  })

  test('skips allowed values and paths', () => {
    const allow = parseAllowFile('# comment\n\nvalue:1700000000\ntest/fixtures/\n*.snap\n')

    assert.deepEqual(check('ts: 1700000000', { allow }), [])
    assert.equal(check('ts: 1700000001', { allow }).length, 1)
    assert.deepEqual(check('1100000000', { file: 'test/fixtures/data.json', allow }), [])
    assert.deepEqual(check('1100000000', { file: 'test/unit/__snapshots__/a.snap', allow }), [])
    assert.equal(check('1100000000', { file: 'src/fixtures.js', allow }).length, 1)
  })

  test('skips lockfiles and the allow file itself', () => {
    for (const file of ['package-lock.json', 'nested/package-lock.json', 'yarn.lock', '.sfd-id-check-allow']) {
      assert.deepEqual(check('1100000000', { file }), [], file)
    }
  })
})

describe('globToRegExp', () => {
  test('follows gitignore-style matching', () => {
    assert.ok(globToRegExp('*.csv').test('scenarios/data/UserList.csv'))
    assert.ok(globToRegExp('fixtures').test('a/fixtures/b.json'))
    assert.ok(globToRegExp('/fixtures').test('fixtures/b.json'))
    assert.ok(!globToRegExp('/fixtures').test('a/fixtures/b.json'))
    assert.ok(globToRegExp('test/**/*.json').test('test/a/b/c.json'))
    assert.ok(globToRegExp('test/**/*.json').test('test/c.json'))
    assert.ok(!globToRegExp('test/*.json').test('test/a/c.json'))
    assert.ok(!globToRegExp('*.csv').test('data.csv.js'))
  })
})

describe('parseAllowFile', () => {
  test('reports invalid value entries', () => {
    assert.deepEqual(parseAllowFile('value:12345\nvalue:abc').errors, [
      '.sfd-id-check-allow:1: "value:" entries must be a 9 or 10 digit number',
      '.sfd-id-check-allow:2: "value:" entries must be a 9 or 10 digit number'
    ])
  })
})

describe('describeViolation', () => {
  test('names file and line without the value', () => {
    assert.equal(
      describeViolation({ file: 'src/a.js', line: 7, type: 'sbi' }),
      'src/a.js:7: 9-digit number outside the synthetic SBI ranges'
    )
  })
})
