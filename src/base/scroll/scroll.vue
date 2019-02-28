<template>
  <div ref="wrapper" class="Bscroll-wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否上拉加载
      pullup: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    watch: {
      data: function () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          let that = this
          this.scroll.on('scroll', (pos) => {
            that.$emit('scroll', pos)
          })
        }
        // 监听BScroll的事件
        if (this.pullup) {
          // 滚动结束时执行这个事件，只执行一次
          this.scroll.on('scrollEnd', () => {
            // 50缓冲区
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              // 通知外部父组件，滚动到底部了。
              this.$emit('scrollToEnd')
            }
          })
        }
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
