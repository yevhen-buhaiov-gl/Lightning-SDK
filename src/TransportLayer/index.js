export let TransportLayer

const skeletonTransportLayer = {
  Platform: {
    getProperty() {
      return Promise.resolve()
    },
    setProperty() {
      return Promise.resolve()
    },
    hasProperty() {
      return Promise.resolve()
    },
  },
  Metrics: {
    send() {},
  },
  VideoPlayer: {
    mediaUrl(url) {
      return url
    },
  },
  Ads: {
    getAds() {
      return Promise.resolve({
        preroll: [],
        midroll: [],
        postroll: [],
      })
    },
  },
}

export const initTransportLayer = transportLayer => {
  TransportLayer = { ...skeletonTransportLayer, ...transportLayer }
}
