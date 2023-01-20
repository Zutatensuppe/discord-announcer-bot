import fs from 'fs'

interface Config {
  token: string
  http: {
    port: number
    hostname: string
  }
}

const config: Config = JSON.parse(String(fs.readFileSync(__dirname + '/../config.json')))
export default config
