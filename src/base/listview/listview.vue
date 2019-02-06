<template>
  <scroll :data="data" class="listview" ref="listview" :listenScroll="listenScroll" @scroll="scroll">
    <ul>
      <li :key="index" class="list-group" v-for="(group, index) in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li :key="idx" class="list-group-item" v-for="(item, idx) in group.items">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li @touchstart="onShortcutTouchStart"
            @touchmove.stop.prevent="onShortcutTouchMove"
            class="item"
            v-for="(item, index) in shortcutList"
            :key="index"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  // const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
    data () {
      return {
        scrollY: -1,
        currentIndex: 0
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    watch: {
      data () {
        setTimeout(() => {
          this.calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY > height1 && -newY < height2)) {
            this.currentIndex = i
            return
          }
          this.currentIndex = 0
        }
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((item, index) => {
          return item.title.substr(0, 1)
        })
      }
    },
    created () {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
    },
    methods: {
      onShortcutTouchStart (evt) {
        let anchorIndex = getData(evt.target, 'index')
        let firstTouch = evt.touches[0]
        console.log(firstTouch)
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this.scrollTo(anchorIndex)
      },
      onShortcutTouchMove (evt) {
        let firstTouch = evt.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this.scrollTo(anchorIndex)
      },
      scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background

    .list-group
      padding-bottom 30px

      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background

      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px

        .avatar
          width 50px
          height 50px
          border-radius 50%

        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium

    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica

      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small

        &.current
          color $color-theme

    .list-fixed
      position absolute
      top 0
      left 0
      width 100%

      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background

    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)

</style>
