
import Diff from 'deep-diff'

function getDiffs(original, current) { // return the array of differences betweeen two JSON files
    var differences = Diff.diff(original, current);
    return differences
}

export { getDiffs }