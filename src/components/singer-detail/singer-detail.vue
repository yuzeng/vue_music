<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 取mutation后的数据
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {getMusic} from 'api/music'
  import {ERR_OK} from 'api/config'
  import {creatSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data () {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    created () {
      this._getSingerDetail()
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        // 对应getters.js里的 做完后相当于state里的多了一个名为singer的属性
        'singer'
      ])
    },
    methods: {
      _getSingerDetail () {
        if (!this.singer.id) {
          this.$router.push({
            path: `/singer`
          })
        }
        getSingerDetail(this.singer.id)
          .then(res => {
            if (res.code === ERR_OK) {
              this.songs = this._normalizeSongs(res.data.list)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(item => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            // 先做一个getMusic请求，拿到歌曲的vkey，再用creatSong方法生成完整歌曲
            getMusic(musicData.songmid).then(res => {
              if (res.code === ERR_OK) {
                let svkey = res.data.items
                let songVkey = svkey[0].vkey
                let song = creatSong(musicData, songVkey)
                ret.push(song)
              }
            })
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
