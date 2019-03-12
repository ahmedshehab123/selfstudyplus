var wixBiSession = {
  requestId: (function(r) {
    for (var t = document.cookie.split(";"), e = 0; e < t.length; e++) {
      for (var n = t[e].split("="), o = n[0], u = n[1]; ' ' === o[0];) o = o.substr(1)
      if (r === o) return u
    }
    return ""
  })("requestId"),
  viewerSessionId: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  , initialTimestamp: Date.now(),
  initialRequestTimestamp: (function() {
    if (window.performance) {
      if (window.performance.timeOrigin) {
        return performance.timeOrigin
      } else if (performance.now) {
        return Date.now() - performance.now()
      }
    }
    return Date.now()
  })()

  , is_rollout: 0
  , is_platform_loaded: 0
  , dc: "84"
  , renderType: "bolt"
  , wixBoltExclusionReason: ""
  , wixBoltExclusionReasonMoreInfo: ""
  , sendBeacon: /(\?|\&)suppressbi\=true(\&|$)/.test() ?
    function() {
    } :
    function(url) {
      var sent = false
      try {
        sent = navigator.sendBeacon(url)
      } catch (e) {
      }
      if (!sent) {
        (new Image()).src = url
      }
    }
  , sendBeat: function(et, name, extra) {
    var tts = ""
    if (window.performance) {
      if (performance.now) {
        tts = "&tts=" + Math.round(performance.now())
      }
      if (name && performance.mark) {
        performance.mark(name + " (beat " + et + ")")
      }
    }
    var ts = et === 1 ? 0 : Date.now() - wixBiSession.initialTimestamp
    extra = extra || ""
    if (extra.indexOf("pn=") === -1) {
      extra = "&pn=1" + extra
    }
    if (!wixBiSession.beatUrl) {
      wixBiSession.beatUrl = "https://frog.wix.com/bt?src=29&evid=3"
        + "&v=1.1721.0"
        + "&msid=834aabab-dfb0-4f56-b970-2d3050cfa7b1"
        + "&vsi=" + wixBiSession.viewerSessionId
        + "&rid=" + wixBiSession.requestId
        + "&viewer_name=bolt"
        + "&isp=1"
        + "&st=2"
        + "&is_rollout=0"
        + "&dc=84"
        + "&iss=1"
        + "&vid=" + wixBiSession.visitorId

        + "&url="
      var referrer = document.referrer
      if (referrer) {
        wixBiSession.beatUrl += "&ref=" + encodeURIComponent(referrer)
      }
    }
    wixBiSession.sendBeacon(wixBiSession.beatUrl
      + "&et=" + et
      + (name ? "&event_name=" + encodeURIComponent(name) : "")
      + "&ts=" + ts + tts
      + extra,
    )
  },
}
wixBiSession.sendBeat(1, "Init")