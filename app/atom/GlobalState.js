import {atom} from "recoil";

export const loggedInUser = atom({
    key: "loggedInUser",
    default: {},
    persistence_UNSTABLE: {
        type: "loggedInUser",
    },
});