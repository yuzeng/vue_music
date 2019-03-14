// 1
import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

/** Vuex 管理所有状态 **/
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放
  disc: {}, // 歌单
  topList: {}, // 榜单
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}
export default state
