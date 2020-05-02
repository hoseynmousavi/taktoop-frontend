const Constant = {
    COMPRESSION: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        maxIteration: 10,
    },
    email_regex: /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

export default Constant