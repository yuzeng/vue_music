<template>
  <div class="search" ref="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item, index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne" :refreshDelay="refreshDelay"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest :query="query" ref="suggest" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空历史记录" confirmBtnText="清空" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {mapActions} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    data () {
      return {
        hotKey: []
        // query: '' // mixin里做
      }
    },
    computed: {
      shortcut () {
        // hotKey searchHistory 任一变化，就会重新刷新scroll
        return this.hotKey.concat(this.searchHistory)
      }
      // mixin 里做
      // ...mapGetters([
      //   'searchHistory'
      // ])
    },
    watch: {
      query (newQuery) {
        // 如果从suggest列表切到 搜索主页 即query从有到无 手动刷新shortcut
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      // mixin里做
      // addQuery (query) {
      //   this.$refs.searchBox.setQuery(query)
      // },
      // mixin里做
      // onQueryChange (query) {
      //   this.query = query
      // },
      handlePlaylist (playlist) {
        const bottom = playlist.length ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      // mixin里做
      // blurInput () {
      //   this.$refs.searchBox.blur()
      // },
      // // 保存搜索结果
      // saveSearch () {
      //   this.saveSearchHistory(this.query)
      // },
      deleteOne (item) {
        this.deleteSearchHistory(item)
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      deleteAll () {
        this.clearSearchHistory()
      },
      _getHotKey () {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      // mixin里做
      ...mapActions([
        'clearSearchHistory'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin 20px

    .shortcut-wrapper
      position fixed
      top 178px
      bottom 0
      width 100%

      .shortcut
        height 100%
        overflow hidden

        .hot-key
          margin 0 20px 20px 20px

          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-l

          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background $color-highlight-background
            font-size $font-size-medium
            color $color-text-d

        .search-history
          position relative
          margin 0 20px

          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-l

            .text
              flex 1

            .clear
              extend-click()

              .icon-clear
                font-size $font-size-medium
                color $color-text-d

    .search-result
      position fixed
      width 100%
      top 178px
      bottom 0
</style>
