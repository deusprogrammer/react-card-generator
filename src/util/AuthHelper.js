export default {
    createConfig: () => {
        return {
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem("jwt")}`
            }
        }
    }
}