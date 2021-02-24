/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Simplified version of startApp.js! Might miss functionality

// helpers
const fetchJson = file => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText))
        else reject(xhr.statusText)
      }
    }
    xhr.open('GET', file)
    xhr.send(null)
  })
}

const loadJS = (url, id) => {
  return new Promise(resolve => {
    console.log('loadJS', url)
    const tag = document.createElement('script')
    tag.onload = resolve
    tag.src = url

    if (id) tag.id = id

    document.body.appendChild(tag)
  })
}

const sequence = steps => {
  return steps.reduce((promise, method) => {
    return promise.then(() => method())
  }, Promise.resolve(null))
}

const createStyle = () => {
  return new Promise(resolve => {
    const style = document.createElement('style')
    document.head.appendChild(style)
    style.sheet.insertRule(
      '@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { width: 100%; height: 100%;} }'
    )
    resolve()
  })
}

let settings
let metadata

sequence([
  () => createStyle(),
  () => fetchJson('./settings.json').then(res => (settings = res)),
  () =>
    fetchJson('./metadata.json').then(res => {
      metadata = res
      metadata.id = `APP_${metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_')}`
    }),
  () => loadJS('./lib/lightning.js', 'lightning'),
  () => loadJS('./appBundle.js', 'app'),
  () => loadJS('./static/transportlayer.js', 'transport'),
  () => {
    const app = window[metadata.id](settings, window.transportLayer)
    const canvas = app.stage.getCanvas()
    document.body.appendChild(canvas)
  },
])
