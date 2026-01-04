import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import HighchartsVue from 'highcharts-vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(HighchartsVue);

app.mount('#app');
