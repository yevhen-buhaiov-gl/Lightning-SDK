'use strict';

function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

var _this = undefined;

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
var fetchJson = function fetchJson(file) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  return new Promise(function (resolve, reject) {
    _newArrowCheck(this, _this2);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));else reject(xhr.statusText);
      }
    };

    xhr.open('GET', file);
    xhr.send(null);
  }.bind(this));
}.bind(undefined);

var loadJS = function loadJS(url, id) {
  var _this3 = this;

  _newArrowCheck(this, _this);

  return new Promise(function (resolve) {
    _newArrowCheck(this, _this3);

    console.log('loadJS', url);
    var tag = document.createElement('script');
    tag.onload = resolve;
    tag.src = url;
    if (id) tag.id = id;
    document.body.appendChild(tag);
  }.bind(this));
}.bind(undefined);

var sequence = function sequence(steps) {
  var _this4 = this;

  _newArrowCheck(this, _this);

  return steps.reduce(function (promise, method) {
    var _this5 = this;

    _newArrowCheck(this, _this4);

    return promise.then(function () {
      _newArrowCheck(this, _this5);

      return method();
    }.bind(this));
  }.bind(this), Promise.resolve(null));
}.bind(undefined);

var createStyle = function createStyle() {
  var _this6 = this;

  _newArrowCheck(this, _this);

  return new Promise(function (resolve) {
    _newArrowCheck(this, _this6);

    var style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule('@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { width: 100%; height: 100%;} }');
    resolve();
  }.bind(this));
}.bind(undefined);

var settings;
var metadata;
sequence([function () {
  _newArrowCheck(this, _this);

  return createStyle();
}.bind(undefined), function () {
  var _this7 = this;

  _newArrowCheck(this, _this);

  return fetchJson('./settings.json').then(function (res) {
    _newArrowCheck(this, _this7);

    return settings = res;
  }.bind(this));
}.bind(undefined), function () {
  var _this8 = this;

  _newArrowCheck(this, _this);

  return fetchJson('./metadata.json').then(function (res) {
    _newArrowCheck(this, _this8);

    metadata = res;
    metadata.id = "APP_".concat(metadata.identifier.replace(/[^0-9a-zA-Z_$]/g, '_'));
  }.bind(this));
}.bind(undefined), function () {
  _newArrowCheck(this, _this);

  return loadJS('./lib/lightning.js', 'lightning');
}.bind(undefined), function () {
  _newArrowCheck(this, _this);

  return loadJS('./appBundle.js', 'app');
}.bind(undefined), function () {
  _newArrowCheck(this, _this);

  return loadJS('./static/transportlayer.js', 'transport');
}.bind(undefined), function () {
  _newArrowCheck(this, _this);

  var app = window[metadata.id](settings, window.transportLayer);
  var canvas = app.stage.getCanvas();
  document.body.appendChild(canvas);
}.bind(undefined)]);
