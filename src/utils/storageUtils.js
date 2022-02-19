import store from 'store'

const USER_KEY = 'user_key'

const storageUtils = {
    // 保存user
    saveUser(user) {
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY, user)
    },
    // 读取user,为避免返回一个undefined，当没有值时返回一个空对象
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    // 删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
export default storageUtils