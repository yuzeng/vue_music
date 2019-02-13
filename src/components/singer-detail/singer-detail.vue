<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // 取mutation后的数据
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  export default {
    created () {
      this._getSingerDetail()
    },
    computed: {
      ...mapGetters([
        // 对应getters.js里的 做完后相当于state里的多了一个名为singer的属性
        'singer'
      ])
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push({
            path: `/singer`
          })
        }
        getSingerDetail(this.singer.id)
          .then(res => {
            if (res.code === ERR_OK) {
              console.log(res)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
