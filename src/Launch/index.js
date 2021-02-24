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

import { initSettings } from '../Settings'
import { initUtils } from '../Utils'
import { initTransportLayer } from '../TransportLayer'

import Application from '../Application'
import isProbablyLightningComponent from '../helpers/isProbablyLightningComponent'

export let ApplicationInstance

export default (App, settings, transportLayer) => {
  initTransportLayer(transportLayer)
  initSettings(settings)
  initUtils(settings)

  if (isProbablyLightningComponent(App)) {
    const app = Application(App, settings)
    ApplicationInstance = new app(settings.lightning)
    return ApplicationInstance
  } else {
    if (typeof App === 'function') {
      return App(settings)
    } else {
      console.error('Expecting `App` to be a callback function or a Lightning Component')
    }
  }
}
