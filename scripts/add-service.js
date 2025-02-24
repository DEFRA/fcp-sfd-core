import { existsSync, promises as fs } from 'fs'
import readline from 'readline'
import { parse, stringify } from 'yaml'

const cwd = process.cwd()

const constructCompose = async (serviceName, ports) => {
  const compose = {
    services: {
      [serviceName]: {
        build: {
          context: `../../${serviceName}`,
          target: 'development'
        },
        profiles: [
          'fcp-sfd'
        ],
        image: serviceName,
        container_name: serviceName,
        networks: [
          'cdp-tenant'
        ],
        ports: [
          `${ports[0]}:${ports[0]}`
        ],
        env_file: [
          '../.env'
        ],
        volumes: [
          `../../${serviceName}/src:/home/node/src`,
          `../../${serviceName}/package.json:/home/node/package.json`
        ]
      }
    }
  }

  await fs.writeFile(
    `${cwd}/service-compose/${serviceName}.yaml`,
    stringify(compose)
  )
}

const addToParentCompose = async (path) => {
  const parent = await fs.readFile(`${cwd}/docker-compose.yaml`, 'utf8')

  const compose = parse(parent)

  const { include } = compose

  if (include.indexOf(path) > -1) {
    console.log('Service already included')
    return
  }

  include.push(path)
  include.sort((a, b) => b.localeCompare(a))

  await fs.writeFile(
    `${cwd}/docker-compose.yaml`,
    stringify(compose)
  )
}

const getUserInput = async (q) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}

const addService = async () => {
  const serviceName = await getUserInput('Enter the name of the service: ')

  if (existsSync(`${cwd}/service-compose/${serviceName}.yaml`)) {
    console.log('Service already exists')
    return
  }

  const server = await getUserInput('Enter the web server port: ')
  const ports = [server, '']

  await constructCompose(serviceName, ports)
  await addToParentCompose(`service-compose/${serviceName}.yaml`)
}

await addService()
