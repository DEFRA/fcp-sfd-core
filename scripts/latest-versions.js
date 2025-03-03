import { promises as fs } from 'fs'

const cwd = process.cwd()

const gitBaseUrl = 'https://api.github.com/repos/DEFRA'
const servicesPath = `${cwd}/service-compose`

const getLatestRelease = async (repo) => {
  console.log(`Checking ${repo}...`)
  console.log(`${gitBaseUrl}/${repo}/tags`)
  const response = await fetch(`${gitBaseUrl}/${repo}/tags`)
  const data = await response.json()

  const version = data.length > 0 ? data[0].name : 'No tags found'

  console.log(`${repo}: ${version}`)
}

const latestVersions = async () => {
  const services = await fs.readdir(servicesPath)

  const processes = []

  for (const service of services) {
    const repo = service.replace('.yaml', '')

    processes.push(getLatestRelease(repo))
  }

  await Promise.all(processes)
}

await latestVersions()
