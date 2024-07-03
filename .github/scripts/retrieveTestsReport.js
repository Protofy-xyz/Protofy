const splitGeneralReport = (str) => {
    const fullArr = [];
    let testReport_i = "";
    const splittedStr = str.split('\n')
    const length = splittedStr.length
    for (let i = 0; i < length; i++) {
        const line = splittedStr[i]
        if (line.includes('PASS') || line.includes('FAIL') || i == length - 1) {
            if (testReport_i) { // if not empty
                fullArr.push(testReport_i);
            }
            testReport_i = ""
        }
        testReport_i += line + '\n'
    }
    return fullArr
}

const getReportStatus = (report) => { // report: string
    console.log('REPORT: ', report)
    const splitByReport = report.split('\n');
    console.log('splitByReport: ', splitByReport);
    const length = splitByReport.length;
    let sumary = {}
    for (let i = 0; i < length; i++) {
        const line = splitByReport[i];
        if (line.includes('PASS') || line.includes('FAIL')) {
            const lineArrBySpace = line.split(' ');
            const status = lineArrBySpace[3]
            const file = lineArrBySpace[5]
            sumary = { ...sumary, status, file }
        }
        if (line.includes("Tests:")) {
            const passedRegex = /(\d+)\s*passed/;
            const failedRegex = /(\d+)\s*failed/;
            const skippedRegex = /(\d+)\s*skipped/;
            const totalRegex = /(\d+)\s*total/;
            const extractNumber = (regex) => { // extract number of returns 0 if not match
                const match = line.match(regex);
                return match ? parseInt(match[1], 10) : 0;
            };
            const passed = extractNumber(passedRegex);
            const failed = extractNumber(failedRegex);
            const skipped = extractNumber(skippedRegex);
            const total = extractNumber(totalRegex);

            sumary = { ...sumary, passed, failed, skipped, total };
        }
        if (line.includes('Time:')) {
            const elapsedTime = line.split('Time:')[1].trim()
            sumary = { ...sumary, time: elapsedTime };
        }
    }
    return sumary
}


const main = () => {
    const args = process.argv.slice(2)
    const reportPath = args[0]
    const fs = require('fs')
    const test_output = fs.readFileSync(reportPath, 'utf-8')
    console.log('testOUTPUT: ', test_output);
    const splitReportArr = splitGeneralReport(test_output)
    console.log('splitReportArr: ', splitReportArr);
    const status = splitReportArr.map(report => getReportStatus(report))
    const output = status.reduce((total, s) => {
        let statusBadge = s['status'] == 'FAIL' ?
            '🆘'
            : (
                (s['status'] == 'PASS' && !s['skipped'])
                    ? '✅'
                    : '🚧'
            )
        total += `\n${statusBadge} ${s['status'] ?? 'SKIP'} --> Total ${s['total']} (**${s['passed']}** pass, **${s['skipped']}** skip, **${s['failed']}** fail)\n[**${s['time']}**] ${s['file'] ?? ''}\n-----------------`
        return total
    }, "")
    console.log(output)
}

main()