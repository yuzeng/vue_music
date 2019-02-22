<template>
  <div class="recommend" ref="recommend">
    <scroll :data="discList" class="recommend-content" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <slot>
              <div :key="index" v-for="(item, index) in recommends">
                <!--<a :href="item.linkUrl">-->
                <a href="javascript:;">
                  <img class="needsclick" :src="item.picUrl" v-on:load="loadImage">
                </a>
              </div>
            </slot>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" :key="index" class="item" v-for="(item, index) in discList">
              <div class="icon">
                <img height="60" v-lazy="item.imgurl" width="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from '../../api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        recommends: [],
        discList: [],
        checkLoaded: false
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    },
    mixins: [
      playlistMixin
    ],
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      // 点击歌单跳往歌单详情
      selectItem (item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      // 覆盖mixins里的函数
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        // 调用listview里的refresh方法
        this.$refs.scroll.refresh()
      },
      _getRecommend () {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage () {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable'
  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0

    .recommend-content
      height 100%
      overflow hidden

      .slider-wrapper
        position relative
        width 100%
        overflow hidden

      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme

        .item
          display flex
          box-sizing border-box
          align-items center
          padding 0 20px 20px 20px

          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px

          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium

            .name
              margin-bottom 10px
              color $color-text

            .desc
              color $color-text-d

      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
