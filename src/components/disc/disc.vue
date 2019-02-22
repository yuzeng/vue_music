<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {getMusic} from 'api/music'
  import {creatSong} from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    components: {
      MusicList
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        getSongList(this.disc.dissid)
          .then((res) => {
            if (res.code === ERR_OK) {
              this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            }
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

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all .3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
