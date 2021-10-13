存在即合理的一款渐进式框架：PetiteVue
> 生产使用CDN地址：
> 1. 全局构建：[https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.iife.js](https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.iife.js)
> 1. ESM构建：[https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js](https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js)

#### 极简初始化：
```html
<script src="https://unpkg.com/petite-vue" defer init></script>
<div v-scope="{ count: 0 }">
    {{ count }}
    <button @click="count++">inc</button>
</div>
```

1. defer：延迟脚本执行，直到页面加载完成。
1. init：自动查询和初始化被`v-scope`标记的元素。
#### 手动初始化：
```html
<div v-scope="{ count: 0 }">
    {{ count }}
    <button @click="count++">inc</button>
</div>

<script src="https://unpkg.com/petite-vue"></script>
<script>
    PetiteVue.createApp().mount()
</script>
```

1. 移除init属性，并将脚本移动到DOM最下方。
1. 通过`PetiteVue.createApp().mount()`手动挂载。

或使用ES模块构建：
```html
<div v-scope="{ count: 0 }">
    {{ count }}
    <button @click="count++">inc</button>
</div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module'
    createApp().mount()
</script>
```
#### 显示挂载目标DOM：
```html
<div id="app"></div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';
    createApp().mount("#app")
</script>
```
#### 根作用域的应用：
```html
<div id="app">
    <p>{{counter}}</p>
    <p>getters: {{doubleCounter}}</p>
    <button @click="increment">increment</button>
</div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';
    createApp({
        // 暴露各种表达式供app使用
        counter: 0,
        get doubleCounter() {
            return this.counter * 2;
        },
        increment() {
            this.counter++;
        }
    }).mount("#app")
</script>
```
#### 监听元素挂载/卸载：
```html
<div id="app">
    <p id="p1" v-if="show" @mounted="mounted($el)" @unmounted="unmounted($el)">我是P1</p>
    <button @click="show=!show">show: {{show}}</button>
</div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';
    createApp({
        show: false,
        mounted(el) {
            console.log('mounted：', el);
        },
        unmounted(el) {
            console.log('unmounted：', el);
        },
    }).mount("#app")
</script>
```
#### 提取公共组件：

1. 使用函数抽取公共可复用的部分。
```html
<div v-scope="Counter({initialShow:true})">
    <p id="p1" v-if="show" @mounted="mounted($el)" @unmounted="unmounted($el)">我是P1</p>
    <button @click="show=!show">show: {{show}}</button>
</div>

<div v-scope="Counter({initialShow:false})">
    <p id="p1" v-if="show" @mounted="mounted($el)" @unmounted="unmounted($el)">我是P1</p>
    <button @click="show=!show">show: {{show}}</button>
</div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';
    function Counter(props) {
        return {
            show: props.initialShow,
            mounted(el) {
                console.log('mounted：', el);
            },
            unmounted(el) {
                console.log('unmounted：', el);
            }
        }
    }
    createApp({
        Counter
    }).mount()
</script>
```

2. 带模板的组件。
```html
<div v-scope="Counter({initialShow:true})"></div>
<div v-scope="Counter({initialShow:false})"></div>

<template id="p1-template">
    <p id="p1" v-if="show" @mounted="mounted($el)" @unmounted="unmounted($el)">我是P1</p>
    <button @click="show=!show">show: {{show}}</button>
</template>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';
    function Counter(props) {
        return {
            $template: '#p1-template',
            show: props.initialShow,
            mounted(el) {
                console.log('mounted：', el);
            },
            unmounted(el) {
                console.log('unmounted：', el);
            }
        }
    }
    createApp({
        Counter
    }).mount()
</script>
```
#### 全局状态管理：
```html
<div id="app">
    <p id="p1">{{store.counter}}</p>
    <button @click="store.inc">store inc</button>
</div>

<script type="module">
    import { createApp, reactive } from 'https://unpkg.com/petite-vue?module';
    const store = reactive({
        counter: 0,
        inc() {
            this.counter++;
        }
    })

    createApp({
        store
    }).mount("#app")
</script>
```
#### 自定义指令：

1. 模拟自动聚焦
```html
<div id="app">
    <input type="text" v-auto-focus>
    <p id="p1">{{counter}}</p>
    <button @click="increment">increment</button>
</div>

<script type="module">
    import { createApp } from 'https://unpkg.com/petite-vue?module';

    const autoFocusDirective = (ctx) => {
        console.log(ctx);
        ctx.el.focus()
    }

    createApp({
        counter: 0,
        increment() {
            this.counter++;
        }
    }).directive('auto-focus', autoFocusDirective)
    .mount("#app")
</script>
```
