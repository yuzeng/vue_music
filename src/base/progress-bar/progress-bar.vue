<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth // 偏移宽度
          this._offset(offsetWidth)
        }
      }
    },
    methods: {
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      progressTouchStart (evt) {
        this.touch.initiated = true // 初始化
        this.touch.startX = evt.touches[0].pageX // 第一次触碰横向坐标
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (evt) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = evt.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd () {
        this.touch.initiated = false
        this._triggerPercent()
      },
      _triggerPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      progressClick (evt) {
        // 当点击到btn时，evt.offsetX获取不对
        // this._offset(evt.offsetX)
        const rect = this.$refs.progressBar.getBoundingClientRect() // 获取bar的位置
        const offsetWidth = evt.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height 30px

    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.3)

      .progress
        position absolute
        height 100%
        background $color-theme

      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px

        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
