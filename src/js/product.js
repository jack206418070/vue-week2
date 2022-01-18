import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'ginjack',
            categoryArr: ['蔬果','海鮮','肉品'],
            modalControl:{
                is_add: false,
                is_edit: false
            },
            is_loading: false,
            tempProduct:{is_enabled: 0},
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
                    if(err){
                        alert('驗證過期或者失敗');
                        document.location = `./index.html`;
                    }
                })
        },
        getProducts(){
            this.is_loading = true;
            this.tempProduct = {};
            axios.get(`${this.apiUrl}/api/${this.path}/admin/products`)
                .then((res) => {
                    if(res.data.success) {
                        this.products = res.data.products;
                        this.is_loading = false;
                    }
                })
                .catch((err) => {
                    console.dir(err);
                })
        },
        addProductHandler(dataList) {
            this.is_loading = true;
            this.modalControl.is_add = false;
            const data = {data:{...dataList}};
            axios.post(`${this.apiUrl}/api/${this.path}/admin/product`, data)
                .then((res) => {
                    if(res.data.success){
                        this.getProducts();
                    }
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
                    if(res.data.success){
                        this.getProducts();
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                }) 
        },
        clearProduct(type){
            this.tempProduct = {is_enabled: 0}
            type === 'add' ? this.is_add = false : this.is_edit = false;
        },
        editProduct(id,dataList){
            this.is_loading = true;
            this.modalControl.is_edit = false;
            const data = {data:{...dataList}}
            axios.put(`${this.apiUrl}/api/${this.path}/admin/product/${id}`,data)
                .then((res) => {
                    if(res.data.success){
                        this.getProducts();
                        this.editTempProduct = {};
                    }
                })
                .catch(err => {
                    console.dir(err);
                })
        },
        closeModal(){
            this.modalControl.is_add = false;
            this.modalControl.is_edit = false;
        },
        loadingHandler(){
            this.is_loading = !this.is_loading;
        }
    },
    mounted(){
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
        this.getProducts();
    }
})


app.component('modal',{
    emits: ['close-modal','loading','add','edit'],
    props:['modaltype','product', 'category'],
    data(){
        return{
            modalTitle: '',
            tempProduct: {},
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            path: 'ginjack',
        }
    },
    methods:{
        upload(){
            const fileInput = document.querySelector('#file');
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file-to-upload', file);
            this.$emit('loading');
            axios.post(`${this.apiUrl}/api/${this.path}/admin/upload`, formData)
                .then((res) => {
                    if(res.data.success){
                        this.tempProduct.imageUrl = res.data.imageUrl;
                        this.$emit('loading');
                    }
                })
                .catch(err => {
                    console.dir(err.response);
                })
        },
        editProduct(id, data){
            this.$emit('edit', id, data);
        },
        addProduct(data){
            this.$emit('add', data);
        }
    },
    created(){
        if(this.modaltype.is_add === true){
            this.modalTitle = '新增產品';
            this.tempProduct = {...this.product[0]};
        }else{
            this.modalTitle = '編輯產品';
            this.tempProduct = {...this.product[1]};
        }
    },
    template: `
    <div class="addProduct" style="z-index:100">
    <slot name="card-title" :modalTitle="modalTitle"></slot>
    <form action="#">
        <div class="form-group">
            <div class="form-control w-50">
                <label for="title">產品名稱</label>
                <input id="title" class="w-100" type="text" v-model="tempProduct.title">
            </div>
            <div class="form-control w-50">
                <label for="category">產品分類</label>
                <select id="category" v-model="tempProduct.category">
                    <option value="" disabled>請選擇一個分類</option>
                    <template v-for="item in category" :key="item">
                        <option :value="item" >{{ item }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="form-control w-50">
                <label for="originPrice">原始價格</label>
                <input id="originPrice" type="number" v-model.number="tempProduct.origin_price">
            </div>
            <div class="form-control w-50">
                <label for="price">販售價格</label>
                <input id="price" type="number" v-model.number="tempProduct.price">
            </div>
        </div>
        <div class="form-group">
            <div class="form-control w-50">
                <div class="input-checkbox">
                    <p class="mb-2">是否啟用</p>
                    <div class="toggle" @click="tempProduct.is_enabled == 0 ? tempProduct.is_enabled = 1 : tempProduct.is_enabled = 0" :class="{'active': tempProduct.is_enabled == 1}">
                    </div>
                </div>
            </div>
            <div class="form-control w-50">
                <label for="unit">單位</label>
                <input class="w-100"  type="text" name="unit" id="unit" v-model="tempProduct.unit">
            </div>
        </div>
        <div class="form-control">
            <label for="content">產品內容</label>
            <input type="text" id="content" v-model="tempProduct.content">
        </div>
        <div class="form-control">
            <label for="desc">產品描述</label>
            <textarea name="desc" id="desc" cols="30" rows="10" v-model="tempProduct.description"></textarea>
        </div>
        <div class="form-control">
            <label for="file">產品圖片</label>
            <input @change="upload" type="file" class="bg--white" id="file" name="filename"  placeholder="請輸入圖片連結">
        </div>
    </form>
    <div class="btn-group bg--dark--secondary">
        <a @click.prevent="$emit('close-modal')"  class="btn btn--danger" href="#">取消</a>
        <a v-if="modalTitle === '新增產品'" @click.prevent="addProduct(tempProduct)"  class="btn btn--success" href="#">新增產品</a>
        <a v-else @click.prevent="editProduct(tempProduct.id, tempProduct)"  class="btn btn--success" href="#">修改產品</a>
    </div>
</div>
    `
})

app.mount('#app');
