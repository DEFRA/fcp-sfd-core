import { readFileSync } from 'node:fs'

export const ALLOW_FILE = '.sfd-id-check-allow'
export const ALLOW_MARKER = /sfd-id-check:\s*allow/i

const DEFAULT_EXCLUDES = [
  '**/package-lock.json',
  '**/npm-shrinkwrap.json',
  '**/*.lock',
  `/${ALLOW_FILE}`
]

// Exactly 9 or 10 digits, not part of a longer word, number or decimal (e.g. hex hashes, 1.123456789).
const CANDIDATE = /(?<![0-9A-Za-z]|\d\.)(\d{10}|\d{9})(?![0-9A-Za-z]|\.\d)/g

const ID_TYPES = { 10: 'crn', 9: 'sbi' }
const HUNK_HEADER = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/

export const loadRanges = (url = new URL('./ranges.json', import.meta.url)) => {
  return JSON.parse(readFileSync(url, 'utf8'))
}

const unquotePath = (quoted) => {
  const bytes = []
  const body = quoted.slice(1, -1)
  const escapes = { n: 10, t: 9, r: 13, '"': 34, '\\': 92, a: 7, b: 8, f: 12, v: 11 }

  for (let i = 0; i < body.length; i++) {
    const char = body[i]

    if (char !== '\\') {
      bytes.push(...Buffer.from(char))
      continue
    }

    const next = body[i + 1]

    if (/[0-7]/.test(next)) {
      bytes.push(parseInt(body.slice(i + 1, i + 4), 8))
      i += 3
    } else {
      bytes.push(escapes[next] ?? next.charCodeAt(0))
      i += 1
    }
  }

  return Buffer.from(bytes).toString('utf8')
}

const parseDiffPath = (value) => {
  const trimmed = value.replace(/\t$/, '')

  if (trimmed === '/dev/null') {
    return null
  }

  const path = trimmed.startsWith('"') ? unquotePath(trimmed) : trimmed

  return path.replace(/^b\//, '')
}

// Parses `git diff --unified=0 --src-prefix=a/ --dst-prefix=b/` output into added lines.
export const parseDiff = (diff) => {
  const added = []
  let file = null
  let inHunk = false
  let lineNumber = 0

  for (const raw of diff.split('\n')) {
    if (raw.startsWith('diff --git ')) {
      file = null
      inHunk = false
      continue
    }

    const hunk = HUNK_HEADER.exec(raw)

    if (hunk) {
      inHunk = true
      lineNumber = Number(hunk[1])
      continue
    }

    if (!inHunk) {
      if (raw.startsWith('+++ ')) {
        file = parseDiffPath(raw.slice(4))
      }
      continue
    }

    if (raw.startsWith('+')) {
      if (file) {
        added.push({ file, line: lineNumber, text: raw.slice(1) })
      }
      lineNumber++
    } else if (raw.startsWith(' ')) {
      lineNumber++
    }
  }

  return added
}

const escapeRegExp = (value) => value.replace(/[.+^${}()|[\]\\]/g, '\\$&')

// Gitignore-style globs: `*`, `?`, `**`, trailing `/` for directories, leading `/` to anchor to the repo root.
export const globToRegExp = (glob) => {
  let pattern = glob.trim()
  const anchored = pattern.startsWith('/') || pattern.slice(0, -1).includes('/')
  const directory = pattern.endsWith('/')

  pattern = pattern.replace(/^\//, '').replace(/\/$/, '')

  let source = ''

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i]

    if (char === '*' && pattern[i + 1] === '*') {
      if (pattern[i + 2] === '/') {
        source += '(?:.*/)?'
        i += 2
      } else {
        source += '.*'
        i += 1
      }
    } else if (char === '*') {
      source += '[^/]*'
    } else if (char === '?') {
      source += '[^/]'
    } else {
      source += escapeRegExp(char)
    }
  }

  const prefix = anchored ? '^' : '^(?:.*/)?'
  const suffix = directory ? '/.*$' : '(?:/.*)?$'

  return new RegExp(`${prefix}${source}${suffix}`)
}

export const parseAllowFile = (text) => {
  const globs = []
  const values = new Set()
  const errors = []

  text.split(/\r?\n/).forEach((raw, index) => {
    const entry = raw.trim()

    if (!entry || entry.startsWith('#')) {
      return
    }

    if (entry.startsWith('value:')) {
      const value = entry.slice('value:'.length).trim()

      if (/^\d{9,10}$/.test(value)) {
        values.add(value)
      } else {
        errors.push(`${ALLOW_FILE}:${index + 1}: "value:" entries must be a 9 or 10 digit number`)
      }
      return
    }

    globs.push(entry)
  })

  return { globs, values, errors }
}

const inRanges = (value, ranges = []) => ranges.some(({ from, to }) => value >= from && value <= to)

export const findViolations = (addedLines, { ranges, allow = { globs: [], values: new Set() } }) => {
  const excluded = [...DEFAULT_EXCLUDES, ...allow.globs].map(globToRegExp)
  const violations = []

  for (const { file, line, text } of addedLines) {
    if (excluded.some((pattern) => pattern.test(file)) || ALLOW_MARKER.test(text)) {
      continue
    }

    const types = new Set()

    for (const [, value] of text.matchAll(CANDIDATE)) {
      const type = ID_TYPES[value.length]

      if (!allow.values.has(value) && !inRanges(Number(value), ranges[type])) {
        types.add(type)
      }
    }

    for (const type of types) {
      violations.push({ file, line, type })
    }
  }

  return violations
}

// Never include the matched value: the point of the check is to stop it spreading further.
export const describeViolation = ({ file, line, type }) => {
  const digits = type === 'crn' ? 10 : 9

  return `${file}:${line}: ${digits}-digit number outside the synthetic ${type.toUpperCase()} ranges`
}
