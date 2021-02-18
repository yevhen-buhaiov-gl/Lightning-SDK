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
let metadata = {}

export const initMetadata = metadataObj => {
  const metadataItems = ['icon', 'id', 'name', 'version']
  Object.keys(metadataObj)
    .filter(key => {
      return !metadataItems.includes(key)
    })
    .forEach(key => {
      delete metadataObj[key]
    })
}

export default {
  get(key, fallback = undefined) {
    const val = metadata[key]
    return val !== undefined ? val : fallback
  },

  appId() {
    return this.get('id')
  },

  appName() {
    return this.get('name')
  },

  appVersion() {
    let ver = this.get('version')
    // Get only version and not the hashvalue
    let version = ver.split('-')
    return version[0]
  },

  appIcon() {
    return this.get('icon')
  },
  // Version from app store
  appFullVersion() {
    return this.get('version')
  },
}
