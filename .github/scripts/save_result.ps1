if ($env:job_status -eq "success") {
    "${env:matrix_os}: 🟢" | Out-File -FilePath $env:runner_temp\result.txt -Append
} elseif ($env:job_status -eq "failure") {
    "${env:matrix_os}: 🔴" | Out-File -FilePath $env:runner_temp\result.txt -Append
} elseif ($env:job_status -eq "cancelled") {
    "${env:matrix_os}: 🟠" | Out-File -FilePath $env:runner_temp\result.txt -Append
} else {
    "${env:matrix_os}: ❓" | Out-File -FilePath $env:runner_temp\result.txt -Append
}