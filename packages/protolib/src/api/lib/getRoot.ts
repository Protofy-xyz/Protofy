export const getRoot = (req?) => {
    return process.env.FILES_ROOT ?? "../../"
}