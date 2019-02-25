<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage" :rank='rank'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {getMusic} from 'api/music'
  import {creatSong} from 'common/js/song'
  import {ERR_OK} from 'api/config'

  export default {
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    components: {
      MusicList
    },
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length > 0) {
          return this.songs[0].image
        } else {
          return this.topList.picUrl
        }
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(item => {
          let {data} = item
          if (data.songid && data.albummid) {
            // 先做一个getMusic请求，拿到歌曲的vkey，再用creatSong方法生成完整歌曲
            getMusic(data.songmid).then(res => {
              if (res.code === ERR_OK) {
                let svkey = res.data.items
                let songVkey = svkey[0].vkey
                let song = creatSong(data, songVkey)
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
  .slide-enter-active, .slied-leave-active
    transition all .3s ease

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
