const { exec } = require('child_process')

export async function runCommand(options?: {
  command: string,
  options?: any,
  onData?: (data: string) => void,
  onErrorData?: (data: string) => void,
  onDone?: (code: number) => void,
  onError?: (err: string) => void
}) {
  return new Promise<void>((resolve, reject) => {
    const command = options.command
    const opts = options.options || {}
    const onData = options.onData || (() => {})
    const onErrorData = options.onErrorData || (() => {})
    const onDone = options.onDone || (() => {})
    const onError = options.onError || (() => {})

    const child = exec(command, opts, (err, stdout, stderr) => {
      if(err) {
        reject(err)
        return
      }
      onDone(stdout)
      resolve(stdout)
    })

    child.stdout.on('data', async (data) => {
      onData(data.toString())
    })

    child.stderr.on('data', async (data) => {
      onErrorData(data.toString())
    })

    child.on('error', async (err) => {
      onError(err.toString())
    })
  })
}
