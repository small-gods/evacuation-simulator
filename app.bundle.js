/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/main.ts","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.base64EncArr = exports.base64DecToArr = exports.isDesigner = exports.protobufFromBase64 = exports.protobufToBase64Promise = exports.protobufToBase64 = exports.getGameHeight = exports.getGameWidth = void 0;
var protobuf = __webpack_require__(/*! protobufjs */ "./node_modules/protobufjs/index.js");
function getGameWidth(scene) {
    return scene.game.scale.width;
}
exports.getGameWidth = getGameWidth;
function getGameHeight(scene) {
    return scene.game.scale.height;
}
exports.getGameHeight = getGameHeight;
function protobufToBase64(filename, type, message, callback) {
    protobuf.load(filename, function (err, root) {
        if (err)
            throw err;
        var MessageType = root.lookupType(type);
        var errMsg = MessageType.verify(message);
        if (errMsg)
            throw Error(errMsg);
        var result = MessageType.create(message);
        var buffer = MessageType.encode(result).finish();
        callback(base64EncArr(buffer));
    });
}
exports.protobufToBase64 = protobufToBase64;
function protobufToBase64Promise(filename, type, message) {
    return new Promise(function (resolve) {
        protobufToBase64(filename, type, message, resolve);
    });
}
exports.protobufToBase64Promise = protobufToBase64Promise;
function protobufFromBase64(filename, type, message, callback) {
    protobuf.load(filename, function (err, root) {
        if (err)
            throw err;
        var MessageType = root.lookupType(type);
        var buffer = base64DecToArr(message);
        var source = MessageType.decode(buffer);
        var object = MessageType.toObject(source, {});
        callback(object);
    });
}
exports.protobufFromBase64 = protobufFromBase64;
exports.isDesigner = document.URL.includes("designer");
function b64ToUint6(nChr) {
    return nChr > 64 && nChr < 91 ? nChr - 65
        : nChr > 96 && nChr < 123 ? nChr - 71
            : nChr > 47 && nChr < 58 ? nChr + 4
                : nChr === 43 ? 62
                    : nChr === 47 ? 63 : 0;
}
function uint6ToB64(nUint6) {
    return nUint6 < 26 ? nUint6 + 65
        : nUint6 < 52 ? nUint6 + 71
            : nUint6 < 62 ? nUint6 - 4
                : nUint6 === 62 ? 43
                    : nUint6 === 63 ? 47 : 65;
}
function base64DecToArr(sBase64, nBlocksSize) {
    var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
    var nInLen = sB64Enc.length;
    var nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
    var taBytes = new Uint8Array(nOutLen);
    for (var nMod3 = void 0, nMod4 = void 0, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
            for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
            }
            nUint24 = 0;
        }
    }
    console.log(taBytes.reduce(function (hist, x) { return (hist[x]++, hist); }, new Array(256).fill(0)).map(function (count, i) { return ([i, count]); }).sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    }).map(function (_a) {
        var i = _a[0], count = _a[1];
        return "".concat(i, ": ").concat(count);
    }));
    return taBytes;
}
exports.base64DecToArr = base64DecToArr;
function base64EncArr(aBytes) {
    var nMod3 = 2;
    var sB64Enc = "";
    for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
        nMod3 = nIdx % 3;
        if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
            sB64Enc += "\r\n";
        }
        nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
        if (nMod3 === 2 || aBytes.length - nIdx === 1) {
            sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
            nUint24 = 0;
        }
    }
    return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
}
exports.base64EncArr = base64EncArr;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.game = void 0;
var Phaser = __webpack_require__(/*! phaser */ "./node_modules/phaser/dist/phaser.js");
var scenes_1 = __webpack_require__(/*! ./scenes */ "./src/scenes/index.ts");
var helpers_1 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
var content = document.querySelector('#content');
var gameConfig = {
    title: 'Sample',
    type: Phaser.AUTO,
    scale: {
        width: content.clientWidth,
        height: content.clientHeight,
    },
    scene: scenes_1.default,
    physics: {
        default: 'arcade',
        arcade: {
            debug: helpers_1.isDesigner,
        },
    },
    parent: content,
    backgroundColor: '#f5f5f5',
};
exports.game = new Phaser.Game(gameConfig);
window.addEventListener('resize', function () {
    exports.game.scale.refresh();
});


/***/ }),

/***/ "./src/scenes/boot-scene.ts":
/*!**********************************!*\
  !*** ./src/scenes/boot-scene.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootScene = void 0;
var helpers_1 = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'Boot',
};
/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
var BootScene = /** @class */ (function (_super) {
    __extends(BootScene, _super);
    function BootScene() {
        return _super.call(this, sceneConfig) || this;
    }
    BootScene.prototype.preload = function () {
        var _this = this;
        var halfWidth = (0, helpers_1.getGameWidth)(this) * 0.5;
        var halfHeight = (0, helpers_1.getGameHeight)(this) * 0.5;
        var progressBarHeight = 100;
        var progressBarWidth = 400;
        var progressBarContainer = this.add.rectangle(halfWidth, halfHeight, progressBarWidth, progressBarHeight, 0x000000);
        var progressBar = this.add.rectangle(halfWidth + 20 - progressBarContainer.width * 0.5, halfHeight, 10, progressBarHeight - 20, 0x888888);
        var loadingText = this.add.text(halfWidth - 75, halfHeight - 100, 'Loading...').setFontSize(24);
        var percentText = this.add.text(halfWidth - 25, halfHeight, '0%').setFontSize(24);
        var assetText = this.add.text(halfWidth - 25, halfHeight + 100, '').setFontSize(24);
        this.load.on('progress', function (value) {
            progressBar.width = (progressBarWidth - 30) * value;
            var percent = value * 100;
            percentText.setText("".concat(percent, "%"));
        });
        this.load.on('fileprogress', function (file) {
            assetText.setText(file.key);
        });
        this.load.on('complete', function () {
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            progressBar.destroy();
            progressBarContainer.destroy();
            _this.scene.start('Game');
        });
        this.loadAssets();
    };
    /**
     * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
     * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
     * is currently active, so they can be accessed anywhere.
     */
    BootScene.prototype.loadAssets = function () {
        // Load sample assets
        // Source: Open Game Art
        this.load.image('man', 'assets/sprites/character.png');
        this.load.image('arrow-up', 'assets/sprites/arrow-up.png');
        this.load.image('arrow-down', 'assets/sprites/arrow-down.png');
        this.load.image('arrow-right', 'assets/sprites/arrow-right.png');
        this.load.image('arrow-left', 'assets/sprites/arrow-left.png');
        this.load.image('wall', 'assets/sprites/wall.png');
        this.load.image('fire', 'assets/sprites/fire.png');
        this.load.image('exit', 'assets/sprites/exit.png');
        if (new URL(window.location.href).searchParams.has('INSIDE'))
            this.load.spritesheet('man_animaited', 'assets/sprites/character_anim_inside.png', {
                frameWidth: 13 * 2,
                frameHeight: 23 * 2,
            });
        else
            this.load.spritesheet('man_animaited', 'assets/sprites/character_anim.png', {
                frameWidth: 13,
                frameHeight: 23,
            });
        this.load.spritesheet('fire_animaited', 'assets/sprites/fire_anim.png', { frameWidth: 60, frameHeight: 60 });
        var soundPath = function (name) { return "assets/sounds/".concat(name); };
        this.load.audio('fire-new', ['new_fire.ogg', 'new_fire.mp3'].map(soundPath));
        this.load.audioSprite('exit', soundPath('exit.json'), ['exit.ogg'].map(soundPath));
        this.load.audioSprite('die', soundPath('die.json'), ['die.ogg'].map(soundPath));
    };
    return BootScene;
}(Phaser.Scene));
exports.BootScene = BootScene;


/***/ }),

/***/ "./src/scenes/game-scene.ts":
/*!**********************************!*\
  !*** ./src/scenes/game-scene.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = void 0;
var utils_1 = __webpack_require__(/*! ../simulation/utils */ "./src/simulation/utils.ts");
var world_1 = __webpack_require__(/*! ../simulation/world */ "./src/simulation/world.ts");
var body_factory_1 = __webpack_require__(/*! ../simulation/body-factory */ "./src/simulation/body-factory.ts");
var helpers_1 = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");
var world_serializer_1 = __webpack_require__(/*! ../simulation/world-serializer */ "./src/simulation/world-serializer.ts");
var sceneConfig = {
    active: false,
    visible: false,
    key: 'Game',
};
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, sceneConfig) || this;
        _this.burned = 0;
        _this.escaped = 0;
        _this.buttonEvents = {
            actor: function (p) {
                _this.world.addActor(p.x, p.y);
            },
            'arrow-right': function (p) {
                _this.world.addArrow(_this.world.absoluteToCell(p), utils_1.Direction.RIGHT);
            },
            'arrow-left': function (p) {
                _this.world.addArrow(_this.world.absoluteToCell(p), utils_1.Direction.LEFT);
            },
            'arrow-up': function (p) {
                _this.world.addArrow(_this.world.absoluteToCell(p), utils_1.Direction.UP);
            },
            'arrow-down': function (p) {
                _this.world.addArrow(_this.world.absoluteToCell(p), utils_1.Direction.DOWN);
            },
            exit: function (p) {
                _this.world.addExit(_this.world.absoluteToCell(p));
            },
            wall: function (p) {
                _this.world.addWall(p);
            },
            fire: function (p) {
                _this.world.addFire(_this.world.absoluteToCell(p));
            },
            delete: function (p) {
                _this.world.delete(p);
            },
        };
        return _this;
    }
    GameScene.prototype.create = function () {
        var _this = this;
        this.sound.pauseOnBlur = false;
        var $counters = document.querySelector('.counters');
        var countersTypes = ['actors', 'burned', 'escaped', 'arrows'];
        var soundVolume = document.createElement('input');
        soundVolume.title = 'sound';
        soundVolume.type = 'range';
        soundVolume.min = '0';
        soundVolume.max = '100';
        soundVolume.value = '50';
        soundVolume.addEventListener('input', function () {
            _this.sound.volume = parseFloat(soundVolume.value) / 50;
        });
        var soundLable = document.createElement('label');
        soundLable.textContent = 'Sound: ';
        soundLable.appendChild(soundVolume);
        document.body.append(soundLable);
        var counters = Object.fromEntries(countersTypes.map(function (counter) {
            var dom = document.createElement('div');
            dom.className = "counter ".concat(counter);
            dom.innerText = "0";
            $counters.appendChild(dom);
            return [counter, dom];
        }));
        var gridCenter = (world_1.cellSize * 15) / 2;
        var gridSize = world_1.cellSize * 16;
        var debugGrid = this.add.grid(gridCenter, gridCenter, gridSize, gridSize, world_1.cellSize, world_1.cellSize, null, null, 0xff00ff, 0.1);
        var actionButtons = document.querySelectorAll('.action-button');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        var onButtonAction = function (p) { };
        var lastCursor = '';
        actionButtons.forEach(function (button) {
            var type = button.getAttribute('data-object');
            if (type === 'kill-all') {
                button.addEventListener('click', function () {
                    _this.world.stopSimulation();
                    document.body.style.cursor = lastCursor;
                    debugGrid.visible = true;
                });
                return;
            }
            else if (type === 'spawn-all') {
                button.addEventListener('click', function () {
                    document.body.style.cursor = "";
                    _this.burned = 0;
                    _this.escaped = 0;
                    counters.burned.textContent = _this.burned + '';
                    counters.escaped.textContent = _this.escaped + '';
                    debugGrid.visible = false;
                    _this.world.runSimulation();
                });
                return;
            }
            else if (!(type in _this.buttonEvents)) {
                return;
            }
            var callback = _this.buttonEvents[type];
            var img = button.querySelector('img');
            var cursorImg = makeCursorFromImg(img, 32);
            button.addEventListener('click', function () {
                onButtonAction = callback;
                lastCursor = cursorImg;
                if (!_this.world.isRunning())
                    document.body.style.cursor = lastCursor;
            });
        });
        var content = document.querySelector('#content');
        content.addEventListener('click', function (e) {
            if (_this.world.isRunning())
                return;
            var rect = content.getBoundingClientRect();
            onButtonAction({ x: e.x - rect.x, y: e.y - rect.y });
        });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('man_animaited', {}), frameRate: 16 });
        this.anims.create({ key: 'fire', frames: this.anims.generateFrameNumbers('fire_animaited', {}), frameRate: 4 });
        var bodyFactory = new body_factory_1.BodyFactory(this, function (fire, person) {
            _this.sound.playAudioSprite('die', Phaser.Math.RND.between(0, 7).toString(), { volume: 0.5 });
            _this.world.deletePersonBySprite(person);
            _this.burned += 1;
            counters.burned.textContent = _this.burned + '';
        }, function (person) {
            _this.sound.playAudioSprite('exit', Phaser.Math.RND.between(0, 3).toString(), { volume: 0.4 });
            _this.world.deletePersonBySprite(person);
            _this.escaped += 1;
            counters.escaped.textContent = _this.escaped + '';
        });
        var worldCreator = function (json) {
            return new world_1.World({ x: 13, y: 13 }, bodyFactory, json, function (world) {
                counters.arrows.innerHTML = "".concat(world.arrows.length, "/&#8734");
                counters.actors.textContent = "".concat(world.actors.length, "/").concat(world.potentialActorsCount);
                // if (world.isRunning() && world.actors.length === 0) alert('GAME OVER')
            });
        };
        var loadJsonButton = document.querySelector('#worldjson-load');
        var saveJsonButton = document.querySelector('#worldjson-save');
        var getLinkButton = document.querySelector('#worldjson-get-link');
        var clipboardLinkButton = document.querySelector('#worldjson-copy-link');
        var openLinkButton = document.querySelector('#worldjson-open-link');
        var setLinkButton = document.querySelector('#worldjson-active-link');
        var worldJsonText = document.querySelector('#worldjson');
        if (loadJsonButton)
            loadJsonButton.addEventListener('click', function () {
                console.log(JSON.parse(worldJsonText.value));
                _this.world.deleteAll();
                _this.world = worldCreator(JSON.parse(worldJsonText.value));
            });
        if (saveJsonButton)
            saveJsonButton.addEventListener('click', function () {
                worldJsonText.value = JSON.stringify(_this.world.toJson());
            });
        if (getLinkButton)
            getLinkButton.addEventListener('click', function () {
                _this.getLevelUrl().then(function (url) {
                    worldJsonText.value = url;
                    worldJsonText.focus();
                    worldJsonText.setSelectionRange(0, worldJsonText.value.length);
                });
            });
        if (clipboardLinkButton)
            clipboardLinkButton.addEventListener('click', function () {
                _this.getLevelUrl()
                    .then(function (url) { return navigator.clipboard.writeText(url); })
                    .then(function () {
                    clipboardLinkButton.classList.toggle('designer-button_success', true);
                    setTimeout(function () { return clipboardLinkButton.classList.toggle('designer-button_success', false); }, 1000);
                })
                    .catch(function (err) {
                    console.error(err);
                    clipboardLinkButton.classList.toggle('designer-button_failed', true);
                    setTimeout(function () { return clipboardLinkButton.classList.toggle('designer-button_failed', false); }, 1000);
                });
            });
        if (openLinkButton)
            openLinkButton.addEventListener('click', function () {
                _this.getLevelUrl().then(function (url) {
                    var a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    a.click();
                });
            });
        if (setLinkButton)
            setLinkButton.addEventListener('click', function () {
                _this.getLevelUrl('designer').then(function (url) { return window.history.pushState(undefined, '', url); });
            });
        var levelButtons = document.querySelectorAll('.level-button');
        levelButtons.forEach(function (button, i) {
            var url = button.getAttribute('data-object');
            button.addEventListener('click', function () {
                fetch(url)
                    .then(function (resp) {
                    return resp.json();
                })
                    .then(function (resp) {
                    _this.world.deleteAll();
                    _this.world = worldCreator(resp);
                });
            });
        });
        this.world = worldCreator({});
        var params = new URL(window.location.href).searchParams;
        var levelParamData = params.get('data');
        var levelParamBuf = params.get('buf');
        var levelParamBin = params.get('bin');
        var levelParamBinBit = params.get('bit');
        if (levelParamData)
            this.world = worldCreator(JSON.parse(atob(levelParamData)));
        else if (levelParamBuf) {
            (0, helpers_1.protobufFromBase64)('assets/proto/world.proto', 'world.World', levelParamBuf, function (object) {
                _this.world = worldCreator(object);
            });
        }
        else if (levelParamBin) {
            (0, helpers_1.protobufFromBase64)('assets/proto/world.proto', 'world.Blob', levelParamBin, function (object) {
                _this.world = worldCreator((0, world_serializer_1.WorldJsonFromIntArray)(object.data));
            });
        }
        else if (levelParamBinBit) {
            (0, helpers_1.protobufFromBase64)('assets/proto/world.proto', 'world.Blob', levelParamBinBit, function (object) {
                _this.world = worldCreator((0, world_serializer_1.WorldJsonFromBitsIntArray)(object.data));
            });
        }
        else if (levelButtons.length > 0)
            levelButtons[0].click();
    };
    GameScene.prototype.getLevelUrl = function (mode) {
        if (mode === void 0) { mode = 'game'; }
        var worldJson = this.world.toJson();
        var intArr = (0, world_serializer_1.WorldJsonToBitsIntArray)(worldJson);
        return (0, helpers_1.protobufToBase64Promise)('assets/proto/world.proto', 'world.Blob', { data: intArr }).then(function (lvl) {
            return toLevelUrl(mode, 'bit', lvl);
        });
    };
    GameScene.prototype.update = function () {
        this.world.tick();
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
function toLevelUrl(mode, paramName, lvl) {
    var url = new URL(window.location.href);
    url.searchParams.forEach(function (v, k) { return url.searchParams.delete(k); });
    url.searchParams.set(paramName, lvl);
    if (mode === 'game')
        url.pathname = url.pathname.replace('designer.html', '');
    return url.toString();
}
function makeCursorFromImg(img, width, height) {
    if (width === void 0) { width = 32; }
    if (height === void 0) { height = width; }
    var canvas = document.createElement('canvas');
    canvas.height = canvas.width = 32;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    var cursorImg = canvas.toDataURL('image/png');
    return "url(".concat(cursorImg, ") ").concat(width / 2, " ").concat(height / 2, ", auto");
}


/***/ }),

/***/ "./src/scenes/index.ts":
/*!*****************************!*\
  !*** ./src/scenes/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var boot_scene_1 = __webpack_require__(/*! ./boot-scene */ "./src/scenes/boot-scene.ts");
var game_scene_1 = __webpack_require__(/*! ./game-scene */ "./src/scenes/game-scene.ts");
exports.default = [boot_scene_1.BootScene, game_scene_1.GameScene];


/***/ }),

/***/ "./src/simulation/body-factory.ts":
/*!****************************************!*\
  !*** ./src/simulation/body-factory.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyFactory = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/simulation/utils.ts");
var BodyFactory = /** @class */ (function () {
    function BodyFactory(scene, burnCallback, escapeCallback) {
        this.physics = scene.physics;
        this.peopleGroup = new Phaser.GameObjects.Group(scene);
        this.wallsGroup = new Phaser.GameObjects.Group(scene);
        this.physics.add.collider(this.peopleGroup, this.peopleGroup);
        this.physics.add.collider(this.peopleGroup, this.wallsGroup);
        this.burnCallback = burnCallback;
        this.escapeCallback = escapeCallback;
    }
    BodyFactory.prototype.arrow = function (coords, direction) {
        return this.physics.add.sprite(coords.x, coords.y, 'arrow-' + utils_1.Direction[direction].toLowerCase());
    };
    BodyFactory.prototype.actor = function (x, y, r) {
        var sprite = this.physics.add.sprite(x, y, 'man');
        sprite.play({ key: 'run', repeat: -1, startFrame: (Math.random() * 10) | 0, frameRate: 4 });
        sprite.setMaxVelocity(50);
        sprite.body.bounce.set(1);
        sprite.body.setCollideWorldBounds(true);
        this.peopleGroup.add(sprite);
        return sprite;
    };
    BodyFactory.prototype.wall = function (_a, _b) {
        var x = _a.x, y = _a.y;
        var w = _b.x, h = _b.y;
        var sprite = this.physics.add.staticSprite(x, y, 'wall');
        sprite.body.setSize(w, h);
        sprite.setScale(w / sprite.width, h / sprite.height);
        this.wallsGroup.add(sprite);
        return sprite;
    };
    BodyFactory.prototype.fire = function (_a, _b) {
        var _this = this;
        var x = _a.x, y = _a.y;
        var w = _b.x, h = _b.y;
        var sprite = this.physics.add.sprite(x, y, 'fire');
        sprite.setScale(0);
        sprite.play({
            key: 'fire',
            repeat: -1,
            startFrame: Phaser.Math.RND.between(0, 4),
            frameRate: Phaser.Math.RND.between(8, 10),
        });
        this.physics.scene.sound.play('fire-new', { volume: Phaser.Math.RND.realInRange(0.1, 0.2) });
        this.physics.scene.tweens.timeline({
            targets: sprite,
            duration: Phaser.Math.RND.between(400, 1000),
            tweens: [
                {
                    scaleX: w / sprite.width,
                    scaleY: h / sprite.height,
                },
            ],
        });
        this.physics.add.overlap(sprite, this.peopleGroup, function (fire, person) {
            _this.burnCallback(fire, person);
        });
        return sprite;
    };
    BodyFactory.prototype.exit = function (_a, _b) {
        var _this = this;
        var x = _a.x, y = _a.y;
        var w = _b.x, h = _b.y;
        var sprite = this.physics.add.sprite(x, y, 'exit');
        sprite.setScale(w / sprite.width, h / sprite.height);
        this.physics.add.overlap(sprite, this.peopleGroup, function (escape, person) {
            _this.escapeCallback(person);
        });
        return sprite;
    };
    return BodyFactory;
}());
exports.BodyFactory = BodyFactory;


/***/ }),

/***/ "./src/simulation/objects.ts":
/*!***********************************!*\
  !*** ./src/simulation/objects.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = exports.Fire = exports.Arrow = exports.GameObject = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/simulation/utils.ts");
var GameObject = /** @class */ (function () {
    function GameObject(coordinates, sprite) {
        this.cell = coordinates;
        this.sprite = sprite;
    }
    Object.defineProperty(GameObject.prototype, "x", {
        get: function () {
            return this.cell.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "y", {
        get: function () {
            return this.cell.y;
        },
        enumerable: false,
        configurable: true
    });
    return GameObject;
}());
exports.GameObject = GameObject;
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(coordinates, direction, sprite) {
        var _this = _super.call(this, coordinates, sprite) || this;
        _this.direction = direction;
        return _this;
    }
    Object.defineProperty(Arrow.prototype, "directionVector", {
        get: function () {
            return (0, utils_1.directionVector)(this.direction);
        },
        enumerable: false,
        configurable: true
    });
    return Arrow;
}(GameObject));
exports.Arrow = Arrow;
var Fire = /** @class */ (function (_super) {
    __extends(Fire, _super);
    function Fire(coordinates, sprite) {
        return _super.call(this, coordinates, sprite) || this;
    }
    Fire.prototype.tick = function (world) {
        if (Math.random() >= 0.01)
            return;
        var possibleDirections = [];
        var fireCell = this.cell;
        if (!world.hasWallLoc(fireCell, 'Top'))
            possibleDirections.push(utils_1.Direction.UP);
        if (!world.hasWallLoc(__assign(__assign({}, fireCell), { y: fireCell.y + 1 }), 'Top'))
            possibleDirections.push(utils_1.Direction.DOWN);
        if (!world.hasWallLoc(fireCell, 'Left'))
            possibleDirections.push(utils_1.Direction.LEFT);
        if (!world.hasWallLoc(__assign(__assign({}, fireCell), { x: fireCell.x + 1 }), 'Left'))
            possibleDirections.push(utils_1.Direction.RIGHT);
        if (possibleDirections.length === 0)
            return;
        var dirVector = (0, utils_1.directionVector)((0, utils_1.randomElement)(possibleDirections));
        var growth = { x: this.x + dirVector.x, y: this.y + dirVector.y };
        if (!world.inBounds(growth) || world.fires.some(function (v) { return v.x === growth.x && v.y === growth.y; }))
            return;
        world.addFire(growth);
    };
    return Fire;
}(GameObject));
exports.Fire = Fire;
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(coordinates, location, sprite) {
        var _this = _super.call(this, coordinates, sprite) || this;
        _this.location = location;
        return _this;
    }
    Wall.prototype.line = function (cellSize) {
        if (this.location === 'Top') {
            var left = this.sprite.getLeftCenter();
            var right = this.sprite.getRightCenter();
            return { a: { x: left.x, y: this.sprite.y }, b: { x: right.x, y: this.sprite.y } };
        }
        else {
            var top_1 = this.sprite.getTopCenter();
            var bottom = this.sprite.getBottomCenter();
            return { a: { x: this.sprite.x, y: top_1.y }, b: { x: this.sprite.x, y: bottom.y } };
        }
    };
    return Wall;
}(GameObject));
exports.Wall = Wall;


/***/ }),

/***/ "./src/simulation/person.ts":
/*!**********************************!*\
  !*** ./src/simulation/person.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/simulation/utils.ts");
var world_1 = __webpack_require__(/*! ./world */ "./src/simulation/world.ts");
function norm(v, mul) {
    if (mul === void 0) { mul = 1; }
    var l = (0, utils_1.length)(v);
    return { x: (mul * v.x) / l, y: (mul * v.y) / l };
}
var Person = /** @class */ (function () {
    function Person(sprite) {
        this.vision = 200;
        this.speed = 100;
        this.sprite = sprite;
        var texts = ['ААААА', 'ГОРИМ', 'ПОЖАР', 'ПУСТИТЕ', '!!!'];
        this.text = sprite.scene.add.text(sprite.x, sprite.y, Phaser.Utils.Array.GetRandom(texts), {
            color: 'red',
            backgroundColor: '#FFFFFFAA',
            fontSize: '11px',
        });
        this.text.setVisible(false);
    }
    Person.prototype.destroy = function () {
        this.sprite.destroy();
        this.text.destroy();
    };
    Object.defineProperty(Person.prototype, "x", {
        get: function () {
            return this.sprite.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "y", {
        get: function () {
            return this.sprite.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "coordinates", {
        get: function () {
            return { x: this.x, y: this.y };
        },
        enumerable: false,
        configurable: true
    });
    Person.prototype.acceleration = function (object, arrowDirection) {
        if (arrowDirection === void 0) { arrowDirection = { x: 0, y: 0 }; }
        var toArrow = (0, utils_1.substract)(object, this.coordinates);
        toArrow.x /= (0, utils_1.length)(toArrow);
        toArrow.y /= (0, utils_1.length)(toArrow);
        return {
            x: (toArrow.x + arrowDirection.x * 2) * this.speed,
            y: (toArrow.y + arrowDirection.y * 2) * this.speed,
        };
    };
    Person.prototype.accelerationOut = function (object, arrowDirection) {
        if (arrowDirection === void 0) { arrowDirection = { x: 0, y: 0 }; }
        var toArrow = (0, utils_1.substract)(this.coordinates, object);
        toArrow.x /= (0, utils_1.length)(toArrow);
        toArrow.y /= (0, utils_1.length)(toArrow);
        return {
            x: (toArrow.x + arrowDirection.x * 2) * this.speed,
            y: (toArrow.y + arrowDirection.y * 2) * this.speed,
        };
    };
    Person.prototype.accelerate = function (object, arrowDirection) {
        if (arrowDirection === void 0) { arrowDirection = { x: 0, y: 0 }; }
        var acceleration = this.acceleration(object, arrowDirection);
        return acceleration;
    };
    Person.prototype.accelerateOut = function (object, arrowDirection) {
        if (arrowDirection === void 0) { arrowDirection = { x: 0, y: 0 }; }
        var acceleration = this.accelerationOut(object, arrowDirection);
        this.sprite.setAcceleration(acceleration.x, acceleration.y);
    };
    Person.prototype.tick = function (world) {
        var fire = this.findClosestObject(world.fires, world);
        var vectors = new Array();
        this.text.x = this.sprite.x;
        this.text.y = this.sprite.y - this.sprite.height;
        this.text.setVisible(fire !== false);
        var exit = this.findClosestObject(world.exits, world);
        if (exit) {
            vectors.push(norm((0, utils_1.substract)(world.cellToVector(exit), this.coordinates)));
            var _a = norm(vectors.reduce(function (sum, v) { return ({ x: sum.x + v.x, y: sum.y + v.y }); })), x_1 = _a.x, y_1 = _a.y;
            this.sprite.setAcceleration(x_1 * this.speed, y_1 * this.speed);
        }
        var arrow = this.findClosestObject(world.arrows, world);
        if (arrow) {
            var dist = (0, utils_1.distance)(this.coordinates, world.cellToVector(arrow)) / world_1.cellSize;
            vectors.push(norm(this.accelerate(world.cellToVector(arrow.cell), arrow.directionVector), 1 / (1 + dist)));
            var _b = norm(vectors.reduce(function (sum, v) { return ({ x: sum.x + v.x, y: sum.y + v.y }); })), x_2 = _b.x, y_2 = _b.y;
            this.sprite.setAcceleration(x_2 * this.speed, y_2 * this.speed);
            return;
        }
        if (fire) {
            var dist = (0, utils_1.distance)(this.coordinates, world.cellToVector(fire)) / world_1.cellSize;
            vectors.push(norm((0, utils_1.substract)(this.coordinates, world.cellToVector(fire)), 4 / (2 + dist)));
        }
        vectors.push(norm({ x: (0, utils_1.randomRange)(-this.speed, this.speed), y: (0, utils_1.randomRange)(-this.speed, this.speed) }));
        var _c = norm(vectors.reduce(function (sum, v) { return ({ x: sum.x + v.x, y: sum.y + v.y }); })), x = _c.x, y = _c.y;
        this.sprite.setAcceleration(x * this.speed, y * this.speed);
    };
    Person.prototype.findClosestObject = function (objects, world) {
        var _this = this;
        var objDistances = objects.map(function (obj) { return (0, utils_1.distance)(_this.coordinates, world.cellToVector(obj.cell)); });
        var minExitDistance = Infinity;
        var obj = null;
        for (var i in objDistances) {
            if (world.collidesWithWall(world.cellToVector(objects[i].cell), this.coordinates)) {
                continue;
            }
            if (minExitDistance > objDistances[i]) {
                minExitDistance = objDistances[i];
                obj = objects[i];
            }
        }
        return minExitDistance < this.vision && obj;
    };
    return Person;
}());
exports.Person = Person;


/***/ }),

/***/ "./src/simulation/utils.ts":
/*!*********************************!*\
  !*** ./src/simulation/utils.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.collide = exports.randomDirection = exports.randomElement = exports.randomInteger = exports.randomRange = exports.length = exports.distance = exports.mul = exports.substract = exports.directionVector = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction = exports.Direction || (exports.Direction = {}));
function directionVector(direction) {
    return direction === Direction.UP
        ? { x: 0, y: -1 }
        : direction === Direction.DOWN
            ? { x: 0, y: 1 }
            : direction === Direction.LEFT
                ? { x: -1, y: 0 }
                : { x: 1, y: 0 };
}
exports.directionVector = directionVector;
function substract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}
exports.substract = substract;
function mul(a, b) {
    return { x: a.x * b, y: a.y * b };
}
exports.mul = mul;
function distance(from, to) {
    return Math.sqrt(Math.pow((from.x - to.x), 2) + Math.pow((from.y - to.y), 2));
}
exports.distance = distance;
function length(vector) {
    return distance({ x: 0, y: 0 }, vector);
}
exports.length = length;
function randomRange(from, to) {
    return Math.random() * (to - from) + from;
}
exports.randomRange = randomRange;
function randomInteger(from, to) {
    return Math.floor(randomRange(from, to));
}
exports.randomInteger = randomInteger;
function randomElement(array) {
    return array[randomInteger(0, array.length)];
}
exports.randomElement = randomElement;
var directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
function randomDirection() {
    return randomElement(directions);
}
exports.randomDirection = randomDirection;
function collide(a1, b1, a2, b2) {
    var x1 = a1.x;
    var x2 = b1.x;
    var x3 = a2.x;
    var x4 = b2.x;
    var y1 = a1.y;
    var y2 = b1.y;
    var y3 = a2.y;
    var y4 = b2.y;
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}
exports.collide = collide;


/***/ }),

/***/ "./src/simulation/world-serializer.ts":
/*!********************************************!*\
  !*** ./src/simulation/world-serializer.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldJsonFromBitsIntArray = exports.WorldJsonToBitsIntArray = exports.WorldJsonFromIntArray = exports.WorldJsonToIntArray = void 0;
function WorldJsonToIntArray(json) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], VectorArrayToIntArray(json.actors), true), ArrowsArrayToIntArray(json.arrows), true), VectorArrayToIntArray(json.fires), true), VectorArrayToIntArray(json.exits), true), VectorArrayToIntArray(json.wallTops), true), VectorArrayToIntArray(json.wallLefts), true);
}
exports.WorldJsonToIntArray = WorldJsonToIntArray;
function WorldJsonFromIntArray(arr) {
    var result = {};
    var iterator = { idx: 0 };
    result.actors = VectorArrayFromIntArray(arr, iterator);
    result.arrows = ArrowsArrayFromIntArray(arr, iterator);
    result.fires = VectorArrayFromIntArray(arr, iterator);
    result.exits = VectorArrayFromIntArray(arr, iterator);
    result.wallTops = VectorArrayFromIntArray(arr, iterator);
    result.wallLefts = VectorArrayFromIntArray(arr, iterator);
    return result;
}
exports.WorldJsonFromIntArray = WorldJsonFromIntArray;
function WorldJsonToBitsIntArray(json) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], VectorArrayToBitsIntArray(1, 10, json.actors), true), ArrowsArrayToIntArray(json.arrows), true), VectorArrayToBitsIntArray(3, 4, json.fires), true), VectorArrayToBitsIntArray(3, 4, json.exits), true), VectorArrayToBitsIntArray(3, 4, json.wallTops), true), VectorArrayToBitsIntArray(3, 4, json.wallLefts), true);
}
exports.WorldJsonToBitsIntArray = WorldJsonToBitsIntArray;
function WorldJsonFromBitsIntArray(arr) {
    var result = {};
    var iterator = { idx: 0 };
    result.actors = VectorArrayFromBitsIntArray(1, 10, arr, iterator);
    result.arrows = ArrowsArrayFromIntArray(arr, iterator);
    result.fires = VectorArrayFromBitsIntArray(3, 4, arr, iterator);
    result.exits = VectorArrayFromBitsIntArray(3, 4, arr, iterator);
    result.wallTops = VectorArrayFromBitsIntArray(3, 4, arr, iterator);
    result.wallLefts = VectorArrayFromBitsIntArray(3, 4, arr, iterator);
    return result;
}
exports.WorldJsonFromBitsIntArray = WorldJsonFromBitsIntArray;
function VectorArrayToIntArray(arr) {
    var result = [];
    if (arr) {
        result.push(arr.length);
        arr.forEach(function (v) { return result.push([v.x, v.y]); });
    }
    else
        result.push(0);
    return result.flat();
}
function ArrowsArrayToIntArray(arr) {
    var result = [];
    if (arr) {
        result.push(arr.length);
        arr.forEach(function (v) { return result.push([v.dir, v.vec.x, v.vec.y]); });
    }
    else
        result.push(0);
    return result.flat();
}
function VectorArrayFromIntArray(arr, iterator) {
    var result = [];
    var len = arr[iterator.idx++];
    for (var i = 0; i < len; ++i) {
        result.push({
            x: arr[iterator.idx++],
            y: arr[iterator.idx++],
        });
    }
    return result;
}
function ArrowsArrayFromIntArray(arr, iterator) {
    var result = [];
    var len = arr[iterator.idx++];
    for (var i = 0; i < len; ++i) {
        result.push({
            dir: arr[iterator.idx++],
            vec: {
                x: arr[iterator.idx++],
                y: arr[iterator.idx++],
            },
        });
    }
    return result;
}
function zipXY(intSize, v, shift) {
    return (v.x << (intSize + 2 * intSize * shift)) | (v.y << (2 * intSize * shift));
}
function getMask(bitsCount) {
    var mask = 1;
    for (var i = 0; i < bitsCount; ++i)
        mask *= 2;
    return mask - 1;
}
function unzipXY(intSize, container, shift) {
    var mask = getMask(intSize);
    return {
        x: (container >> (intSize + 2 * intSize * shift)) & mask,
        y: (container >> (2 * intSize * shift)) & mask,
    };
}
function zipXYs(intSize, arr) {
    return arr.reduce(function (int, v, shift) { return int | zipXY(intSize, v, shift); }, 0);
}
function unzipXYs(intSize, container, lenght) {
    return new Array(lenght).fill(0).map(function (_, i) { return unzipXY(intSize, container, i); });
}
function VectorArrayToBitsIntArray(batchSize, intSize, arr) {
    var result = [];
    var n = batchSize;
    if (arr) {
        result.push(arr.length);
        for (var i = 0; i < ((arr.length / n) | 0); ++i) {
            result.push(zipXYs(intSize, arr.slice(n * i, n * i + n)));
        }
        if (arr.length % n) {
            var tmp = arr.slice(arr.length - (arr.length % n));
            if (tmp.length != arr.length % n) {
                throw new Error("".concat(tmp.length, ":").concat(arr.length % n));
            }
            result.push(zipXYs(intSize, tmp));
        }
    }
    else
        result.push(0);
    return result;
}
function VectorArrayFromBitsIntArray(batchSize, intSize, arr, iterator) {
    var result = [];
    var len = arr[iterator.idx++];
    var n = batchSize;
    for (var i = 0; i < ((len / n) | 0); ++i) {
        var value = arr[iterator.idx++];
        result.push.apply(result, unzipXYs(intSize, value, n));
    }
    if (len % n) {
        var value = arr[iterator.idx++];
        result.push.apply(result, unzipXYs(intSize, value, (len % n)));
    }
    return result;
}


/***/ }),

/***/ "./src/simulation/world.ts":
/*!*********************************!*\
  !*** ./src/simulation/world.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.World = exports.cellSize = void 0;
var helpers_1 = __webpack_require__(/*! ../helpers */ "./src/helpers.ts");
var objects_1 = __webpack_require__(/*! ./objects */ "./src/simulation/objects.ts");
var person_1 = __webpack_require__(/*! ./person */ "./src/simulation/person.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/simulation/utils.ts");
exports.cellSize = 50;
var World = /** @class */ (function () {
    function World(bounds, bodyFactory, json, onUpdate) {
        this.onUpdate = onUpdate;
        this.actors = [];
        this.arrows = [];
        this.fires = [];
        this.exits = [];
        this.wallTops = [];
        this.wallLefts = [];
        this.runningSimulation = false;
        this.bounds = bounds;
        this.bodyFactory = bodyFactory;
        this.worldJson = json;
        this.reloadWorld(helpers_1.isDesigner, true);
    }
    Object.defineProperty(World.prototype, "potentialActorsCount", {
        get: function () {
            var _a;
            return ((_a = this.worldJson.actors) === null || _a === void 0 ? void 0 : _a.length) || 0;
        },
        enumerable: false,
        configurable: true
    });
    World.prototype.reloadWorld = function (spawnActors, spawnWorld) {
        var json = this.worldJson;
        if (json.actors && spawnActors)
            for (var _i = 0, _a = json.actors; _i < _a.length; _i++) {
                var actor = _a[_i];
                this.addActor(actor.x, actor.y);
            }
        if (json.fires && spawnActors)
            for (var _b = 0, _c = json.fires; _b < _c.length; _b++) {
                var actor = _c[_b];
                this.addFire({ x: actor.x, y: actor.y });
            }
        if (json.arrows && spawnWorld)
            for (var _d = 0, _e = json.arrows; _d < _e.length; _d++) {
                var actor = _e[_d];
                this.addArrow(actor.vec, actor.dir);
            }
        if (json.exits && spawnWorld)
            for (var _f = 0, _g = json.exits; _f < _g.length; _f++) {
                var actor = _g[_f];
                this.addExit({ x: actor.x, y: actor.y });
            }
        if (json.wallLefts && spawnWorld)
            for (var _h = 0, _j = json.wallLefts; _h < _j.length; _h++) {
                var actor = _j[_h];
                this.addWallLoc({ x: actor.x, y: actor.y }, 'Left');
            }
        if (json.wallTops && spawnWorld)
            for (var _k = 0, _l = json.wallTops; _k < _l.length; _k++) {
                var actor = _l[_k];
                this.addWallLoc({ x: actor.x, y: actor.y }, 'Top');
            }
    };
    World.prototype.runSimulation = function () {
        if (this.runningSimulation)
            return;
        if (helpers_1.isDesigner) {
            this.worldJson = this.toJson();
        }
        else {
            this.reloadWorld(true, false);
        }
        this.runningSimulation = true;
    };
    World.prototype.stopSimulation = function () {
        if (!this.runningSimulation)
            return;
        this.runningSimulation = false;
        if (helpers_1.isDesigner) {
            this.deleteAll();
            this.reloadWorld(true, true);
        }
        else {
            this.killAll();
        }
    };
    World.prototype.isRunning = function () {
        return this.runningSimulation;
    };
    World.prototype.toJson = function () {
        return {
            actors: this.actors.map(function (actor) { return actor.coordinates; }),
            arrows: this.arrows.map(function (arrow) { return ({ vec: arrow.cell, dir: arrow.direction }); }),
            fires: this.fires.map(function (actor) { return actor.cell; }),
            exits: this.exits.map(function (actor) { return actor.cell; }),
            wallLefts: this.wallLefts.map(function (actor) { return actor.cell; }),
            wallTops: this.wallTops.map(function (actor) { return actor.cell; }),
        };
    };
    // ** Deletion **
    World.prototype.delete = function (coordinates) {
        if (this.runningSimulation)
            return;
        var cell = this.absoluteToCell(coordinates);
        if (helpers_1.isDesigner) {
            this.fires = filterGameObjects(cell, this.fires);
            this.exits = filterGameObjects(cell, this.exits);
            this.deleteWall(coordinates);
        }
        this.arrows = filterGameObjects(cell, this.arrows);
        this.onUpdate(this);
    };
    World.prototype.deleteAll = function () {
        for (var _i = 0, _a = this.actors; _i < _a.length; _i++) {
            var actor = _a[_i];
            actor.destroy();
        }
        this.actors = [];
        for (var _b = 0, _c = this.arrows; _b < _c.length; _b++) {
            var actor = _c[_b];
            actor.sprite.destroy();
        }
        this.arrows = [];
        for (var _d = 0, _e = this.fires; _d < _e.length; _d++) {
            var actor = _e[_d];
            actor.sprite.destroy();
        }
        this.fires = [];
        for (var _f = 0, _g = this.exits; _f < _g.length; _f++) {
            var actor = _g[_f];
            actor.sprite.destroy();
        }
        this.exits = [];
        for (var _h = 0, _j = this.wallLefts; _h < _j.length; _h++) {
            var actor = _j[_h];
            actor.sprite.destroy();
        }
        this.wallLefts = [];
        for (var _k = 0, _l = this.wallTops; _k < _l.length; _k++) {
            var actor = _l[_k];
            actor.sprite.destroy();
        }
        this.wallTops = [];
        this.onUpdate(this);
    };
    // ** Actors **
    World.prototype.spawnManyActors = function (num) {
        if (num === void 0) { num = 25; }
        for (var i = 0; i < num; i++) {
            var _a = {
                x: (0, utils_1.randomRange)(0, this.bounds.x * exports.cellSize),
                y: (0, utils_1.randomRange)(0, this.bounds.y * exports.cellSize),
            }, x = _a.x, y = _a.y;
            this.addActor(x, y);
        }
    };
    World.prototype.addActor = function (x, y) {
        var sprite = this.bodyFactory.actor(Math.floor(x), Math.floor(y), 0);
        var person = new person_1.Person(sprite);
        this.actors.push(person);
        this.onUpdate(this);
    };
    World.prototype.killAll = function () {
        this.actors.forEach(function (actor) { return actor.destroy(); });
        this.fires.forEach(function (actor) { return actor.sprite.destroy(); });
        this.actors = [];
        this.fires = [];
        this.onUpdate(this);
    };
    World.prototype.deletePersonBySprite = function (sprite) {
        this.actors = this.actors.filter(function (p) {
            if (p.sprite != sprite)
                return true;
            p.sprite.body.checkCollision.none = true;
            p.sprite.scene.tweens.timeline({
                targets: p.sprite,
                duration: 500,
                tweens: [
                    {
                        scale: 0,
                    },
                ],
                onComplete: function () { return p.destroy(); },
            });
            return false;
        });
        this.onUpdate(this);
    };
    // ** Walls **
    World.prototype.addWall = function (coordinates) {
        var _a = this.getWallCell(coordinates), cell = _a.cell, loc = _a.loc;
        if (this.hasWallLoc(cell, loc))
            return;
        this.addWallLoc(cell, loc);
    };
    World.prototype.hasWallLoc = function (cell, loc) {
        if (loc === 'Top') {
            return this.wallTops.some(function (v) { return v.x === cell.x && v.y === cell.y; });
        }
        else {
            return this.wallLefts.some(function (v) { return v.x === cell.x && v.y === cell.y; });
        }
    };
    World.prototype.collidesWithWall = function (a, b) {
        return (this.wallTops.some(function (wall) {
            var wallLine = wall.line(exports.cellSize);
            return (0, utils_1.collide)(a, b, wallLine.a, wallLine.b);
        }) ||
            this.wallLefts.some(function (wall) {
                var wallLine = wall.line(exports.cellSize);
                return (0, utils_1.collide)(a, b, wallLine.a, wallLine.b);
            }));
    };
    World.prototype.addWallLoc = function (cell, loc) {
        if (loc === 'Top') {
            var sprite = this.bodyFactory.wall({ x: cell.x * exports.cellSize, y: cell.y * exports.cellSize - exports.cellSize / 2 }, { x: exports.cellSize + 10, y: 10 });
            this.wallTops.push(new objects_1.Wall(cell, 'Top', sprite));
        }
        else {
            var sprite = this.bodyFactory.wall({ x: cell.x * exports.cellSize - exports.cellSize / 2, y: cell.y * exports.cellSize }, { x: 10, y: exports.cellSize + 10 });
            this.wallLefts.push(new objects_1.Wall(cell, 'Left', sprite));
        }
    };
    World.prototype.deleteWall = function (coordinates) {
        var _a = this.getWallCell(coordinates), cell = _a.cell, loc = _a.loc;
        if (loc === 'Top') {
            this.wallTops = filterGameObjects(cell, this.wallTops);
        }
        else {
            this.wallLefts = filterGameObjects(cell, this.wallLefts);
        }
    };
    World.prototype.getWallCell = function (coordinates) {
        var inCellX = (coordinates.x - exports.cellSize / 2) % exports.cellSize;
        var inCellY = (coordinates.y - exports.cellSize / 2) % exports.cellSize;
        var cell = this.absoluteToCell(coordinates);
        if (inCellX > inCellY) {
            if (exports.cellSize - inCellY > inCellX) {
                return { cell: cell, loc: 'Top' };
            }
            else {
                return { cell: { x: cell.x + 1, y: cell.y }, loc: 'Left' };
            }
        }
        else {
            if (exports.cellSize - inCellY > inCellX) {
                return { cell: cell, loc: 'Left' };
            }
            else {
                return { cell: { x: cell.x, y: cell.y + 1 }, loc: 'Top' };
            }
        }
    };
    // ** Arrow **
    World.prototype.addArrow = function (cell, direction) {
        var oldArrowIndex = this.arrows.findIndex(function (v) { return v.x === cell.x && v.y === cell.y; });
        var sprite = this.bodyFactory.arrow({ x: cell.x * exports.cellSize, y: cell.y * exports.cellSize }, direction);
        var arrow = new objects_1.Arrow(cell, direction, sprite);
        if (oldArrowIndex != -1) {
            this.arrows[oldArrowIndex].sprite.destroy();
            this.arrows[oldArrowIndex] = arrow;
        }
        else {
            this.arrows.push(arrow);
            this.onUpdate(this);
        }
    };
    // ** Fire **
    World.prototype.addFire = function (cell) {
        var sprite = this.bodyFactory.fire({ x: cell.x * exports.cellSize, y: cell.y * exports.cellSize }, { x: exports.cellSize, y: exports.cellSize });
        var fire = new objects_1.Fire(cell, sprite);
        this.fires.push(fire);
    };
    // ** Exit **
    World.prototype.addExit = function (cell) {
        var sprite = this.bodyFactory.exit({ x: cell.x * exports.cellSize, y: cell.y * exports.cellSize }, { x: exports.cellSize, y: exports.cellSize });
        this.exits.push(new objects_1.GameObject(cell, sprite));
    };
    World.prototype.tick = function () {
        if (!this.isRunning())
            return;
        for (var _i = 0, _a = this.fires; _i < _a.length; _i++) {
            var fire = _a[_i];
            fire.tick(this);
        }
        for (var _b = 0, _c = this.actors; _b < _c.length; _b++) {
            var actor = _c[_b];
            actor.tick(this);
        }
    };
    World.prototype.absoluteToCell = function (v) {
        return {
            x: Math.round(v.x / exports.cellSize),
            y: Math.round(v.y / exports.cellSize),
        };
    };
    World.prototype.cellToVector = function (v) {
        return {
            x: Math.round(v.x * exports.cellSize),
            y: Math.round(v.y * exports.cellSize),
        };
    };
    World.prototype.inBounds = function (vector) {
        return this.bounds.x >= vector.x && this.bounds.y >= vector.y && vector.y > 0 && vector.x > 0;
    };
    return World;
}());
exports.World = World;
function filterGameObjects(cell, array) {
    var toDelete = array.filter(function (v) { return v.x === cell.x && v.y === cell.y; });
    toDelete.forEach(function (object) {
        object.sprite.destroy();
    });
    return array.filter(function (v) { return !(v.x === cell.x && v.y === cell.y); });
}


/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map