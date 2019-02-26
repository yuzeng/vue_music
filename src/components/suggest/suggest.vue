<template>
  <scroll class="suggest" :data="result">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {creatSong} from 'common/js/song'
  import {getMusic} from 'api/music'
  import Scroll from 'base/scroll/scroll'

  const TYPE_SINGER = 'singer'

  export default {
    components: {
      Scroll
    },
    data () {
      return {
        page: 1,
        result: []
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
      search () {
        search(this.query, this.page, this.showSinger).then(res => {
          // console.log(res.data)
          if (res.code === ERR_OK) {
            // this.result = this._genResult(res.data)
            this._genResult(res.data).then(list => {
              this.result = list
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
      }
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
