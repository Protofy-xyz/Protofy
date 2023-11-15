
import Diff from 'deep-diff'

function getDiffs(original, current) { // return the array of differences betweeen two JSON files
    var differences = Diff.diff(original, current);
    return differences?.filter((d) => !(["E","N"].includes(d.kind) && d.path[1] === "hidden")) // Removes diffs of "hidden" field
}

export { getDiffs }