import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // dom ready时触发
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  // keep-alive组件切回来的时候触发
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    // 组件定义了这个函数，就会覆盖这里这个函数，如果没有，就调用这里的这个函数，会抛出异常
    handlePlaylist () {
      throw new Error('组件要实现这个函数')
    }
  }
}
