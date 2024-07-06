import { FormElement } from ".";
import { MultiSelectList } from "../MultiSelectList";

export const UnionsArrayComp = ({ ele, icon, i, inArray, eleArray, formData, generatedOptions, setFormData }) => {
    const primitives = ["ZodNumber", "ZodString", "ZodLiteral"] // add more primitives with the time
    let defaultChoices = eleArray.map(zodEle => {
      const type = zodEle.typeName ?? zodEle._def.typeName
      return primitives.includes(type)
        ? String(zodEle.value)
        : JSON.stringify(zodEle.value)
    })
  
    return <FormElement ele={ele} icon={icon} i={i} inArray={inArray}>
      <MultiSelectList choices={generatedOptions.length ? generatedOptions : defaultChoices} defaultSelections={formData} onSetSelections={(selections) => setFormData(ele.name, selections)} />
    </FormElement>
  }