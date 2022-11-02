const BACKEND = "http://localhost:8080";

export function getUsers() {
    if (!localStorage.getItem("constructionForumUserToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BACKEND + "/users/summaries",
        method: "GET",
    });
}

export function findChatMessages(senderId, recipientId) {
    if (!localStorage.getItem("constructionForumUserToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BACKEND + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    });
}

export function findChatMessage(id) {
    if (!localStorage.getItem("constructionForumUserToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BACKEND + "/messages/" + id,
        method: "GET",
    });
}

export function countNewMessages(senderId, recipientId) {
    if (!localStorage.getItem("constructionForumUserToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: BACKEND + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

const request = (options) => {
    const headers = new Headers();

    if (options.setContentType !== false) {
        headers.append("Content-Type", "application/json");
    }

    if (localStorage.getItem("constructionForumUserToken")) {
        headers.append(
            "Authorization",
            "Bearer " + localStorage.getItem("constructionForumUserToken")
        );
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};