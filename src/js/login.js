import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data(){
        return{
            username: '',
            password: '',
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'ginjack',
            is_err: 0,
        }
    },
    methods:{
        postSignIn(){
            const username = this.username;
            const password = this.password;
            const user = {
                username,
                password
            }
            axios.post(`${this.apiUrl}/admin/signin`, user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token}; expires=${ new Date(expired) }`;
                    document.location = `http://127.0.0.1:5501/products.html`;
                })
                .catch((err) => {
                    console.dir(err);
                    this.is_err = 1;
                })
        }
    }
}).mount('#app')