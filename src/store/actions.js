// 一个操作，多次提交mutation，可以用action
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 选择播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 找到顺序播放时的歌曲，在rendomlist里的下标值
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export function randomPlay ({commit, state}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索后点击歌曲，插入歌曲到播放列表
export const insertSong = function ({commit, state}, {song}) { // song 待插入歌曲
  let playlist = state.playList.slice() // 创建副本，避免报警告
  let sequenceList = state.sequenceList.slice()
  // currentIndex不用加，是值类型，赋值给currentIndex 不会修改state里的currentIndex
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // [1,2,3,4] 当前播放3(currentIndex 2) 插入2(fpIndex 1) 当前播放1(currentIndex 0) 插入4(fpIndex 3)
  // 查找播放列表内，有没有待插入这首歌，并返回索引
  let fpIndex = findIndex(playlist, song)
  // 把这首歌插入到当前播放下一首 [1,2,3,2,4] [1,4,2,3,4]
  currentIndex++ // currentIndex 3 currentIndex 1
  playlist.splice(currentIndex, 0, song)
  // 说明歌曲列表已经有这首歌
  if (fpIndex > -1) {
    // 如果当前要插入的序号大于已有这首歌的序号（已有待插入的这首歌在前面） [1,2,3,2,4]
    if (currentIndex > fpIndex) {
      // 删除前面那首重复的歌
      playlist.splice(fpIndex, 1) // [1,3,2,4]
      // 删了以后，数组长度减1，currentIndex减1
      currentIndex-- // currentIndex 2
    } else {
      // 如果当前要插入的序号小于已有这首歌的序号（已有待插入的这首歌在后面） [1,4,2,3,4]
      playlist.splice(fpIndex + 1, 1) // [1,4,2,3]
    }
  }

  // 插入sequenceList的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 查找顺序播放列表内，有没有待插入这首歌，并返回索引
  let fsIndex = findIndex(sequenceList, song)
  // 插入
  sequenceList.splice(currentSIndex, 1, song)
  // 删除重复
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  // 提交mutation
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空历史
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 从播放列表删除
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice() // 创建副本，避免报警告
  let sequenceList = state.sequenceList.slice()
  // currentIndex不用加，是值类型，赋值给currentIndex 不会修改state里的currentIndex
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1) // 从playlist删除
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1) // 从sequenceList删除
  if (currentIndex > pIndex || currentIndex === playlist.length) { // 当前播放在删除的之后 或删除的最后一首
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // if (!playlist.length) { // 如果把歌都删完了
  //   commit(types.SET_PLAYING_STATE, false)
  // } else {
  //   commit(types.SET_PLAYING_STATE, true)
  // }
  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空播放列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistroy = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
