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

let settings = {}

export const initSettings = config => {
  settings = config
}

const dotGrab = (obj = {}, key) => {
  const keys = key.split('.')
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]] = obj[keys[i]] !== undefined ? obj[keys[i]] : {}
  }
  return typeof obj === 'object' ? (Object.keys(obj).length ? obj : undefined) : obj
}

export default {
  get(key, fallback = undefined) {
    const val = dotGrab(settings, key)
    return val !== undefined ? val : fallback
  },
  has(key) {
    return !!this.get(key)
  },
}
