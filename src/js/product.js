import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'ginjack',
            categoryArr: ['蔬果','海鮮','肉品'],
            is_add: false,
            is_edit: false,
            is_loading: false,
            tempProduct:{},
            products: [],
            editTempProduct: {}
        }
    },
    methods: {
        checkLogin(){
            axios.post(`${this.apiUrl}/api/user/check`)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.dir(err.response);
                })
        },
        getProducts(){
            this.is_loading = true;
            this.tempProduct = {};
            axios.get(`${this.apiUrl}/api/${this.path}/admin/products`)
                .then((res) => {
                    this.products = res.data.products;
                    this.is_loading = false;
                })
                .catch((err) => {
                    console.dir(err);
                })
        },
        addProductHandler() {
            this.is_loading = true;
            const data = {data:{...this.tempProduct}};
            axios.post(`${this.apiUrl}/api/${this.path}/admin/product`, data)
                .then((res) => {
                    this.getProducts();
                })
                .catch((err) => {
                    console.log(err.response);
                })
            this.is_add = false;
            this.clearProduct();
        },
        deleteProduct(id){
            this.is_loading = true;
            axios.delete(`${this.apiUrl}/api/${this.path}/admin/product/${id}`)
                .then((res) => {
                    this.getProducts();
                })
                .catch((err) => {
                    console.log(err.response);
                }) 
        },
        clearProduct(type){
            this.tempProduct = {}
            type === 'add' ? this.is_add = false : this.is_edit = false;
        },
        upload(){
            const fileInput = document.querySelector('#file');
            const file = fileInput.files[0];
            console.log(file);
            const formData = new FormData();
            formData.append('file-to-upload', file);
            axios.post(`${this.apiUrl}/api/${this.path}/admin/upload`, formData)
                .then((res) => {
                    this.tempProduct.imageUrl = res.data.imageUrl;
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        editProduct(id){
            this.is_loading = true;
            this.is_edit = false;
            const data = {data:{...this.editTempProduct}}
            // this.closeModal();
            axios.put(`${this.apiUrl}/api/${this.path}/admin/product/${id}`,data)
                .then((res) => {
                    this.getProducts();
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        // closeModal(){
        //     this.editTempProduct = {};
        // }
    },
    mounted(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
        this.getProducts();
    }
})

// app.component('modal',{
//     props: ['prop-data','category'],
//     emits: ['close-modal','edit-product'],
//     methods: {
//         close(){
//             this.$emit('close-modal');
//         },
//         edit(id){
//             console.log(id);
//             this.$emit('edit-product', id)
//         }
//     },
//     template: `
//     <div class="addProduct" style="z-index:1000">
//     <h2>新增產品</h2>
//     <form action="#">
//         <div class="form-group">
//             <div class="form-control w-50">
//                 <label for="title">產品名稱</label>
//                 <input v-model.trim="propData.title" id="title" class="w-100" type="text">
//             </div>
//             <div class="form-control w-50">
//                 <label for="category">產品分類</label>
//                 <select id="category" v-model="propData.category">
//                     <option value="" disabled>請選擇一個分類</option>
//                     <option :value="item" v-for="item in category" :key="item">{{ item }}</option>
//                 </select>
//             </div>
//         </div>
//         <div class="form-group">
//             <div class="form-control w-50">
//                 <label for="originPrice">原始價格</label>
//                 <input v-model.number="propData.origin_price" id="originPrice" type="number">
//             </div>
//             <div class="form-control w-50">
//                 <label for="price">販售價格</label>
//                 <input v-model.number="propData.price" id="price" type="number">
//             </div>
//         </div>
//         <div class="form-group">
//             <div class="form-control w-50">
//                 <div class="input-checkbox">
//                     <p class="mb-2">是否啟用</p>
//                     <div class="toggle">
//                     </div>
//                 </div>
//             </div>
//             <div class="form-control w-50">
//                 <label for="unit">單位</label>
//                 <input class="w-100" v-model="propData.unit" type="text" name="unit" id="unit">
//             </div>
//         </div>
//         <div class="form-control">
//             <label for="content">產品內容</label>
//             <input v-model.trim="propData.content" type="text" id="content">
//         </div>
//         <div class="form-control">
//             <label for="desc">產品描述</label>
//             <textarea v-model.trim="propData.description" name="desc" id="desc" cols="30" rows="10"></textarea>
//         </div>
//         <div class="form-control">
//             <!--暫時不綁 model -->
//             <label for="file">產品圖片</label>
//         </div>
//     </form>
//     <div class="btn-group bg--dark--secondary">
//         <a @click.prevent="close" class="btn btn--danger" href="#">取消</a>
//         <a @click.prevent="edit(propData.id)" class="btn btn--success" href="#">修改商品</a>
//     </div>
// </div>
//     `
// })

app.mount('#app');
