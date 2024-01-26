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
    const splitByReport = report.split('\n');
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
    }
    return sumary
}


const main = () => {
    const args = process.argv.slice(2)
    const reportPath = args[0]
    console.log('reportPath: ', reportPath)
    const fs = require('fs')
    try {
        const test_output = fs.readFileSync(reportPath, 'utf-8')
        console.log('prev output')
        console.log('test_output: ', test_output)
    }catch(e) {console.log('ERROR reading file: ', e)}
    return
    console.log('testOutput: ', test_output)
    const splitReportArr = splitGeneralReport(test_output)
    const status = splitReportArr.map(report => getReportStatus(report))
    const output = status.reduce((total, s) => {
        let statusBadge = s['status'] == 'FAIL' ?
            '🔴'
            : (
                (s['status'] == 'PASS' && !s['skipped'])
                    ? '🟢'
                    : '🟠'
            )
        total += `____\n${statusBadge}${s['status'] ?? 'SKIP'} --> Total ${s['total']} | ${s['passed']} 🟢 | ${s['failed']} 🔴 | ${s['skipped']} 🟠${s['file'] ? ("\nAt file:" + s['file']) : ''}\n`
        return total
    }, "")
    console.log(output)
}

main()