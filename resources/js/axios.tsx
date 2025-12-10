import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// Ou version auto :
// axios.defaults.baseURL = window.location.origin;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;
