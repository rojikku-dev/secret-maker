let crypto = require("crypto")
let fernet = require('fernet')

function generateSecret(key) {
    let shasum = crypto.createHash("sha256")
    shasum.update(key, "utf-8")
    return new fernet.Secret(shasum.digest("base64"))
}

function encrypt(secret, msg) {
    return new fernet.Token({ secret: secret }).encode(msg)
}

function decrypt(secret, encryptedMsg) {
    return new fernet.Token({ secret: secret, token: encryptedMsg, ttl: 0 }).decode()
}

var secret = null
let lock = false
window.onload = () => {
    let keyInput = document.querySelector("#key")
    secret = generateSecret(keyInput.value)

    let encArea = document.querySelector("#enc-area")
    let decArea = document.querySelector("#dec-area")

    keyInput.addEventListener('input', function () {
        secret = generateSecret(keyInput.value)
    })

    
    encArea.addEventListener('input', function () {
        if (lock) return
        lock = true
        decArea.value = encrypt(secret, encArea.value)
        lock = false
    })

    decArea.addEventListener('input', function () {
        if (lock) return
        lock = true
        console.log(decArea.value)
        try {
            encArea.value = decrypt(secret, decArea.value)
        } catch (e) {
            encArea.value = ""
        }
        lock = false
    })
}
