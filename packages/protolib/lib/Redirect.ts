export const redirect = (path: string) => {
    return {
        redirect: {
          permanent: false,
          destination: path
        }
    }
}