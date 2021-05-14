import Vue from 'vue'
import Router from 'vue-router'

const Login = () =>import('./views/login/Login')
const Home = () =>import('./views/home/Home')
const Welcome =() =>import('./views/home/childrenhome/Welcome')
const User =() =>import('./views/users/User')
const Rights =() =>import('./views/power/Rights')
const Roles =() =>import('./views/power/Roles')
const Cate =() =>import('./views/Goods/Cate')
const Params =() =>import('./views/Goods/Params')
Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


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
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params }
      ]
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
