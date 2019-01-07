
export const state = () => ({
  locales: ['en', 'zh'],
  locale: 'en',
  profile: {},
  defaultAsset: {}
})
  
export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  DEL_PROFILE(state) {
    state.profile = {}
  },
  SET_DEFAULT_ASSET(state, defaultAsset) {
    state.defaultAsset = defaultAsset
  }
}