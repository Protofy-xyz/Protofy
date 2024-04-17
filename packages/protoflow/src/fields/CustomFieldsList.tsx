import React from "react"
import { CustomFieldType } from "."
import useTheme from "../diagram/Theme"

export const CustomFieldsList = ({ fields, nodeData, node }) => {
    const undefinedSectionName = 'Props'
    const sections = fields.reduce((total, current) => {
        var sectionName = current.section ?? undefinedSectionName
        total[sectionName] = [
            ...(total[sectionName] ?? []),
            current
        ]
        return total
    }, {})

    var sectionArr = Object.keys(sections)
    let noSectionIndex = sectionArr.indexOf(undefinedSectionName);

    if (noSectionIndex !== -1) {
        sectionArr.splice(noSectionIndex, 1)
        sectionArr.push(undefinedSectionName)
    }
    return <>
        {
            sectionArr.map((section, i) => {
                const sectionTitle = section == undefinedSectionName ? '' : section
                return <div key={i}>
                    {
                        sections[section].map((item, index) => <CustomFieldType key={index} item={item} node={node} nodeData={nodeData} />)
                    }
                    {sectionTitle ? <div style={{ borderBottom: '1px solid ' + useTheme('separatorColor'), margin: '20px 22px' }}></div> : null}
                </div>
            })
        }
    </>
}