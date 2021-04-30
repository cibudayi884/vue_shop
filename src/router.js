import Vue from 'vue'
import Router from 'vue-router'

const Login = () =>import('./views/login/Login')
const Home = () =>import('./views/home/Home')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path: '/home',
      component: Home
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL
})
router.beforeEach((to, from, next) => {
  //next()放行   next('/login')强制跳转
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
