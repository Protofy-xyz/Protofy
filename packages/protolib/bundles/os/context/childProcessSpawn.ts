const { spawn } = require('child_process')

export async function childProcessSpawn(
  command,
  args,
  options,
  stdoutOnData,
  stderrOnData,
  onClose,
  onError
) {
  const child = spawn(command, args, options)
  child.stdout.on('data', async (data) => {
    if(stdoutOnData) await stdoutOnData(data.toString())
  })

  child.stderr.on('data', async (data) => {
    if(stderrOnData) await stderrOnData(data.toString())
  })
  // Handle the error event
  child.on('error', async (err) => {
    if(onError) await onError(err.toString())
  })

  // Handle the close event
  child.on('close', async (code) => {
    if(onClose) await onClose(code)
  })
}
