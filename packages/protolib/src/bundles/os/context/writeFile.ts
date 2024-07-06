import fs from "fs";
export async function writeFile(path,content,onError) {
  try{
    await fs.writeFileSync(path, content)
  }catch(err){
    if(onError) await onError(err)
  }
}
