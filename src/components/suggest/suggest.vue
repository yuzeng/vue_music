<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {creatSong} from 'common/js/song'
  import {getMusic} from 'api/music'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    components: {
      Scroll,
      Loading,
      NoResult
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true, // 监听Bscroll开始滚动 滚动时让input失焦
        hasMore: true // 是否加载完毕 标志位
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      query () {
        this.search()
      }
    },
    methods: {
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          /**
           * Do not mutate vuex store state outside mutation handlers. 会报错，不要修改vue的state，在mutation回调函数外(mutations.js)
           * 在actions.js里把要修改的地方slice()
           */
          this.insertSong({
            song: item
          })
        }
      },
      // 滚动到底部时执行
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then(list => {
              this.result = this.result.concat(list)
              this._checkMore(res.data)
            })
          }
        })
      },
      search () {
        this.page = 1
        this.hasMore = true
        // 把scroll滚动到顶部
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then(list => {
              this.result = list
              // 检查一下是否还有更多数据
              this._checkMore(res.data)
            })
          }
        })
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      // 监听滚动
      listScroll () {
        this.$emit('listScroll')
      },
      _checkMore (data) {
        const song = data.song
        // 已加载页数乘以每页条数等于现有所有条数，如果加上将要返回的条数，大于总条数，那就认为没有更多了。
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          return this._normalizeSongs(data.song.list).then((list) => {
            return ret.concat(list)
          })
        }
        return Promise.resolve(ret)
      },
      _normalizeSongs (list) {
        let _list = list.filter(item => item.songid && item.albummid).map(item => {
          let musicData = item
          // 先做一个getMusic请求，拿到歌曲的vkey，再用creatSong方法生成完整歌曲
          return getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              let svkey = res.data.items
              let songVkey = svkey[0].vkey
              let song = creatSong(musicData, songVkey)
              return song
            }
          })
        })
        return Promise.all(_list)
      },
      ...mapMutations({
        // 对应mutation-types里的常量，映射成一个方法名（setSinger）
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height 100%
    overflow hidden

    .suggest-list
      padding 0 30px

      .suggest-item
        display flex
        align-items center
        padding-bottom 20px

      .icon
        flex 0 0 30px
        width 30px

        [class^="icon-"]
          font-size 14px
          color $color-text-d

      .name
        flex 1
        font-size $font-size-medium
        color $color-text-d
        overflow hidden

        .text
          no-wrap()

    .no-result-wrapper
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
