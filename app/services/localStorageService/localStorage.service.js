class LocalStorageService {
    getUser() {
        return {
            id: localStorage.getItem("constructionForumUserId"),
            username: localStorage.getItem("constructionForumUsername"),
            token: localStorage.getItem("constructionForumUserToken")
        }
    }
}

export const localStorageService = new LocalStorageService();