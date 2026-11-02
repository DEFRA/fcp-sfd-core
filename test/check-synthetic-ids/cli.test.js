import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cli = fileURLToPath(new URL('../../scripts/check-synthetic-ids/index.js', import.meta.url))
const outOfRange = '106' + '123456'

let repo

const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' })

const run = (...args) => {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_ACTIONS: '', GITHUB_STEP_SUMMARY: '' }
  })

  return { status: result.status, output: `${result.stdout}${result.stderr}` }
}

const stage = (file, content) => {
  writeFileSync(path.join(repo, file), content)
  git('add', file)
}

describe('sfd-id-check CLI', () => {
  before(() => {
    repo = mkdtempSync(path.join(tmpdir(), 'sfd-id-check-'))
    git('init', '-q', '-b', 'main')
    git('config', 'user.email', 'test@example.com')
    git('config', 'user.name', 'Test')
    git('config', 'commit.gpgsign', 'false')
    stage('existing.js', `// existing values are not rechecked\nconst sbi = ${outOfRange}\n`)
    git('commit', '-q', '-m', 'initial')
  })

  after(() => rmSync(repo, { recursive: true, force: true }))

  test('passes a change that adds SBI 300900001', () => {
    stage('in-range.test.js', 'const sbi = 300900001\n')

    const result = run('--staged')

    assert.equal(result.status, 0, result.output)
    git('commit', '-q', '-m', 'in range')
  })

  test('fails a change that adds a 9-digit number outside the ranges, naming file and line only', () => {
    stage('out-of-range.test.js', `// line 1\nconst sbi = ${outOfRange}\n`)

    const result = run('--staged')

    assert.equal(result.status, 1)
    assert.match(result.output, /out-of-range\.test\.js:2: 9-digit number outside the synthetic SBI ranges/)
    assert.ok(!result.output.includes(outOfRange), 'output must not contain the value')
    git('reset', '-q', 'out-of-range.test.js')
  })

  test('passes a 10-digit Unix timestamp with the allow marker', () => {
    stage('timestamp.js', 'const createdAt = 1700000000 // sfd-id-check: allow - unix timestamp\n')

    assert.equal(run('--staged').status, 0)
    git('commit', '-q', '-m', 'timestamp')
  })

  test('honours the allow file', () => {
    stage('.sfd-id-check-allow', 'value:1700000001\n')
    stage('allowed.js', 'const ts = 1700000001\n')

    assert.equal(run('--staged').status, 0)
    git('commit', '-q', '-m', 'allow file')
  })

  test('checks only the changes between --base and --head', () => {
    const base = git('rev-parse', 'HEAD').trim()
    stage('feature.js', `const crn = ${outOfRange}0\n`)
    git('commit', '-q', '-m', 'feature')

    const result = run('--base', base, '--head', 'HEAD')

    assert.equal(result.status, 1)
    assert.match(result.output, /feature\.js:1: 10-digit number outside the synthetic CRN ranges/)
    assert.ok(!result.output.includes('existing.js'))
    assert.equal(run('--base', 'HEAD', '--head', 'HEAD').status, 0)
  })

  test('emits GitHub annotations without the value', () => {
    const result = spawnSync(process.execPath, [cli, '--base', 'HEAD~1'], {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_ACTIONS: 'true', GITHUB_STEP_SUMMARY: '' }
    })

    assert.equal(result.status, 1)
    assert.match(result.stdout, /^::error file=feature\.js,line=1,title=Possible real CRN or SBI::/m)
    assert.ok(!`${result.stdout}${result.stderr}`.includes(outOfRange))
  })

  test('rejects invalid arguments', () => {
    assert.equal(run().status, 2)
    assert.equal(run('--staged', '--base', 'HEAD').status, 2)
  })
})
