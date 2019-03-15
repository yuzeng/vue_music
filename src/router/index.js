import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Disc from 'components/disc/disc'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import TopList from 'components/top-list/top-list'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import UserCenter from 'components/user-center/user-center'

Vue.use(Router)

// 异步加载组件
const Recommend = resolve => {
  import('components/recommend/recommend').then(mod => {
    resolve(mod)
  })
}

const Singer = resolve => {
  import('components/singer/singer').then(mod => {
    resolve(mod)
  })
}

const Disc = resolve => {
  import('components/disc/disc').then(mod => {
    resolve(mod)
  })
}

const Rank = resolve => {
  import('components/rank/rank').then(mod => {
    resolve(mod)
  })
}

const TopList = resolve => {
  import('components/top-list/top-list').then(mod => {
    resolve(mod)
  })
}

const Search = resolve => {
  import('components/search/search').then(mod => {
    resolve(mod)
  })
}

const SingerDetail = resolve => {
  import('components/singer-detail/singer-detail').then(mod => {
    resolve(mod)
  })
}

const UserCenter = resolve => {
  import('components/user-center/user-center').then(mod => {
    resolve(mod)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
