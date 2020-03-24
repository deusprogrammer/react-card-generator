export default {
    createConfig: () => {
        return {
            headers: {
                "X-Access-Token": window.localStorage.getItem("accessToken")
            }
        }
    }
}
