import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

const debounceClickDir = (ctx) => {
    const { el, arg } = ctx;
    const fn = ctx.get();
    if (typeof fn != "function") {
        throw new TypeError("Expected a function");
    }
    const debounceFun = debounce(fn, Number(arg));
    el.addEventListener("click", () => {
        debounceFun();
    });
}

// 状态管理
const store = reactive({
    todoStore: [],
    increase(arg) {
        this.todoStore.unshift(arg);
    },
    remove(id) {
        this.todoStore.splice(this.todoStore.findIndex(item => item.id === id), 1)
    }
})

// TodoApp
createApp({
    todos: [],
    get todoSize() {
        return this.todos.length;
    },
    store,
    addition() {
        const item = { id: guid(), name: Mock.Random.cname(), address: Mock.Random.county(true) }
        this.todos.unshift(item)
        this.store.increase(item)
    },
    remove(id) {
        this.todos.splice(this.todos.findIndex(item => item.id === id), 1)
        this.store.remove(id)
    }
}).directive('debounce-click', debounceClickDir).mount("#todoApp")

// TodoStoreApp
createApp({
    store,
}).mount("#todoStoreApp")

// ====================================公共函数====================================

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function debounce(fun, wait = 200) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fun.apply(context, args);
        }, wait);
    };
}