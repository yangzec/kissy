/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Apr 3 19:02
*/
/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Apr 3 19:02
*/
/**
 * @ignore
 * A seed where KISSY grows up from, KISS Yeah !
 * @author https://github.com/kissyteam/kissy/contributors
 */

/**
 * The KISSY global namespace object. you can use
 *
 *
 *      KISSY.each/mix
 *
 * to do basic operation. or
 *
 *
 *      KISSY.use('overlay,node', function(S, Overlay, Node){
 *          //
 *      });
 *
 * to do complex task with modules.
 * @singleton
 * @class KISSY
 */
/* exported KISSY */
/*jshint -W079 */
var KISSY = (function (undefined) {
    var self = this,
        S,
        guid = 0,
        EMPTY = '';

    function getLogger(logger) {
        var obj = {};
        for (var cat in loggerLevel) {
            /*jshint loopfunc: true*/
            (function (obj, cat) {
                obj[cat] = function (msg) {
                    return S.log(msg, cat, logger);
                };
            })(obj, cat);
        }
        return obj;
    }

    var loggerLevel = {
        debug: 10,
        info: 20,
        warn: 30,
        error: 40
    };

    S = {
        /**
         * The build time of the library.
         * NOTICE: '20140403190159' will replace with current timestamp when compressing.
         * @private
         * @type {String}
         */
        __BUILD_TIME: '20140403190159',

        /**
         * KISSY Environment.
         * @private
         * @type {Object}
         */
        Env: {
            host: self
        },

        /**
         * KISSY Config.
         * If load kissy.js, Config.debug defaults to true.
         * Else If load kissy-min.js, Config.debug defaults to false.
         * @private
         * @property {Object} Config
         * @property {Boolean} Config.debug
         * @member KISSY
         */
        Config: {
            debug: '@DEBUG@',
            fns: {}
        },

        /**
         * The version of the library.
         * NOTICE: '1.50' will replace with current version when compressing.
         * @type {String}
         */
        version: '1.50',

        /**
         * set KISSY configuration
         * @param {Object|String} configName Config object or config key.
         * @param {String} configName.base KISSY 's base path. Default: get from loader(-min).js or seed(-min).js
         * @param {String} configName.tag KISSY 's timestamp for native module. Default: KISSY 's build time.
         * @param {Boolean} configName.debug whether to enable debug mod.
         * @param {Boolean} configName.combine whether to enable combo.
         * @param {Object} configName.logger logger config
         * @param {Object[]} configName.logger.excludes  exclude configs
         * @param {Object} configName.logger.excludes.0 a single exclude config
         * @param {RegExp} configName.logger.excludes.0.logger  matched logger will be excluded from logging
         * @param {String} configName.logger.excludes.0.minLevel  minimum logger level (enum of debug info warn error)
         * @param {String} configName.logger.excludes.0.maxLevel  maximum logger level (enum of debug info warn error)
         * @param {Object[]} configName.logger.includes include configs
         * @param {Object} configName.logger.includes.0 a single include config
         * @param {RegExp} configName.logger.includes.0.logger  matched logger will be included from logging
         * @param {String} configName.logger.excludes.0.minLevel  minimum logger level (enum of debug info warn error)
         * @param {String} configName.logger.excludes.0.maxLevel  maximum logger level (enum of debug info warn error)
         * @param {Object} configName.packages Packages definition with package name as the key.
         * @param {String} configName.packages.base Package base path.
         * @param {String} configName.packages.tag  Timestamp for this package's module file.
         * @param {String} configName.packages.debug Whether force debug mode for current package.
         * @param {String} configName.packages.combine Whether allow combine for current package modules.
         * can only be used in production mode.
         * @param [configValue] config value.
         *
         * for example:
         *     @example
         *     KISSY.config({
         *      combine: true,
         *      base: '',
         *      packages: {
         *          'gallery': {
         *              base: 'http://a.tbcdn.cn/s/kissy/gallery/'
         *          }
         *      },
         *      modules: {
         *          'gallery/x/y': {
         *              requires: ['gallery/x/z']
         *          }
         *      }
         *     });
         */
        config: function (configName, configValue) {
            var cfg,
                r,
                self = this,
                fn,
                Config = S.Config,
                configFns = Config.fns;
            if (typeof configName === 'string') {
                cfg = configFns[configName];
                if (configValue === undefined) {
                    if (cfg) {
                        r = cfg.call(self);
                    } else {
                        r = Config[configName];
                    }
                } else {
                    if (cfg) {
                        r = cfg.call(self, configValue);
                    } else {
                        Config[configName] = configValue;
                    }
                }
            } else {
                for (var p in configName) {
                    configValue = configName[p];
                    fn = configFns[p];
                    if (fn) {
                        fn.call(self, configValue);
                    } else {
                        Config[p] = configValue;
                    }
                }
            }
            return r;
        },

        /**
         * Prints debug info.
         * @param msg {String} the message to log.
         * @param {String} [cat] the log category for the message. Default
         *        categories are 'info', 'warn', 'error', 'time' etc.
         * @param {String} [logger] the logger of the the message (opt)
         */
        log: function (msg, cat, logger) {
            if ('@DEBUG@') {
                var matched = 1;
                if (logger) {
                    var loggerCfg = S.Config.logger || {},
                        list, i, l, level, minLevel, maxLevel, reg;
                    cat = cat || 'debug';
                    level = loggerLevel[cat] || loggerLevel.debug;
                    if ((list = loggerCfg.includes)) {
                        matched = 0;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                            minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 1;
                                break;
                            }
                        }
                    } else if ((list = loggerCfg.excludes)) {
                        matched = 1;
                        for (i = 0; i < list.length; i++) {
                            l = list[i];
                            reg = l.logger;
                            maxLevel = loggerLevel[l.maxLevel] || loggerLevel.error;
                            minLevel = loggerLevel[l.minLevel] || loggerLevel.debug;
                            if (minLevel <= level && maxLevel >= level && logger.match(reg)) {
                                matched = 0;
                                break;
                            }
                        }
                    }
                    if (matched) {
                        msg = logger + ': ' + msg;
                    }
                }
                /*global console*/
                if (matched) {
                    if (typeof console !== 'undefined' && console.log) {
                        console[cat && console[cat] ? cat : 'log'](msg);
                    }
                    return msg;
                }
            }
            return undefined;
        },

        /**
         * get log instance for specified logger
         * @param {String} logger logger name
         * @returns {KISSY.Logger} log instance
         */
        getLogger: function (logger) {
            return getLogger(logger);
        },

        /**
         * Throws error message.
         */
        error: function (msg) {
            if ('@DEBUG@') {
                // with stack info!
                throw msg instanceof  Error ? msg : new Error(msg);
            }
        },

        /*
         * Generate a global unique id.
         * @param {String} [pre] guid prefix
         * @return {String} the guid
         */
        guid: function (pre) {
            return (pre || EMPTY) + guid++;
        }
    };

    if ('@DEBUG@') {
        S.Config.logger = {
            excludes: [
                {
                    logger: /^s\/.*/,
                    maxLevel: 'info',
                    minLevel: 'debug'
                }
            ]
        };
        /**
         * Log class for specified logger
         * @class KISSY.Logger
         * @private
         */
        /**
         * print debug log
         * @method debug
         * @member KISSY.Logger
         * @param {String} str log str
         */

        /**
         * print info log
         * @method info
         * @member KISSY.Logger
         * @param {String} str log str
         */

        /**
         * print warn log
         * @method log
         * @member KISSY.Logger
         * @param {String} str log str
         */

        /**
         * print error log
         * @method error
         * @member KISSY.Logger
         * @param {String} str log str
         */
    }

    return S;
})();/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader = {};

    /**
     * Loader Status Enum
     * @enum {Number} KISSY.Loader.Status
     */
    Loader.Status = {
        /** error */
        ERROR: -1,
        /** init */
        INIT: 0,
        /** loading */
        LOADING: 1,
        /** loaded */
        LOADED: 2,
        /** attaching */
        ATTACHING: 3,
        /** attached */
        ATTACHED: 4
    };
})(KISSY);/**
 * @ignore
 * Utils for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Env = S.Env,
        host = Env.host,
        data = Loader.Status,
        ATTACHED = data.ATTACHED,
        LOADED = data.LOADED,
        ATTACHING = data.ATTACHING,
        /**
         * @class KISSY.Loader.Utils
         * Utils for KISSY Loader
         * @singleton
         * @private
         */
            Utils = Loader.Utils = {},
        doc = host.document;

    // http://wiki.commonjs.org/wiki/Packages/Mappings/A
    // 如果模块名以 / 结尾，自动加 index
    function addIndexAndRemoveJsExt(s) {
        if (typeof s === 'string') {
            return addIndexAndRemoveJsExtFromName(s);
        } else {
            var ret = [],
                i = 0,
                l = s.length;
            for (; i < l; i++) {
                ret[i] = addIndexAndRemoveJsExtFromName(s[i]);
            }
            return ret;
        }
    }

    function addIndexAndRemoveJsExtFromName(name) {
        // 'x/' 'x/y/z/'
        if (name.charAt(name.length - 1) === '/') {
            name += 'index';
        }
        if (Utils.endsWith(name, '.js')) {
            name = name.slice(0, -3);
        }
        return name;
    }

    function pluginAlias(name) {
        var index = name.indexOf('!');
        if (index !== -1) {
            var pluginName = name.substring(0, index);
            name = name.substring(index + 1);
            var Plugin = S.require(pluginName);
            if (Plugin.alias) {
                //noinspection JSReferencingMutableVariableFromClosure
                name = Plugin.alias(S, name, pluginName);
            }
        }
        return name;
    }

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    function getIEVersion() {
        var m, v;
        if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))) {
            return numberify(v);
        }
        return undefined;
    }

    var m,
        ua = (host.navigator || {}).userAgent || '';

    // https://github.com/kissyteam/kissy/issues/545
    if (((m = ua.match(/AppleWebKit\/([\d.]*)/)) || (m = ua.match(/Safari\/([\d.]*)/))) && m[1]) {
        Utils.webkit = numberify(m[1]);
    }

    var urlReg = /http(s)?:\/\/([^/]+)(?::(\d+))?/;

    function each(obj, fn) {
        var i = 0,
            myKeys, l;
        if (isArray(obj)) {
            l = obj.length;
            for (; i < l; i++) {
                if (fn(obj[i], i, obj) === false) {
                    break;
                }
            }
        } else {
            myKeys = keys(obj);
            l = myKeys.length;
            for (; i < l; i++) {
                if (fn(obj[myKeys[i]], myKeys[i], obj) === false) {
                    break;
                }
            }
        }
    }

    function keys(obj) {
        var ret = [];
        for (var key in obj) {
            ret.push(key);
        }
        return ret;
    }

    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    function mix(to, from) {
        for (var i in from) {
            to[i] = from[i];
        }
        return to;
    }

    mix(Utils, {
        mix: mix,

        noop: function () {
        },

        startsWith: function (str, prefix) {
            return str.lastIndexOf(prefix, 0) === 0;
        },

        isEmptyObject: function (o) {
            for (var p in o) {
                if (p !== undefined) {
                    return false;
                }
            }
            return true;
        },

        endsWith: function (str, suffix) {
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) === ind;
        },

        now: Date.now || function () {
            return +new Date();
        },

        each: each,

        keys: keys,

        isArray: isArray,

        normalizePath: function (parentPath, subPath) {
            var firstChar = subPath.charAt(0);
            if (firstChar !== '.') {
                return subPath;
            }
            var parts = parentPath.split('/');
            var subParts = subPath.split('/');
            parts.pop();
            for (var i = 0, l = subParts.length; i < l; i++) {
                var subPart = subParts[i];
                if (subPart === '.') {
                } else if (subPart === '..') {
                    parts.pop();
                } else {
                    parts.push(subPart);
                }
            }
            return parts.join('/');
        },

        isSameOriginAs: function (url1, url2) {
            var urlParts1 = url1.match(urlReg);
            var urlParts2 = url2.match(urlReg);
            return urlParts1[0] === urlParts2[0];
        },

        ie: getIEVersion(),

        /**
         * get document head
         * @return {HTMLElement}
         */
        docHead: function () {
            return doc.getElementsByTagName('head')[0] || doc.documentElement;
        },

        /**
         * Get absolute path of dep module.similar to {@link KISSY.Path#resolve}
         * @param {String} moduleName current module 's name
         * @param {String|String[]} depName dependency module 's name
         * @return {String|String[]} normalized dependency module 's name
         */
        normalDepModuleName: function (moduleName, depName) {
            if (typeof depName === 'string') {
                return Utils.normalizePath(moduleName, depName);
            }

            var i = 0, l;

            for (l = depName.length; i < l; i++) {
                depName[i] = Utils.normalizePath(moduleName, depName[i]);
            }
            return depName;
        },

        /**
         * create modules info
         * @param {String[]} modNames to be created module names
         */
        createModulesInfo: function (modNames) {
            var ret = [];
            Utils.each(modNames, function (m, i) {
                ret[i] = Utils.createModuleInfo(m);
            });
            return ret;
        },

        /**
         * create single module info
         * @param {String} modName to be created module name
         * @param {Object} [cfg] module config
         * @return {KISSY.Loader.Module}
         */
        createModuleInfo: function (modName, cfg) {
            modName = addIndexAndRemoveJsExtFromName(modName);

            var mods = Env.mods,
                module = mods[modName];

            if (module) {
                return module;
            }

            // 防止 cfg 里有 tag，构建 fullpath 需要
            mods[modName] = module = new Loader.Module(mix({
                name: modName
            }, cfg));

            return module;
        },

        /**
         * Get modules exports
         * @param {String[]} modNames module names
         * @return {Array} modules exports
         */
        getModules: function (modNames) {
            var mods = [S], module,
                unalias,
                allOk,
                m,
                runtimeMods = Env.mods;

            Utils.each(modNames, function (modName) {
                module = runtimeMods[modName];
                if (module && module.getType() !== 'css') {
                    unalias = module.getNormalizedAlias();
                    allOk = true;
                    for (var i = 0; allOk && i < unalias.length; i++) {
                        m = runtimeMods[unalias[i]];
                        // allow partial module (circular dependency)
                        allOk = m && m.status >= ATTACHING;
                    }
                    if (allOk) {
                        mods.push(runtimeMods[unalias[0]].exports);
                    } else {
                        mods.push(null);
                    }
                } else {
                    mods.push(undefined);
                }
            });

            return mods;
        },

        /**
         * attach modules and their dependency modules recursively
         * @param {String[]} modNames module names
         */
        attachModsRecursively: function (modNames) {
            var i,
                l = modNames.length;
            for (i = 0; i < l; i++) {
                Utils.attachModRecursively(modNames[i]);
            }
        },

        /**
         * attach module and its dependency modules recursively
         * @param {String} modName module name
         */
        attachModRecursively: function (modName) {
            var mods = Env.mods,
                status,
                m = mods[modName];
            status = m.status;
            // attached or circular dependency
            if (status >= ATTACHING) {
                return;
            }
            m.status = ATTACHING;
            if (m.cjs) {
                // commonjs format will call require in module code again
                Utils.attachMod(m);
            } else {
                Utils.attachModsRecursively(m.getNormalizedRequires());
                Utils.attachMod(m);
            }
        },

        /**
         * Attach specified module.
         * @param {KISSY.Loader.Module} module module instance
         */
        attachMod: function (module) {
            var factory = module.factory,
                exports;

            if (typeof factory === 'function') {
                // compatible and efficiency
                // KISSY.add(function(S,undefined){})
                // 需要解开 index，相对路径
                // 但是需要保留 alias，防止值不对应
                //noinspection JSUnresolvedFunction
                var requires = module.requires;
                exports = factory.apply(module,
                    // KISSY.add(function(S){module.require}) lazy initialize
                    (module.cjs ? [S,
                        requires && requires.length ? module.require : undefined,
                        module.exports,
                        module] :
                        Utils.getModules(module.getRequiresWithAlias())));
                if (exports !== undefined) {
                    //noinspection JSUndefinedPropertyAssignment
                    module.exports = exports;
                }
            } else {
                //noinspection JSUndefinedPropertyAssignment
                module.exports = factory;
            }

            module.status = ATTACHED;
        },

        /**
         * Get module names as array.
         * @param {String|String[]} modNames module names array or  module names string separated by ','
         * @return {String[]}
         */
        getModNamesAsArray: function (modNames) {
            if (typeof modNames === 'string') {
                modNames = modNames.replace(/\s+/g, '').split(',');
            }
            return modNames;
        },

        /**
         * normalize module names
         * 1. add index : / => /index
         * 2. unalias : core => dom,event,ua
         * 3. relative to absolute : ./x => y/x
         * @param {String|String[]} modNames Array of module names
         *  or module names string separated by comma
         * @param {String} [refModName]
         * @return {String[]} normalized module names
         */
        normalizeModNames: function (modNames, refModName) {
            return Utils.unalias(Utils.normalizeModNamesWithAlias(modNames, refModName));
        },

        unalias: function (modNames) {
            var ret = [];
            for (var i = 0; i < modNames.length; i++) {
                var mod = Utils.createModuleInfo(modNames[i]);
                ret.push.apply(ret, mod.getNormalizedAlias());
            }
            return ret;
        },

        /**
         * normalize module names with alias
         * @param {String[]} modNames module names
         * @param [refModName] module to be referred if module name path is relative
         * @return {String[]} normalize module names with alias
         */
        normalizeModNamesWithAlias: function (modNames, refModName) {
            var ret = [],
                i, l;
            if (modNames) {
                // 1. index map
                for (i = 0, l = modNames.length; i < l; i++) {
                    // conditional loader
                    // requires:[window.localStorage?"local-storage":""]
                    if (modNames[i]) {
                        ret.push(pluginAlias(addIndexAndRemoveJsExt(modNames[i])));
                    }
                }
            }
            // 2. relative to absolute (optional)
            if (refModName) {
                ret = Utils.normalDepModuleName(refModName, ret);
            }
            return ret;
        },

        /**
         * register module with factory
         * @param {String} name module name
         * @param {Function|*} factory module's factory or exports
         * @param [config] module config, such as dependency
         */
        registerModule: function (name, factory, config) {
            name = addIndexAndRemoveJsExtFromName(name);

            var mods = Env.mods,
                module = mods[name];

            if (module && module.factory !== undefined) {
                S.log(name + ' is defined more than once', 'warn');
                return;
            }

            // 没有 use，静态载入的 add 可能执行
            Utils.createModuleInfo(name);

            module = mods[name];

            // 注意：通过 S.add(name[, factory[, config]]) 注册的代码，无论是页面中的代码，
            // 还是 js 文件里的代码，add 执行时，都意味着该模块已经 LOADED
            mix(module, {
                name: name,
                status: LOADED,
                factory: factory
            });

            mix(module, config);
        },

        /**
         * Returns hash code of a string djb2 algorithm
         * @param {String} str
         * @returns {String} hash code
         */
        getHash: function (str) {
            var hash = 5381,
                i;
            for (i = str.length; --i > -1;) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i);
                /* hash * 33 + char */
            }
            return hash + '';
        },

        getRequiresFromFn: function (fn) {
            var requires = [];
            // Remove comments from the callback string,
            // look for require calls, and pull them into the dependencies,
            // but only if there are function args.
            fn.toString()
                .replace(commentRegExp, '')
                .replace(requireRegExp, function (match, dep) {
                    requires.push(getRequireVal(dep));
                });
            return requires;
        }
    });

    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        requireRegExp = /[^.'"]\s*require\s*\(([^)]+)\)/g;

    function getRequireVal(str) {
        var m;
        // simple string
        if (!(m = str.match(/^\s*["']([^'"\s]+)["']\s*$/))) {
            S.error('can not find required mod in require call: ' + str);
        }
        return  m[1];
    }
})(KISSY);/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Config = S.Config,
        Utils = Loader.Utils,
        mix = Utils.mix;

    function checkGlobalIfNotExist(self, property) {
        return property in self ?
            self[property] :
            Config[property];
    }

    /**
     * @class KISSY.Loader.Package
     * @private
     * This class should not be instantiated manually.
     */
    function Package(cfg) {
        mix(this, cfg);
    }

    Package.prototype = {
        constructor: Package,

        reset: function (cfg) {
            mix(this, cfg);
        },

        /**
         * Tag for package.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            return checkGlobalIfNotExist(this, 'tag');
        },

        /**
         * Get package name.
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * get package url
         */
        getBase: function () {
            return this.base;
        },

        /**
         * Whether is debug for this package.
         * @return {Boolean}
         */
        isDebug: function () {
            return checkGlobalIfNotExist(this, 'debug');
        },

        /**
         * Get charset for package.
         * @return {String}
         */
        getCharset: function () {
            return checkGlobalIfNotExist(this, 'charset');
        },

        /**
         * Whether modules are combined for this package.
         * @return {Boolean}
         */
        isCombine: function () {
            return checkGlobalIfNotExist(this, 'combine');
        },

        /**
         * Get package group (for combo).
         * @returns {String}
         */
        getGroup: function () {
            return checkGlobalIfNotExist(this, 'group');
        }
    };

    Loader.Package = Package;

    /**
     * @class KISSY.Loader.Module
     * @private
     * This class should not be instantiated manually.
     */
    function Module(cfg) {
        var self = this;
        /**
         * exports of this module
         */
        self.exports = {};

        /**
         * status of current modules
         */
        self.status = Loader.Status.INIT;

        /**
         * name of this module
         */
        self.name = undefined;

        /**
         * factory of this module
         */
        self.factory = undefined;

        // lazy initialize and commonjs module format
        self.cjs = 1;
        mix(self, cfg);
        self.waits = {};

        self.require = function (moduleName) {
            return S.require(moduleName, self.name);
        };
    }

    Module.prototype = {
        kissy: 1,

        constructor: Module,

        // use by xtemplate include
        resolve: function (relativeName) {
            return Utils.normalizePath(this.name, relativeName);
        },

        add: function (loader) {
            this.waits[loader.id] = loader;
        },

        remove: function (loader) {
            delete this.waits[loader.id];
        },

        contains: function (loader) {
            return this.waits[loader.id];
        },

        flush: function () {
            Utils.each(this.waits, function (loader) {
                loader.flush();
            });
            this.waits = {};
        },

        /**
         * Get the type if current Module
         * @return {String} css or js
         */
        getType: function () {
            var self = this,
                v = self.type;
            if (!v) {
                if (Utils.endsWith(self.name, '.css')) {
                    v = 'css';
                } else {
                    v = 'js';
                }
                self.type = v;
            }
            return v;
        },

        getAlias: function () {
            var self = this,
                name = self.name,
                packageInfo,
                alias = self.alias;
            if (alias) {
                return alias;
            }
            packageInfo = self.getPackage();
            if (packageInfo.alias) {
                alias = packageInfo.alias(name);
            }
            alias = self.alias = alias || [];
            return alias;
        },

        getNormalizedAlias: function () {
            var self = this;
            if (self.normalizedAlias) {
                return self.normalizedAlias;
            }
            var alias = self.getAlias();
            if (typeof alias === 'string') {
                alias = [alias];
            }
            var ret = [];
            for (var i = 0, l = alias.length; i < l; i++) {
                if (alias[i]) {
                    var mod = Utils.createModuleInfo(alias[i]);
                    var normalAlias = mod.getNormalizedAlias();
                    if (normalAlias) {
                        ret.push.apply(ret, normalAlias);
                    } else {
                        ret.push(alias[i]);
                    }
                }
            }
            if (!ret.length) {
                ret.push(self.name);
            }
            self.normalizedAlias = ret;
            return ret;
        },

        /**
         * Get the path url of current module if load dynamically
         * @return {String}
         */
        getUrl: function () {
            var self = this;
            if (!self.url) {
                self.url = S.Config.resolveModFn(self);
            }
            return self.url;
        },

        /**
         * Get the name of current module
         * @return {String}
         */
        getName: function () {
            return this.name;
        },

        /**
         * Get the package which current module belongs to.
         * @return {KISSY.Loader.Package}
         */
        getPackage: function () {
            var self = this;
            if (!self.packageInfo) {
                var packages = Config.packages || {},
                    modNameSlash = self.name + '/',
                    pName = '',
                    p;
                for (p in packages) {
                    if (Utils.startsWith(modNameSlash, p + '/') && p.length > pName.length) {
                        pName = p;
                    }
                }
                self.packageInfo = packages[pName] || Config.corePackage;
            }
            return self.packageInfo;
        },

        /**
         * Get the tag of current module.
         * tag can not contain ".", eg: Math.random() !
         * @return {String}
         */
        getTag: function () {
            var self = this;
            return self.tag || self.getPackage().getTag();
        },

        /**
         * Get the charset of current module
         * @return {String}
         */
        getCharset: function () {
            var self = this;
            return self.charset || self.getPackage().getCharset();
        },

        /**
         * get alias required module names
         * @returns {String[]} alias required module names
         */
        getRequiresWithAlias: function () {
            var self = this,
                requiresWithAlias = self.requiresWithAlias,
                requires = self.requires;
            if (!requires || requires.length === 0) {
                return requires || [];
            } else if (!requiresWithAlias) {
                self.requiresWithAlias = requiresWithAlias =
                    Utils.normalizeModNamesWithAlias(requires, self.name);
            }
            return requiresWithAlias;
        },

        /**
         * Get module objects required by this module
         * @return {KISSY.Loader.Module[]}
         */
        getRequiredMods: function () {
            return Utils.createModulesInfo(this.getNormalizedRequires());
        },

        /**
         * Get module names required by this module
         * @return {String[]}
         */
        getNormalizedRequires: function () {
            var self = this,
                normalizedRequires,
                normalizedRequiresStatus = self.normalizedRequiresStatus,
                status = self.status,
                requires = self.requires;
            if (!requires || requires.length === 0) {
                return requires || [];
            } else if ((normalizedRequires = self.normalizedRequires) &&
                // 事先声明的依赖不能当做 loaded 状态下真正的依赖
                (normalizedRequiresStatus === status)) {
                return normalizedRequires;
            } else {
                self.normalizedRequiresStatus = status;
                self.normalizedRequires = Utils.normalizeModNames(requires, self.name);
                return self.normalizedRequires;
            }
        }
    };

    Loader.Module = Module;
})(KISSY);/**
 * @ignore
 * script/css load across browser
 * @author yiminghe@gmail.com
 */
(function (S) {
    var   logger = S.getLogger('s/loader/getScript');

    var CSS_POLL_INTERVAL = 30,
        Utils = S.Loader.Utils,
    // central poll for link node
        timer = 0,
    // node.id:{callback:callback,node:node}
        monitors = {};

    function startCssTimer() {
        if (!timer) {
            logger.debug('start css poll timer');
            cssPoll();
        }
    }

    function isCssLoaded(node, url) {
        var loaded = 0;
        if (Utils.webkit) {
            // http://www.w3.org/TR/Dom-Level-2-Style/stylesheets.html
            if (node.sheet) {
                logger.debug('webkit css poll loaded: ' + url);
                loaded = 1;
            }
        } else if (node.sheet) {
            try {
                var cssRules = node.sheet.cssRules;
                if (cssRules) {
                    logger.debug('same domain css poll loaded: ' + url);
                    loaded = 1;
                }
            } catch (ex) {
                var exName = ex.name;
                logger.debug('css poll exception: ' + exName + ' ' + ex.code + ' ' + url);
                // http://www.w3.org/TR/dom/#dom-domexception-code
                if (// exName == 'SecurityError' ||
                // for old firefox
                    exName === 'NS_ERROR_DOM_SECURITY_ERR') {
                    logger.debug('css poll exception: ' + exName + 'loaded : ' + url);
                    loaded = 1;
                }
            }
        }
        return loaded;
    }

    // single thread is ok
    function cssPoll() {
        for (var url in monitors) {
            var callbackObj = monitors[url],
                node = callbackObj.node;
            if (isCssLoaded(node, url)) {
                if (callbackObj.callback) {
                    callbackObj.callback.call(node);
                }
                delete monitors[url];
            }
        }

        if (Utils.isEmptyObject(monitors)) {
            logger.debug('clear css poll timer');
            timer = 0;
        } else {
            timer = setTimeout(cssPoll, CSS_POLL_INTERVAL);
        }
    }

    // refer : http://lifesinger.org/lab/2011/load-js-css/css-preload.html
    // 暂时不考虑如何判断失败，如 404 等
    Utils.pollCss = function (node, callback) {
        var href = node.href,
            arr;
        arr = monitors[href] = {};
        arr.node = node;
        arr.callback = callback;
        startCssTimer();
    };

    Utils.isCssLoaded = isCssLoaded;
})(KISSY);
/*
 References:
 - http://unixpapa.com/js/dyna.html
 - http://www.blaze.io/technical/ies-premature-execution-problem/

 `onload` event is supported in WebKit since 535.23
 - https://bugs.webkit.org/show_activity.cgi?id=38995
 `onload/onerror` event is supported since Firefox 9.0
 - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
 - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events

 monitor css onload across browsers.issue about 404 failure.
 - firefox not ok（4 is wrong）：
 - http://yearofmoo.com/2011/03/cross-browser-stylesheet-preloading/
 - all is ok
 - http://lifesinger.org/lab/2011/load-js-css/css-preload.html
 - others
 - http://www.zachleat.com/web/load-css-dynamically/
 *//**
 * @ignore
 * getScript support for css and js callback after load
 * @author yiminghe@gmail.com
 */
(function (S) {
    var MILLISECONDS_OF_SECOND = 1000,
        doc = S.Env.host.document,
        Utils = S.Loader.Utils,
    // solve concurrent requesting same script file
        jsCssCallbacks = {},
        webkit = Utils.webkit,
        headNode;

    /**
     * Load a javascript/css file from the server using a GET HTTP request,
     * then execute it.
     *
     * for example:
     *      @example
     *      getScript(url, success, charset);
     *      // or
     *      getScript(url, {
     *          charset: string
     *          success: fn,
     *          error: fn,
     *          timeout: number
     *      });
     *
     * Note 404/500 status in ie<9 will trigger success callback.
     * If you want a jsonp operation, please use {@link KISSY.IO} instead.
     *
     * @param {String} url resource's url
     * @param {Function|Object} [success] success callback or config
     * @param {Function} [success.success] success callback
     * @param {Function} [success.error] error callback
     * @param {Number} [success.timeout] timeout (s)
     * @param {String} [success.charset] charset of current resource
     * @param {String} [charset] charset of current resource
     * @return {HTMLElement} script/style node
     * @member KISSY
     */
    S.getScript = function (url, success, charset) {
        // can not use KISSY.Uri, url can not be encoded for some url
        // eg: /??dom.js,event.js , ? , should not be encoded
        var config = success,
            css = Utils.endsWith(url, '.css'),
            error,
            timeout,
            attrs,
            callbacks,
            timer;

        if (typeof config === 'object') {
            success = config.success;
            error = config.error;
            timeout = config.timeout;
            charset = config.charset;
            attrs = config.attrs;
        }

        callbacks = jsCssCallbacks[url] = jsCssCallbacks[url] || [];

        callbacks.push([success, error]);

        if (callbacks.length > 1) {
            return callbacks.node;
        }

        var node = doc.createElement(css ? 'link' : 'script'),
            clearTimer = function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
            };

        if (attrs) {
            Utils.each(attrs, function (v, n) {
                node.setAttribute(n, v);
            });
        }

        if (charset) {
            node.charset = charset;
        }

        if (css) {
            node.href = url;
            node.rel = 'stylesheet';
        } else {
            node.src = url;
            node.async = true;
        }

        callbacks.node = node;

        var end = function (error) {
            var index = error,
                fn;
            clearTimer();
            Utils.each(jsCssCallbacks[url], function (callback) {
                if ((fn = callback[index])) {
                    fn.call(node);
                }
            });
            delete jsCssCallbacks[url];
        };

        var useNative = 'onload' in node;
        // onload for webkit 535.23  Firefox 9.0
        // https://bugs.webkit.org/show_activity.cgi?id=38995
        // https://bugzilla.mozilla.org/show_bug.cgi?id=185236
        // https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
        // phantomjs 1.7 == webkit 534.34
        var forceCssPoll = S.Config.forceCssPoll || (webkit && webkit < 536);

        if (css && forceCssPoll && useNative) {
            useNative = false;
        }

        function onload() {
            var readyState = node.readyState;
            if (!readyState ||
                readyState === 'loaded' ||
                readyState === 'complete') {
                node.onreadystatechange = node.onload = null;
                end(0);
            }
        }

        //标准浏览器 css and all script
        if (useNative) {
            node.onload = onload;
            node.onerror = function () {
                node.onerror = null;
                end(1);
            };
        } else if (css) {
            // old chrome/firefox for css
            Utils.pollCss(node, function () {
                end(0);
            });
        } else {
            node.onreadystatechange = onload;
        }

        if (timeout) {
            timer = setTimeout(function () {
                end(1);
            }, timeout * MILLISECONDS_OF_SECOND);
        }
        if (!headNode) {
            headNode = Utils.docHead();
        }
        if (css) {
            // css order matters
            // so can not use css in head
            headNode.appendChild(node);
        } else {
            // can use js in head
            headNode.insertBefore(node, headNode.firstChild);
        }
        return node;
    };
})(KISSY);
/*
 yiminghe@gmail.com refactor@2012-03-29
 - 考虑连续重复请求单个 script 的情况，内部排队

 yiminghe@gmail.com 2012-03-13
 - getScript
 - 404 in ie<9 trigger success , others trigger error
 - syntax error in all trigger success
 *//**
 * @ignore
 * Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Package = Loader.Package,
        Utils = Loader.Utils,
        host = S.Env.host,
        Config = S.Config,
        location = host.location,
        locationPath = '',
        configFns = Config.fns;

    if (location) {
        locationPath = location.protocol + '//' + location.host + location.pathname;
    }

    // how to load mods by path
    Config.loadModsFn = function (rs, config) {
        S.getScript(rs.url, config);
    };

    // how to get mod url
    Config.resolveModFn = function (mod) {
        var name = mod.name,
            min = '-min',
            t, url, subPath;
        var packageInfo = mod.getPackage();
        var packageBase = packageInfo.getBase();
        var packageName = packageInfo.getName();
        var extname = '.' + mod.getType();
        // special for css module
        name = name.replace(/\.css$/, '');
        if (packageInfo.isDebug()) {
            min = '';
        }

        // packageName: a/y use('a/y');
        if (name === packageName) {
            url = packageBase.substring(0, packageBase.length - 1) + min + extname;
        } else {
            subPath = name + min + extname;
            if (packageName) {
                subPath = subPath.substring(packageName.length + 1);
            }
            url = packageBase + subPath;
        }

        if ((t = mod.getTag())) {
            t += '.' + mod.getType();
            url += '?t=' + t;
        }
        return url;
    };

    configFns.core = function (cfg) {
        var base = cfg.base;
        var corePackage = Config.corePackage;
        if (base) {
            cfg.base = normalizePath(base, true);
        }
        if (!corePackage) {
            corePackage = Config.corePackage = new Package({
                name: ''
            });
        }
        corePackage.reset(cfg);
    };

    configFns.requires = shortcut('requires');

    configFns.alias = shortcut('alias');

    configFns.packages = function (config) {
        var Config = this.Config,
            ps = Config.packages = Config.packages || {};
        if (config) {
            Utils.each(config, function (cfg, key) {
                // object type
                var name = cfg.name = cfg.name || key;
                var base = cfg.base || cfg.path;
                if (base) {
                    cfg.base = normalizePath(base, true);
                }
                if (ps[name]) {
                    ps[name].reset(cfg);
                } else {
                    ps[name] = new Package(cfg);
                }
            });
            return undefined;
        } else if (config === false) {
            Config.packages = {};
            return undefined;
        } else {
            return ps;
        }
    };

    configFns.modules = function (modules) {
        if (modules) {
            Utils.each(modules, function (modCfg, modName) {
                var url = modCfg.url;
                if (url) {
                    modCfg.url = normalizePath(url);
                }
                var mod = Utils.createModuleInfo(modName, modCfg);
                // #485, invalid after add
                if (mod.status === Loader.Status.INIT) {
                    Utils.mix(mod, modCfg);
                }
            });
        }
    };

    configFns.base = function (base) {
        var self = this,
            corePackage = Config.corePackage;

        if (!base) {
            return corePackage && corePackage.getBase();
        }

        self.config('core', {
            base: base
        });

        return undefined;
    };

    function shortcut(attr) {
        return function (config) {
            var newCfg = {};
            for (var name in config) {
                newCfg[name] = {};
                newCfg[name][attr] = config[name];
            }
            S.config('modules', newCfg);
        };
    }

    function normalizePath(base, isDirectory) {
        if (base.indexOf('\\') !== -1) {
            base = base.replace(/\\/g, '/');
        }
        if (isDirectory && base.charAt(base.length - 1) !== '/') {
            base += '/';
        }
        if (locationPath) {
            if (base.charAt(0) === '/') {
                base = location.protocol + '//' + location.host + base;
            } else {
                base = Utils.normalizePath(locationPath, base);
            }
        }
        return base;
    }
})(KISSY);
/**
 * combo loader for KISSY. using combo to load module files.
 * @ignore
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {
    var logger = S.getLogger('s/loader');

    // ie11 is a new one!
    var Loader = S.Loader,
        Config = S.Config,
        Status = Loader.Status,
        Utils = Loader.Utils,
        each = Utils.each,
        getHash = Utils.getHash,
        LOADING = Status.LOADING,
        LOADED = Status.LOADED,
        ERROR = Status.ERROR,
        oldIE = Utils.ie < 10;

    function loadScripts(rss, callback, timeout) {
        var count = rss && rss.length,
            errorList = [],
            successList = [];

        function complete() {
            if (!(--count)) {
                callback(successList, errorList);
            }
        }

        each(rss, function (rs) {
            var mod;
            var config = {
                timeout: timeout,
                success: function () {
                    successList.push(rs);
                    if (mod && currentMod) {
                        // standard browser(except ie9) fire load after KISSY.add immediately
                        logger.debug('standard browser get mod name after load: ' + mod.name);
                        Utils.registerModule(mod.name, currentMod.factory, currentMod.config);
                        currentMod = undefined;
                    }
                    complete();
                },
                error: function () {
                    errorList.push(rs);
                    complete();
                },
                charset: rs.charset
            };
            if (!rs.combine) {
                mod = rs.mods[0];
                if (mod.getType() === 'css') {
                    mod = undefined;
                } else if (oldIE) {
                    startLoadModName = mod.name;
                    if ('@DEBUG@') {
                        startLoadModTime = +new Date();
                    }
                    config.attrs = {
                        'data-mod-name': mod.name
                    };
                }
            }
            Config.loadModsFn(rs, config);
        });
    }

    var loaderId = 0;

    /**
     * @class KISSY.Loader.ComboLoader
     * using combo to load module files
     * @param callback
     * @private
     */
    function ComboLoader(callback) {
        this.callback = callback;
        this.head = this.tail = undefined;
        this.id = 'loader' + (++loaderId);
    }

    var currentMod;
    var startLoadModName;
    var startLoadModTime;

    function checkKISSYRequire(config, factory) {
        // use require primitive statement
        // function(S, require){ require('node') }
        if (!config && typeof factory === 'function' && factory.length > 1) {
            var requires = Utils.getRequiresFromFn(factory);
            if (requires.length) {
                config = config || {};
                config.requires = requires;
            }
        } else {
            // KISSY.add(function(){},{requires:[]})
            if (config && config.requires && !config.cjs) {
                config.cjs = 0;
            }
        }
        return config;
    }

    ComboLoader.add = function (name, factory, config, argsLen) {
        // KISSY.add('xx',[],function(){});
        if (argsLen === 3 && Utils.isArray(factory)) {
            var tmp = factory;
            factory = config;
            config = {
                requires: tmp,
                cjs: 1
            };
        }
        // KISSY.add(function(){}), KISSY.add('a'), KISSY.add(function(){},{requires:[]})
        if (typeof name === 'function' || argsLen === 1) {
            config = factory;
            factory = name;
            config = checkKISSYRequire(config, factory);
            if (oldIE) {
                // http://groups.google.com/group/commonjs/browse_thread/thread/5a3358ece35e688e/43145ceccfb1dc02#43145ceccfb1dc02
                name = findModuleNameByInteractive();
                // S.log('oldIE get modName by interactive: ' + name);
                Utils.registerModule(name, factory, config);
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                // 其他浏览器 onload 时，关联模块名与模块定义
                currentMod = {
                    factory: factory,
                    config: config
                };
            }
        } else {
            // KISSY.add('x',function(){},{requires:[]})
            if (oldIE) {
                startLoadModName = null;
                startLoadModTime = 0;
            } else {
                currentMod = undefined;
            }
            config = checkKISSYRequire(config, factory);
            Utils.registerModule(name, factory, config);
        }
    };

    // oldIE 特有，找到当前正在交互的脚本，根据脚本名确定模块名
    // 如果找不到，返回发送前那个脚本
    function findModuleNameByInteractive() {
        var scripts = document.getElementsByTagName('script'),
            re,
            i,
            name,
            script;

        for (i = scripts.length - 1; i >= 0; i--) {
            script = scripts[i];
            if (script.readyState === 'interactive') {
                re = script;
                break;
            }
        }

        if (re) {
            name = re.getAttribute('data-mod-name');
        } else {
            // sometimes when read module file from cache,
            // interactive status is not triggered
            // module code is executed right after inserting into dom
            // i has to preserve module name before insert module script into dom,
            // then get it back here
            logger.debug('can not find interactive script,time diff : ' + (+new Date() - startLoadModTime));
            logger.debug('old_ie get mod name from cache : ' + startLoadModName);
            name = startLoadModName;
        }
        return name;
    }

    var debugRemoteModules;

    if ('@DEBUG@') {
        debugRemoteModules = function (rss) {
            each(rss, function (rs) {
                var ms = [];
                each(rs.mods, function (m) {
                    if (m.status === LOADED) {
                        ms.push(m.name);
                    }
                });
                if (ms.length) {
                    logger.info('load remote modules: "' + ms.join(', ') + '" from: "' + rs.url + '"');
                }
            });
        };
    }

    function getCommonPrefix(str1, str2) {
        // ie bug
        // 'a//b'.split(/\//) => [a,b]
        var prefix = str1.substring(0, str1.indexOf('//') + 2);
        str1 = str1.substring(prefix.length).split(/\//);
        str2 = str2.substring(prefix.length).split(/\//);
        var l = Math.min(str1.length, str2.length);
        for (var i = 0; i < l; i++) {
            if (str1[i] !== str2[i]) {
                break;
            }
        }
        return prefix + str1.slice(0, i).join('/') + '/';
    }

    Utils.mix(ComboLoader.prototype, {
        /**
         * load modules asynchronously
         */
        use: function (allMods) {
            var self = this,
                comboUrls,
                timeout = Config.timeout;

            comboUrls = self.getComboUrls(allMods);

            // load css first to avoid page blink
            if (comboUrls.css) {
                loadScripts(comboUrls.css, function (success, error) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    each(success, function (one) {
                        each(one.mods, function (mod) {
                            Utils.registerModule(mod.name, Utils.noop);
                            // notify all loader instance
                            mod.flush();
                        });
                    });

                    each(error, function (one) {
                        each(one.mods, function (mod) {
                            var msg = mod.name + ' is not loaded! can not find module in url : ' + one.url;
                            S.log(msg, 'error');
                            mod.status = ERROR;
                            // notify all loader instance
                            mod.flush();
                        });
                    });
                }, timeout);
            }

            // jss css download in parallel
            if (comboUrls.js) {
                loadScripts(comboUrls.js, function (success) {
                    if ('@DEBUG@') {
                        debugRemoteModules(success);
                    }

                    each(comboUrls.js, function (one) {
                        each(one.mods, function (mod) {
                            // fix #111
                            // https://github.com/kissyteam/kissy/issues/111
                            if (!mod.factory) {
                                var msg = mod.name +
                                    ' is not loaded! can not find module in url : ' +
                                    one.url;
                                S.log(msg, 'error');
                                mod.status = ERROR;
                            }
                            // notify all loader instance
                            mod.flush();
                        });
                    });
                }, timeout);
            }
        },

        /**
         * calculate dependency
         */
        calculate: function (modNames, errorList, stack, cache, ret) {
            if (!modNames.length) {
                return [];
            }

            var i, m, mod, modStatus,
                stackDepth,
                self = this;
            if ('@DEBUG@') {
                stack = stack || [];
            }
            ret = ret || [];
            // 提高性能，不用每个模块都再次全部依赖计算
            // 做个缓存，每个模块对应的待动态加载模块
            cache = cache || {};
            if ('@DEBUG@') {
                stackDepth = stack.length;
            }
            for (i = 0; i < modNames.length; i++) {
                m = modNames[i];
                if (cache[m]) {
                    continue;
                }
                mod = Utils.createModuleInfo(m);
                modStatus = mod.status;
                if (modStatus === Status.ERROR) {
                    errorList.push(mod);
                    cache[m] = 1;
                    continue;
                }
                if (modStatus > LOADED) {
                    cache[m] = 1;
                    continue;
                } else if (modStatus !== LOADED && !mod.contains(self)) {
                    if (modStatus !== LOADING) {
                        mod.status = LOADING;
                        ret.push(mod);
                    }
                    mod.add(self);
                    self.wait(mod);
                }

                if ('@DEBUG@' && stack.indexOf) {
                    if (stack.indexOf(m) !== -1) {
                        S.log('find cyclic dependency between mods: ' + stack, 'warn');
                        cache[m] = 1;
                        continue;
                    } else {
                        stack.push(m);
                    }
                }

                self.calculate(mod.getNormalizedRequires(), errorList, stack, cache, ret);
                cache[m] = 1;
            }

            if ('@DEBUG@') {
                stack.length = stackDepth;
            }

            return ret;
        },

        /**
         * get combo mods for modNames
         */
        getComboMods: function (mods) {
            var i, l = mods.length,
                tmpMods, mod, packageInfo, type,
                tag, charset, packageBase,
                packageName, group, modUrl;
            var groups = {
                /*
                 js: {
                 'groupA-gbk':{
                 'http://x.com':[m1,m2]
                 }
                 }
                 */
            };
            var normals = {
                /*
                 js:{
                 'http://x.com':[m1,m2]
                 }
                 */
            };
            for (i = 0; i < l; ++i) {
                mod = mods[i];
                type = mod.getType();
                modUrl = mod.getUrl();
                packageInfo = mod.getPackage();
                packageBase = packageInfo.getBase();
                packageName = packageInfo.name;
                charset = packageInfo.getCharset();
                tag = packageInfo.getTag();
                group = packageInfo.getGroup();

                if (packageInfo.isCombine() && group) {
                    var typeGroups = groups[type] || (groups[type] = {});
                    group = group + '-' + charset;
                    var typeGroup = typeGroups[group] || (typeGroups[group] = {});
                    var find = 0;
                    /*jshint loopfunc:true*/
                    Utils.each(typeGroup, function (tmpMods, prefix) {
                        if (Utils.isSameOriginAs(prefix, packageBase)) {
                            var newPrefix = getCommonPrefix(prefix, packageBase);
                            tmpMods.push(mod);
                            if (tag && tag !== tmpMods.tag) {
                                tmpMods.tag = getHash(tmpMods.tag + tag);
                            }
                            delete typeGroup[prefix];
                            typeGroup[newPrefix] = tmpMods;
                            find = 1;
                        }
                    });
                    if (!find) {
                        tmpMods = typeGroup[packageBase] = [mod];
                        tmpMods.charset = charset;
                        tmpMods.tag = tag || '';
                    }
                } else {
                    var normalTypes = normals[type] || (normals[type] = {});
                    if (!(tmpMods = normalTypes[packageBase])) {
                        tmpMods = normalTypes[packageBase] = [];
                        tmpMods.charset = charset;
                        tmpMods.tag = tag || '';
                    } else {
                        if (tag && tag !== tmpMods.tag) {
                            tmpMods.tag = getHash(tmpMods.tag + tag);
                        }
                    }
                    tmpMods.push(mod);
                }

            }

            return {
                groups: groups,
                normals: normals
            };
        },

        /**
         * Get combo urls
         */
        getComboUrls: function (mods) {
            var comboPrefix = Config.comboPrefix,
                comboSep = Config.comboSep,
                maxFileNum = Config.comboMaxFileNum,
                maxUrlLength = Config.comboMaxUrlLength;

            var comboMods = this.getComboMods(mods);

            var comboRes = {};

            function processSamePrefixUrlMods(type, basePrefix, sendMods) {
                var currentComboUrls = [];
                var currentComboMods = [];
                var tag = sendMods.tag;
                var charset = sendMods.charset;
                var suffix = (tag ? '?t=' + encodeURIComponent(tag) + '.' + type : ''),
                    suffixLength = suffix.length;

                var baseLen = basePrefix.length,
                    prefix = basePrefix + comboPrefix,
                    res = [];

                var l = prefix.length;

                /*jshint loopfunc:true*/
                var pushComboUrl = function () {
                    //noinspection JSReferencingMutableVariableFromClosure
                    res.push({
                        combine: 1,
                        url: prefix + currentComboUrls.join(comboSep) + suffix,
                        charset: charset,
                        mods: currentComboMods
                    });
                };

                for (var i = 0; i < sendMods.length; i++) {
                    var currentMod = sendMods[i];
                    var url = currentMod.getUrl();
                    if (!currentMod.getPackage().isCombine() ||
                        // use(x/y) packageName: x/y ...
                        !Utils.startsWith(url, basePrefix)) {
                        res.push({
                            combine: 0,
                            url: url,
                            charset: charset,
                            mods: [currentMod]
                        });
                        continue;
                    }
                    // ignore query parameter
                    var subPath = url.slice(baseLen).replace(/\?.*$/, '');
                    currentComboUrls.push(subPath);
                    currentComboMods.push(currentMod);

                    if (currentComboUrls.length > maxFileNum ||
                        (l + currentComboUrls.join(comboSep).length + suffixLength > maxUrlLength)) {
                        currentComboUrls.pop();
                        currentComboMods.pop();
                        pushComboUrl();
                        currentComboUrls = [];
                        currentComboMods = [];
                        i--;
                    }
                }
                if (currentComboUrls.length) {
                    pushComboUrl();
                }

                comboRes[type].push.apply(comboRes[type], res);
            }

            var type, prefix;
            var normals = comboMods.normals;
            var groups = comboMods.groups;
            var group;

            // generate combo urls
            for (type in normals) {
                comboRes[type] = comboRes[type] || [];
                for (prefix in normals[type]) {
                    processSamePrefixUrlMods(type, prefix, normals[type][prefix]);
                }
            }
            for (type in groups) {
                comboRes[type] = comboRes[type] || [];
                for (group in groups[type]) {
                    for (prefix in groups[type][group]) {
                        processSamePrefixUrlMods(type, prefix, groups[type][group][prefix]);
                    }
                }
            }
            return comboRes;
        },

        flush: function () {
            if (!this.callback) {
                return;
            }
            var self = this,
                head = self.head,
                callback = self.callback;
            while (head) {
                var node = head.node,
                    status = node.status;
                if (status >= Status.LOADED || status === Status.ERROR) {
                    node.remove(self);
                    head = self.head = head.next;
                } else {
                    return;
                }
            }
            self.callback = null;
            callback();
        },

        isCompleteLoading: function () {
            return !this.head;
        },

        wait: function (mod) {
            var self = this;
            if (!self.head) {
                self.tail = self.head = {
                    node: mod
                };
            } else {
                var newNode = {
                    node: mod
                };
                self.tail.next = newNode;
                self.tail = newNode;
            }
        }
    });

    Loader.ComboLoader = ComboLoader;
})(KISSY);
/*
 2014-03-24 yiminghe@gmail.com
 - refactor group combo logic

 2014-01-14 yiminghe@gmail.com
 - support System.ondemand from es6

 2013-09-11 yiminghe@gmail.com
 - unify simple loader and combo loader

 2013-07-25 阿古, yiminghe@gmail.com
 - support group combo for packages

 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback

 2012-02-20 yiminghe@gmail.com
 - three status
 0: initialized
 LOADED: load into page
 ATTACHED: factory executed
 *//**
 * @ignore
 * mix loader into KISSY and infer KISSY baseUrl if not set
 * @author yiminghe@gmail.com
 */
(function (S) {
    var logger = S.getLogger('s/loader');
    var Loader = S.Loader,
        Env = S.Env,
        mods = Env.mods = {},
        Utils = Loader.Utils,
        ComboLoader = Loader.ComboLoader;

    Utils.mix(S, {
        /**
         * Registers a module with the KISSY global.
         * @param {String} name module name.
         * it must be set if combine is true in {@link KISSY#config}
         * @param {Function} factory module definition function that is used to return
         * exports of this module
         * @param {KISSY} factory.S KISSY global instance
         * @param {Object} [cfg] module optional config data
         * @param {String[]} cfg.requires this module's required module name list
         * @member KISSY
         *
         *
         *      // dom module's definition
         *      KISSY.add('dom', function(S, xx){
         *          return {css: function(el, name, val){}};
         *      },{
         *          requires:['xx']
         *      });
         */
        add: function (name, factory, cfg) {
            ComboLoader.add(name, factory, cfg, arguments.length);
        },
        /**
         * Attached one or more modules to global KISSY instance.
         * @param {String|String[]} modNames moduleNames. 1-n modules to bind(use comma to separate)
         * @param {Function} success callback function executed
         * when KISSY has the required functionality.
         * @param {KISSY} success.S KISSY instance
         * @param success.x... modules exports
         * @member KISSY
         *
         *
         *      // loads and attached overlay,dd and its dependencies
         *      KISSY.use('overlay,dd', function(S, Overlay){});
         */
        use: function (modNames, success) {
            var normalizedModNames,
                loader,
                error,
                tryCount = 0;

            if (typeof success === 'object') {
                //noinspection JSUnresolvedVariable
                error = success.error;
                //noinspection JSUnresolvedVariable
                success = success.success;
            }

            modNames = Utils.getModNamesAsArray(modNames);
            modNames = Utils.normalizeModNamesWithAlias(modNames);

            normalizedModNames = Utils.unalias(modNames);

            var unloadedModNames = normalizedModNames;

            function loadReady() {
                ++tryCount;
                var errorList = [],
                    start;

                if ('@DEBUG@') {
                    start = +new Date();
                }

                var unloadedMods = loader.calculate(unloadedModNames, errorList);
                var unloadModsLen = unloadedMods.length;
                logger.debug(tryCount + ' check duration ' + (+new Date() - start));
                if (errorList.length) {
                    if (error) {
                        try {
                            error.apply(S, errorList);
                        } catch (e) {
                            S.log(e.stack || e, 'error');
                            /*jshint loopfunc:true*/
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                    S.log(errorList, 'error');
                    S.log('loader: load above modules error', 'error');
                } else if (loader.isCompleteLoading()) {
                    Utils.attachModsRecursively(normalizedModNames);
                    if (success) {
                        try {
                            success.apply(S, Utils.getModules(modNames));
                        } catch (e) {
                            S.log(e.stack || e, 'error');
                            /*jshint loopfunc:true*/
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                } else {
                    // in case all of its required mods is loading by other loaders
                    loader.callback = loadReady;
                    if (unloadModsLen) {
                        logger.debug(tryCount + ' reload ');
                        unloadedModNames = [];
                        for (var i = 0; i < unloadModsLen; i++) {
                            unloadedModNames.push(unloadedMods[i].name);
                        }
                        loader.use(unloadedMods);
                    }
                }
            }

            loader = new ComboLoader(loadReady);

            // in case modules is loaded statically
            // synchronous check
            // but always async for loader
            loadReady();
            return S;
        },

        /**
         * get module exports from KISSY module cache
         * @param {String} moduleName module name
         * @param {String} refName internal usage
         * @member KISSY
         * @return {*} exports of specified module
         */
        require: function (moduleName, refName) {
            moduleName = Utils.normalizePath(refName, moduleName);
            // cache module read
            if (mods[moduleName] && mods[moduleName].status === Loader.Status.ATTACHED) {
                return mods[moduleName].exports;
            }
            var moduleNames = Utils.normalizeModNames([moduleName], refName);
            Utils.attachModsRecursively(moduleNames);
            return Utils.getModules(moduleNames)[1];
        }
    });
})(KISSY);

/*
 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback
 *//**
 * @ignore
 * i18n plugin for kissy loader
 * @author yiminghe@gmail.com
 */
KISSY.add('i18n', {
    alias: function (S, name) {
        return name + '/i18n/' + S.Config.lang;
    }
});/**
 * @ignore
 * init loader, set config
 * @author yiminghe@gmail.com
 */
(function (S) {
    var doc = S.Env.host && S.Env.host.document;
    // var logger = S.getLogger('s/loader');
    var Utils = S.Loader.Utils;
    var TIMESTAMP = '20140403190159';
    var defaultComboPrefix = '??';
    var defaultComboSep = ',';

    function returnJson(s) {
        /*jshint evil:true*/
        return (new Function('return ' + s))();
    }

    var baseReg = /^(.*)(seed|loader)(?:-min)?\.js[^/]*/i,
        baseTestReg = /(seed|loader)(?:-min)?\.js/i;

    function getBaseInfoFromOneScript(script) {
        // can not use KISSY.Uri
        // /??x.js,dom.js for tbcdn
        var src = script.src || '';
        if (!src.match(baseTestReg)) {
            return 0;
        }

        var baseInfo = script.getAttribute('data-config');

        if (baseInfo) {
            baseInfo = returnJson(baseInfo);
        } else {
            baseInfo = {};
        }

        var comboPrefix = baseInfo.comboPrefix || defaultComboPrefix;
        var comboSep = baseInfo.comboSep || defaultComboSep;

        var parts,
            base,
            index = src.indexOf(comboPrefix);

        // no combo
        if (index === -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = src.substring(0, index);
            // a.tbcdn.cn??y.js, ie does not insert / after host
            // a.tbcdn.cn/combo? comboPrefix=/combo?
            if (base.charAt(base.length - 1) !== '/') {
                base += '/';
            }
            parts = src.substring(index + comboPrefix.length).split(comboSep);
            Utils.each(parts, function (part) {
                if (part.match(baseTestReg)) {
                    base += part.replace(baseReg, '$1');
                    return false;
                }
                return undefined;
            });
        }

        if (!('tag' in baseInfo)) {
            var queryIndex = src.lastIndexOf('?t=');
            if (queryIndex !== -1) {
                var query = src.substring(queryIndex + 1);
                // kissy 's tag will be determined by build time and user specified tag
                baseInfo.tag = Utils.getHash(TIMESTAMP + query);
            }
        }

        baseInfo.base = baseInfo.base || base;

        return baseInfo;
    }

    /**
     * get base from seed.js
     * @return {Object} base for kissy
     * @ignore
     *
     * for example:
     *      @example
     *      http://a.tbcdn.cn/??s/kissy/x.y.z/seed-min.js,p/global/global.js
     *      note about custom combo rules, such as yui3:
     *      combo-prefix='combo?' combo-sep='&'
     */
    function getBaseInfo() {
        // get base from current script file path
        // notice: timestamp
        var scripts = doc.getElementsByTagName('script'),
            i,
            info;

        for (i = scripts.length - 1; i >= 0; i--) {
            if ((info = getBaseInfoFromOneScript(scripts[i]))) {
                return info;
            }
        }

        var msg = 'must load kissy by file name in browser environment: ' +
            'seed.js or seed-min.js loader.js or loader-min.js';

        S.log(msg, 'error');
        return null;
    }

    S.config({
        comboPrefix: defaultComboPrefix,
        comboSep: defaultComboSep,
        charset: 'utf-8',
        lang: 'zh-cn'
    });
    // ejecta
    if (doc && doc.getElementsByTagName) {
        // will transform base to absolute path
        S.config(Utils.mix({
            // 2k(2048) url length
            comboMaxUrlLength: 2000,
            // file limit number for a single combo url
            comboMaxFileNum: 40
        }, getBaseInfo()));
    }
})(KISSY);
/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Apr 3 19:02
*/
/*
 Combined modules by KISSY Module Compiler: 

 util/array
 util/escape
 util/function
 util/object
 util/string
 util/type
 util/web
 util
*/

KISSY.add("util/array", [], function(S, undefined) {
  var TRUE = true, AP = Array.prototype, indexOf = AP.indexOf, lastIndexOf = AP.lastIndexOf, filter = AP.filter, every = AP.every, some = AP.some, map = AP.map, FALSE = false;
  S.mix(S, {indexOf:indexOf ? function(item, arr, fromIndex) {
    return fromIndex === undefined ? indexOf.call(arr, item) : indexOf.call(arr, item, fromIndex)
  } : function(item, arr, fromIndex) {
    for(var i = fromIndex || 0, len = arr.length;i < len;++i) {
      if(arr[i] === item) {
        return i
      }
    }
    return-1
  }, lastIndexOf:lastIndexOf ? function(item, arr, fromIndex) {
    return fromIndex === undefined ? lastIndexOf.call(arr, item) : lastIndexOf.call(arr, item, fromIndex)
  } : function(item, arr, fromIndex) {
    if(fromIndex === undefined) {
      fromIndex = arr.length - 1
    }
    for(var i = fromIndex;i >= 0;i--) {
      if(arr[i] === item) {
        break
      }
    }
    return i
  }, unique:function(a, override) {
    var b = a.slice();
    if(override) {
      b.reverse()
    }
    var i = 0, n, item;
    while(i < b.length) {
      item = b[i];
      while((n = S.lastIndexOf(item, b)) !== i) {
        b.splice(n, 1)
      }
      i += 1
    }
    if(override) {
      b.reverse()
    }
    return b
  }, inArray:function(item, arr) {
    return S.indexOf(item, arr) > -1
  }, filter:filter ? function(arr, fn, context) {
    return filter.call(arr, fn, context || this)
  } : function(arr, fn, context) {
    var ret = [];
    S.each(arr, function(item, i, arr) {
      if(fn.call(context || this, item, i, arr)) {
        ret.push(item)
      }
    });
    return ret
  }, map:map ? function(arr, fn, context) {
    return map.call(arr, fn, context || this)
  } : function(arr, fn, context) {
    var len = arr.length, res = new Array(len);
    for(var i = 0;i < len;i++) {
      var el = typeof arr === "string" ? arr.charAt(i) : arr[i];
      if(el || i in arr) {
        res[i] = fn.call(context || this, el, i, arr)
      }
    }
    return res
  }, reduce:function(arr, callback, initialValue) {
    var len = arr.length;
    if(typeof callback !== "function") {
      throw new TypeError("callback is not function!");
    }
    if(len === 0 && arguments.length === 2) {
      throw new TypeError("arguments invalid");
    }
    var k = 0;
    var accumulator;
    if(arguments.length >= 3) {
      accumulator = initialValue
    }else {
      do {
        if(k in arr) {
          accumulator = arr[k++];
          break
        }
        k += 1;
        if(k >= len) {
          throw new TypeError;
        }
      }while(TRUE)
    }
    while(k < len) {
      if(k in arr) {
        accumulator = callback.call(undefined, accumulator, arr[k], k, arr)
      }
      k++
    }
    return accumulator
  }, every:every ? function(arr, fn, context) {
    return every.call(arr, fn, context || this)
  } : function(arr, fn, context) {
    var len = arr && arr.length || 0;
    for(var i = 0;i < len;i++) {
      if(i in arr && !fn.call(context, arr[i], i, arr)) {
        return FALSE
      }
    }
    return TRUE
  }, some:some ? function(arr, fn, context) {
    return some.call(arr, fn, context || this)
  } : function(arr, fn, context) {
    var len = arr && arr.length || 0;
    for(var i = 0;i < len;i++) {
      if(i in arr && fn.call(context, arr[i], i, arr)) {
        return TRUE
      }
    }
    return FALSE
  }, makeArray:function(o) {
    if(o == null) {
      return[]
    }
    if(S.isArray(o)) {
      return o
    }
    var lengthType = typeof o.length, oType = typeof o;
    if(lengthType !== "number" || typeof o.nodeName === "string" || o != null && o == o.window || oType === "string" || oType === "function" && !("item" in o && lengthType === "number")) {
      return[o]
    }
    var ret = [];
    for(var i = 0, l = o.length;i < l;i++) {
      ret[i] = o[i]
    }
    return ret
  }})
});
KISSY.add("util/escape", [], function(S) {
  var EMPTY = "", htmlEntities = {"&amp;":"&", "&gt;":">", "&lt;":"<", "&#x60;":"`", "&#x2F;":"/", "&quot;":'"', "&#x27;":"'"}, reverseEntities = {}, escapeHtmlReg, unEscapeHtmlReg, possibleEscapeHtmlReg = /[&<>"'`]/, escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
  (function() {
    for(var k in htmlEntities) {
      reverseEntities[htmlEntities[k]] = k
    }
  })();
  escapeHtmlReg = getEscapeReg();
  unEscapeHtmlReg = getUnEscapeReg();
  function getEscapeReg() {
    var str = EMPTY;
    for(var e in htmlEntities) {
      var entity = htmlEntities[e];
      str += entity + "|"
    }
    str = str.slice(0, -1);
    escapeHtmlReg = new RegExp(str, "g");
    return escapeHtmlReg
  }
  function getUnEscapeReg() {
    var str = EMPTY;
    for(var e in reverseEntities) {
      var entity = reverseEntities[e];
      str += entity + "|"
    }
    str += "&#(\\d{1,5});";
    unEscapeHtmlReg = new RegExp(str, "g");
    return unEscapeHtmlReg
  }
  S.mix(S, {escapeHtml:function(str) {
    if(!str && str !== 0) {
      return""
    }
    str = "" + str;
    if(!possibleEscapeHtmlReg.test(str)) {
      return str
    }
    return(str + "").replace(escapeHtmlReg, function(m) {
      return reverseEntities[m]
    })
  }, escapeRegExp:function(str) {
    return str.replace(escapeRegExp, "\\$&")
  }, unEscapeHtml:function(str) {
    return str.replace(unEscapeHtmlReg, function(m, n) {
      return htmlEntities[m] || String.fromCharCode(+n)
    })
  }});
  S.escapeHTML = S.escapeHtml;
  S.unEscapeHTML = S.unEscapeHtml
});
KISSY.add("util/function", [], function(S, undefined) {
  function bindFn(r, fn, obj) {
    function FNOP() {
    }
    var slice = [].slice, args = slice.call(arguments, 3), bound = function() {
      var inArgs = slice.call(arguments);
      return fn.apply(this instanceof FNOP ? this : obj || this, r ? inArgs.concat(args) : args.concat(inArgs))
    };
    FNOP.prototype = fn.prototype;
    bound.prototype = new FNOP;
    return bound
  }
  S.mix(S, {noop:function() {
  }, bind:bindFn(0, bindFn, null, 0), rbind:bindFn(0, bindFn, null, 1), later:function(fn, when, periodic, context, data) {
    when = when || 0;
    var m = fn, d = S.makeArray(data), f, r;
    if(typeof fn === "string") {
      m = context[fn]
    }
    if(!m) {
      S.error("method undefined")
    }
    f = function() {
      m.apply(context, d)
    };
    r = periodic ? setInterval(f, when) : setTimeout(f, when);
    return{id:r, interval:periodic, cancel:function() {
      if(this.interval) {
        clearInterval(r)
      }else {
        clearTimeout(r)
      }
    }}
  }, throttle:function(fn, ms, context) {
    ms = ms || 150;
    if(ms === -1) {
      return function() {
        fn.apply(context || this, arguments)
      }
    }
    var last = S.now();
    return function() {
      var now = S.now();
      if(now - last > ms) {
        last = now;
        fn.apply(context || this, arguments)
      }
    }
  }, buffer:function(fn, ms, context) {
    ms = ms || 150;
    if(ms === -1) {
      return function() {
        fn.apply(context || this, arguments)
      }
    }
    var bufferTimer = null;
    function f() {
      f.stop();
      bufferTimer = S.later(fn, ms, 0, context || this, arguments)
    }
    f.stop = function() {
      if(bufferTimer) {
        bufferTimer.cancel();
        bufferTimer = 0
      }
    };
    return f
  }})
});
KISSY.add("util/object", [], function(S, undefined) {
  var logger = S.getLogger("s/util");
  var MIX_CIRCULAR_DETECTION = "__MIX_CIRCULAR", STAMP_MARKER = "__~ks_stamped", host = S.Env.host, TRUE = true, EMPTY = "", toString = {}.toString, Obj = Object, objectCreate = Obj.create;
  var hasEnumBug = !{toString:1}.propertyIsEnumerable("toString"), enumProperties = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toString", "toLocaleString", "valueOf"];
  mix(S, {keys:Object.keys || function(o) {
    var result = [], p, i;
    for(p in o) {
      if(o.hasOwnProperty(p)) {
        result.push(p)
      }
    }
    if(hasEnumBug) {
      for(i = enumProperties.length - 1;i >= 0;i--) {
        p = enumProperties[i];
        if(o.hasOwnProperty(p)) {
          result.push(p)
        }
      }
    }
    return result
  }, each:function(object, fn, context) {
    if(object) {
      var key, val, keys, i = 0, length = object && object.length, isObj = length === undefined || toString.call(object) === "[object Function]";
      context = context || null;
      if(isObj) {
        keys = S.keys(object);
        for(;i < keys.length;i++) {
          key = keys[i];
          if(fn.call(context, object[key], key, object) === false) {
            break
          }
        }
      }else {
        for(val = object[0];i < length;val = object[++i]) {
          if(fn.call(context, val, i, object) === false) {
            break
          }
        }
      }
    }
    return object
  }, now:Date.now || function() {
    return+new Date
  }, isArray:function(obj) {
    return toString.call(obj) === "[object Array]"
  }, isEmptyObject:function(o) {
    for(var p in o) {
      if(p !== undefined) {
        return false
      }
    }
    return true
  }, stamp:function(o, readOnly, marker) {
    marker = marker || STAMP_MARKER;
    var guid = o[marker];
    if(guid) {
      return guid
    }else {
      if(!readOnly) {
        try {
          guid = o[marker] = S.guid(marker)
        }catch(e) {
          guid = undefined
        }
      }
    }
    return guid
  }, mix:function(r, s, ov, wl, deep) {
    if(typeof ov === "object") {
      wl = ov.whitelist;
      deep = ov.deep;
      ov = ov.overwrite
    }
    if(wl && typeof wl !== "function") {
      var originalWl = wl;
      wl = function(name, val) {
        return S.inArray(name, originalWl) ? val : undefined
      }
    }
    if(ov === undefined) {
      ov = TRUE
    }
    var cache = [], c, i = 0;
    mixInternal(r, s, ov, wl, deep, cache);
    while(c = cache[i++]) {
      delete c[MIX_CIRCULAR_DETECTION]
    }
    return r
  }, merge:function(varArgs) {
    varArgs = S.makeArray(arguments);
    var o = {}, i, l = varArgs.length;
    for(i = 0;i < l;i++) {
      S.mix(o, varArgs[i])
    }
    return o
  }, augment:function(r, varArgs) {
    var args = S.makeArray(arguments), len = args.length - 2, i = 1, proto, arg, ov = args[len], wl = args[len + 1];
    args[1] = varArgs;
    if(!S.isArray(wl)) {
      ov = wl;
      wl = undefined;
      len++
    }
    if(typeof ov !== "boolean") {
      ov = undefined;
      len++
    }
    for(;i < len;i++) {
      arg = args[i];
      if(proto = arg.prototype) {
        arg = S.mix({}, proto, true, removeConstructor)
      }
      S.mix(r.prototype, arg, ov, wl)
    }
    return r
  }, extend:function(r, s, px, sx) {
    if("@DEBUG@") {
      if(!r) {
        logger.error("extend r is null")
      }
      if(!s) {
        logger.error("extend s is null")
      }
      if(!s || !r) {
        return r
      }
    }
    var sp = s.prototype, rp;
    sp.constructor = s;
    rp = createObject(sp, r);
    r.prototype = S.mix(rp, r.prototype);
    r.superclass = sp;
    if(px) {
      S.mix(rp, px)
    }
    if(sx) {
      S.mix(r, sx)
    }
    return r
  }, namespace:function() {
    var args = S.makeArray(arguments), l = args.length, o = null, i, j, p, global = args[l - 1] === TRUE && l--;
    for(i = 0;i < l;i++) {
      p = (EMPTY + args[i]).split(".");
      o = global ? host : this;
      for(j = host[p[0]] === o ? 1 : 0;j < p.length;++j) {
        o = o[p[j]] = o[p[j]] || {}
      }
    }
    return o
  }});
  function Empty() {
  }
  function createObject(proto, constructor) {
    var newProto;
    if(objectCreate) {
      newProto = objectCreate(proto)
    }else {
      Empty.prototype = proto;
      newProto = new Empty
    }
    newProto.constructor = constructor;
    return newProto
  }
  function mix(r, s) {
    for(var i in s) {
      r[i] = s[i]
    }
  }
  function mixInternal(r, s, ov, wl, deep, cache) {
    if(!s || !r) {
      return r
    }
    var i, p, keys, len;
    s[MIX_CIRCULAR_DETECTION] = r;
    cache.push(s);
    keys = S.keys(s);
    len = keys.length;
    for(i = 0;i < len;i++) {
      p = keys[i];
      if(p !== MIX_CIRCULAR_DETECTION) {
        _mix(p, r, s, ov, wl, deep, cache)
      }
    }
    return r
  }
  function removeConstructor(k, v) {
    return k === "constructor" ? undefined : v
  }
  function _mix(p, r, s, ov, wl, deep, cache) {
    if(ov || !(p in r) || deep) {
      var target = r[p], src = s[p];
      if(target === src) {
        if(target === undefined) {
          r[p] = target
        }
        return
      }
      if(wl) {
        src = wl.call(s, p, src)
      }
      if(deep && src && (S.isArray(src) || S.isPlainObject(src))) {
        if(src[MIX_CIRCULAR_DETECTION]) {
          r[p] = src[MIX_CIRCULAR_DETECTION]
        }else {
          var clone = target && (S.isArray(target) || S.isPlainObject(target)) ? target : S.isArray(src) ? [] : {};
          r[p] = clone;
          mixInternal(clone, src, ov, wl, TRUE, cache)
        }
      }else {
        if(src !== undefined && (ov || !(p in r))) {
          r[p] = src
        }
      }
    }
  }
});
KISSY.add("util/string", [], function(S, undefined) {
  var logger = S.getLogger("s/util");
  var SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g, EMPTY = "";
  var RE_DASH = /-([a-z])/ig;
  var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g, trim = String.prototype.trim;
  var SEP = "&", EQ = "=", TRUE = true;
  function isValidParamValue(val) {
    var t = typeof val;
    return val == null || t !== "object" && t !== "function"
  }
  function upperCase() {
    return arguments[1].toUpperCase()
  }
  S.mix(S, {param:function(o, sep, eq, serializeArray) {
    sep = sep || SEP;
    eq = eq || EQ;
    if(serializeArray === undefined) {
      serializeArray = TRUE
    }
    var buf = [], key, i, v, len, val, encode = S.urlEncode;
    for(key in o) {
      val = o[key];
      key = encode(key);
      if(isValidParamValue(val)) {
        buf.push(key);
        if(val !== undefined) {
          buf.push(eq, encode(val + EMPTY))
        }
        buf.push(sep)
      }else {
        if(S.isArray(val) && val.length) {
          for(i = 0, len = val.length;i < len;++i) {
            v = val[i];
            if(isValidParamValue(v)) {
              buf.push(key, serializeArray ? encode("[]") : EMPTY);
              if(v !== undefined) {
                buf.push(eq, encode(v + EMPTY))
              }
              buf.push(sep)
            }
          }
        }
      }
    }
    buf.pop();
    return buf.join(EMPTY)
  }, unparam:function(str, sep, eq) {
    if(typeof str !== "string" || !(str = S.trim(str))) {
      return{}
    }
    sep = sep || SEP;
    eq = eq || EQ;
    var ret = {}, eqIndex, decode = S.urlDecode, pairs = str.split(sep), key, val, i = 0, len = pairs.length;
    for(;i < len;++i) {
      eqIndex = pairs[i].indexOf(eq);
      if(eqIndex === -1) {
        key = decode(pairs[i]);
        val = undefined
      }else {
        key = decode(pairs[i].substring(0, eqIndex));
        val = pairs[i].substring(eqIndex + 1);
        try {
          val = decode(val)
        }catch(e) {
          logger.error("decodeURIComponent error : " + val);
          logger.error(e)
        }
        if(S.endsWith(key, "[]")) {
          key = key.substring(0, key.length - 2)
        }
      }
      if(key in ret) {
        if(S.isArray(ret[key])) {
          ret[key].push(val)
        }else {
          ret[key] = [ret[key], val]
        }
      }else {
        ret[key] = val
      }
    }
    return ret
  }, startsWith:function(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0
  }, endsWith:function(str, suffix) {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind
  }, trim:trim ? function(str) {
    return str == null ? EMPTY : trim.call(str)
  } : function(str) {
    return str == null ? EMPTY : (str + "").replace(RE_TRIM, EMPTY)
  }, urlEncode:function(s) {
    return encodeURIComponent(String(s))
  }, urlDecode:function(s) {
    return decodeURIComponent(s.replace(/\+/g, " "))
  }, camelCase:function(name) {
    return name.replace(RE_DASH, upperCase)
  }, substitute:function(str, o, regexp) {
    if(typeof str !== "string" || !o) {
      return str
    }
    return str.replace(regexp || SUBSTITUTE_REG, function(match, name) {
      if(match.charAt(0) === "\\") {
        return match.slice(1)
      }
      return o[name] === undefined ? EMPTY : o[name]
    })
  }, ucfirst:function(s) {
    s += "";
    return s.charAt(0).toUpperCase() + s.substring(1)
  }})
});
KISSY.add("util/type", [], function(S, undefined) {
  var class2type = {}, FALSE = false, noop = S.noop, OP = Object.prototype, toString = OP.toString;
  function hasOwnProperty(o, p) {
    return OP.hasOwnProperty.call(o, p)
  }
  S.mix(S, {type:function(o) {
    return o == null ? String(o) : class2type[toString.call(o)] || "object"
  }, isPlainObject:function(obj) {
    if(!obj || S.type(obj) !== "object" || obj.nodeType || obj.window == obj) {
      return FALSE
    }
    var key, objConstructor;
    try {
      if((objConstructor = obj.constructor) && !hasOwnProperty(obj, "constructor") && !hasOwnProperty(objConstructor.prototype, "isPrototypeOf")) {
        return FALSE
      }
    }catch(e) {
      return FALSE
    }
    for(key in obj) {
    }
    return key === undefined || hasOwnProperty(obj, key)
  }});
  if("@DEBUG@") {
    S.mix(S, {isBoolean:noop, isNumber:noop, isString:noop, isFunction:noop, isArray:noop, isDate:noop, isRegExp:noop, isObject:noop})
  }
  var types = "Boolean Number String Function Date RegExp Object Array".split(" ");
  for(var i = 0;i < types.length;i++) {
    (function(name, lc) {
      class2type["[object " + name + "]"] = lc = name.toLowerCase();
      S["is" + name] = function(o) {
        return S.type(o) === lc
      }
    })(types[i], i)
  }
  S.isArray = Array.isArray || S.isArray
});
KISSY.add("util/web", [], function(S, undefined) {
  var logger = S.getLogger("s/web");
  var win = S.Env.host, doc = win.document || {}, docElem = doc.documentElement, location = win.location, EMPTY = "", domReady = 0, callbacks = [], POLL_RETIRES = 500, POLL_INTERVAL = 40, RE_ID_STR = /^#?([\w-]+)$/, RE_NOT_WHITESPACE = /\S/, standardEventModel = doc.addEventListener, supportEvent = doc.attachEvent || standardEventModel, DOM_READY_EVENT = "DOMContentLoaded", READY_STATE_CHANGE_EVENT = "readystatechange", LOAD_EVENT = "load", COMPLETE = "complete", addEventListener = standardEventModel ? 
  function(el, type, fn) {
    el.addEventListener(type, fn, false)
  } : function(el, type, fn) {
    el.attachEvent("on" + type, fn)
  }, removeEventListener = standardEventModel ? function(el, type, fn) {
    el.removeEventListener(type, fn, false)
  } : function(el, type, fn) {
    el.detachEvent("on" + type, fn)
  };
  S.mix(S, {isWindow:function(obj) {
    return obj != null && obj == obj.window
  }, parseXML:function(data) {
    if(data.documentElement) {
      return data
    }
    var xml;
    try {
      if(win.DOMParser) {
        xml = (new DOMParser).parseFromString(data, "text/xml")
      }else {
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = false;
        xml.loadXML(data)
      }
    }catch(e) {
      logger.error("parseXML error :");
      logger.error(e);
      xml = undefined
    }
    if(!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      S.error("Invalid XML: " + data)
    }
    return xml
  }, globalEval:function(data) {
    if(data && RE_NOT_WHITESPACE.test(data)) {
      if(win.execScript) {
        win.execScript(data)
      }else {
        (function(data) {
          win["eval"].call(win, data)
        })(data)
      }
    }
  }, ready:function(fn) {
    if(domReady) {
      try {
        fn(S)
      }catch(e) {
        S.log(e.stack || e, "error");
        setTimeout(function() {
          throw e;
        }, 0)
      }
    }else {
      callbacks.push(fn)
    }
    return this
  }, available:function(id, fn) {
    id = (id + EMPTY).match(RE_ID_STR)[1];
    var retryCount = 1;
    var timer = S.later(function() {
      if(++retryCount > POLL_RETIRES) {
        timer.cancel();
        return
      }
      var node = doc.getElementById(id);
      if(node) {
        fn(node);
        timer.cancel()
      }
    }, POLL_INTERVAL, true)
  }});
  function fireReady() {
    if(domReady) {
      return
    }
    if(win && win.setTimeout) {
      removeEventListener(win, LOAD_EVENT, fireReady)
    }
    domReady = 1;
    for(var i = 0;i < callbacks.length;i++) {
      try {
        callbacks[i](S)
      }catch(e) {
        S.log(e.stack || e, "error");
        setTimeout(function() {
          throw e;
        }, 0)
      }
    }
  }
  function bindReady() {
    if(!doc || doc.readyState === COMPLETE) {
      fireReady();
      return
    }
    addEventListener(win, LOAD_EVENT, fireReady);
    if(standardEventModel) {
      var domReady = function() {
        removeEventListener(doc, DOM_READY_EVENT, domReady);
        fireReady()
      };
      addEventListener(doc, DOM_READY_EVENT, domReady)
    }else {
      var stateChange = function() {
        if(doc.readyState === COMPLETE) {
          removeEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);
          fireReady()
        }
      };
      addEventListener(doc, READY_STATE_CHANGE_EVENT, stateChange);
      var notframe, doScroll = docElem && docElem.doScroll;
      try {
        notframe = win.frameElement === null
      }catch(e) {
        notframe = false
      }
      if(doScroll && notframe) {
        var readyScroll = function() {
          try {
            doScroll("left");
            fireReady()
          }catch(ex) {
            setTimeout(readyScroll, POLL_INTERVAL)
          }
        };
        readyScroll()
      }
    }
  }
  if(location && (location.search || EMPTY).indexOf("ks-debug") !== -1) {
    S.Config.debug = true
  }
  if(supportEvent) {
    bindReady()
  }
  try {
    doc.execCommand("BackgroundImageCache", false, true)
  }catch(e) {
  }
});
KISSY.add("util", ["util/array", "util/escape", "util/function", "util/object", "util/string", "util/type", "util/web"], function(S, require) {
  var FALSE = false, CLONE_MARKER = "__~ks_cloned";
  S.mix = function(to, from) {
    for(var i in from) {
      to[i] = from[i]
    }
    return to
  };
  require("util/array");
  require("util/escape");
  require("util/function");
  require("util/object");
  require("util/string");
  require("util/type");
  require("util/web");
  S.mix(S, {clone:function(input, filter) {
    var memory = {}, ret = cloneInternal(input, filter, memory);
    S.each(memory, function(v) {
      v = v.input;
      if(v[CLONE_MARKER]) {
        try {
          delete v[CLONE_MARKER]
        }catch(e) {
          v[CLONE_MARKER] = undefined
        }
      }
    });
    memory = null;
    return ret
  }});
  function cloneInternal(input, f, memory) {
    var destination = input, isArray, isPlainObject, k, stamp;
    if(!input) {
      return destination
    }
    if(input[CLONE_MARKER]) {
      return memory[input[CLONE_MARKER]].destination
    }else {
      if(typeof input === "object") {
        var Constructor = input.constructor;
        if(S.inArray(Constructor, [Boolean, String, Number, Date, RegExp])) {
          destination = new Constructor(input.valueOf())
        }else {
          if(isArray = S.isArray(input)) {
            destination = f ? S.filter(input, f) : input.concat()
          }else {
            if(isPlainObject = S.isPlainObject(input)) {
              destination = {}
            }
          }
        }
        input[CLONE_MARKER] = stamp = S.guid("c");
        memory[stamp] = {destination:destination, input:input}
      }
    }
    if(isArray) {
      for(var i = 0;i < destination.length;i++) {
        destination[i] = cloneInternal(destination[i], f, memory)
      }
    }else {
      if(isPlainObject) {
        for(k in input) {
          if(k !== CLONE_MARKER && (!f || f.call(input, input[k], k, input) !== FALSE)) {
            destination[k] = cloneInternal(input[k], f, memory)
          }
        }
      }
    }
    return destination
  }
  return S
});

/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Apr 3 19:02
*/
/*
 Combined modules by KISSY Module Compiler: 

 ua
*/

KISSY.add("ua", [], function(S, require, exports, module, undefined) {
  var win = S.Env.host, doc = win.document, navigator = win.navigator, ua = navigator && navigator.userAgent || "";
  function numberify(s) {
    var c = 0;
    return parseFloat(s.replace(/\./g, function() {
      return c++ === 0 ? "." : ""
    }))
  }
  function setTridentVersion(ua, UA) {
    var core, m;
    UA[core = "trident"] = 0.1;
    if((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
      UA[core] = numberify(m[1])
    }
    UA.core = core
  }
  function getIEVersion(ua) {
    var m, v;
    if((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) && (v = m[1] || m[2])) {
      return numberify(v)
    }
    return 0
  }
  function getDescriptorFromUserAgent(ua) {
    var EMPTY = "", os, core = EMPTY, shell = EMPTY, m, IE_DETECT_RANGE = [6, 9], ieVersion, v, end, VERSION_PLACEHOLDER = "{{version}}", IE_DETECT_TPL = "<!--[if IE " + VERSION_PLACEHOLDER + "]><" + "s></s><![endif]--\>", div = doc && doc.createElement("div"), s = [];
    var UA = {webkit:undefined, trident:undefined, gecko:undefined, presto:undefined, chrome:undefined, safari:undefined, firefox:undefined, ie:undefined, ieMode:undefined, opera:undefined, mobile:undefined, core:undefined, shell:undefined, phantomjs:undefined, os:undefined, ipad:undefined, iphone:undefined, ipod:undefined, ios:undefined, android:undefined, nodejs:undefined};
    if(div && div.getElementsByTagName) {
      div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, "");
      s = div.getElementsByTagName("s")
    }
    if(s.length > 0) {
      setTridentVersion(ua, UA);
      for(v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1];v <= end;v++) {
        div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
        if(s.length > 0) {
          UA[shell = "ie"] = v;
          break
        }
      }
      if(!UA.ie && (ieVersion = getIEVersion(ua))) {
        UA[shell = "ie"] = ieVersion
      }
    }else {
      if(((m = ua.match(/AppleWebKit\/([\d.]*)/)) || (m = ua.match(/Safari\/([\d.]*)/))) && m[1]) {
        UA[core = "webkit"] = numberify(m[1]);
        if((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
          UA[shell = "opera"] = numberify(m[1])
        }else {
          if((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
            UA[shell = "chrome"] = numberify(m[1])
          }else {
            if((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
              UA[shell = "safari"] = numberify(m[1])
            }else {
              UA.safari = UA.webkit
            }
          }
        }
        if(/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
          UA.mobile = "apple";
          m = ua.match(/OS ([^\s]*)/);
          if(m && m[1]) {
            UA.ios = numberify(m[1].replace("_", "."))
          }
          os = "ios";
          m = ua.match(/iPad|iPod|iPhone/);
          if(m && m[0]) {
            UA[m[0].toLowerCase()] = UA.ios
          }
        }else {
          if(/ Android/i.test(ua)) {
            if(/Mobile/.test(ua)) {
              os = UA.mobile = "android"
            }
            m = ua.match(/Android ([^\s]*);/);
            if(m && m[1]) {
              UA.android = numberify(m[1])
            }
          }else {
            if(m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/)) {
              UA.mobile = m[0].toLowerCase()
            }
          }
        }
        if((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
          UA.phantomjs = numberify(m[1])
        }
      }else {
        if((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
          UA[core = "presto"] = numberify(m[1]);
          if((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
            UA[shell = "opera"] = numberify(m[1]);
            if((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
              UA[shell] = numberify(m[1])
            }
            if((m = ua.match(/Opera Mini[^;]*/)) && m) {
              UA.mobile = m[0].toLowerCase()
            }else {
              if((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                UA.mobile = m[0]
              }
            }
          }
        }else {
          if(ieVersion = getIEVersion(ua)) {
            UA[shell = "ie"] = ieVersion;
            setTridentVersion(ua, UA)
          }else {
            if(m = ua.match(/Gecko/)) {
              UA[core = "gecko"] = 0.1;
              if((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                UA[core] = numberify(m[1]);
                if(/Mobile|Tablet/.test(ua)) {
                  UA.mobile = "firefox"
                }
              }
              if((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                UA[shell = "firefox"] = numberify(m[1])
              }
            }
          }
        }
      }
    }
    if(!os) {
      if(/windows|win32/i.test(ua)) {
        os = "windows"
      }else {
        if(/macintosh|mac_powerpc/i.test(ua)) {
          os = "macintosh"
        }else {
          if(/linux/i.test(ua)) {
            os = "linux"
          }else {
            if(/rhino/i.test(ua)) {
              os = "rhino"
            }
          }
        }
      }
    }
    UA.os = os;
    UA.core = UA.core || core;
    UA.shell = shell;
    UA.ieMode = UA.ie && doc.documentMode || UA.ie;
    return UA
  }
  var UA = S.UA = getDescriptorFromUserAgent(ua);
  if(typeof process === "object") {
    var versions, nodeVersion;
    if((versions = process.versions) && (nodeVersion = versions.node)) {
      UA.os = process.platform;
      UA.nodejs = numberify(nodeVersion)
    }
  }
  UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;
  var browsers = ["webkit", "trident", "gecko", "presto", "chrome", "safari", "firefox", "ie", "opera"], documentElement = doc && doc.documentElement, className = "";
  if(documentElement) {
    for(var i = 0;i < browsers.length;i++) {
      var key = browsers[i];
      var v = UA[key];
      if(v) {
        className += " ks-" + key + (parseInt(v, 10) + "");
        className += " ks-" + key
      }
    }
    if(className) {
      documentElement.className = (documentElement.className + className).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
    }
  }
  return UA
});

/*
Copyright 2014, KISSY v1.50
MIT Licensed
build time: Apr 3 19:02
*/
/*
 Combined modules by KISSY Module Compiler: 

 feature
*/

KISSY.add("feature", ["util", "ua"], function(S, require) {
  require("util");
  var win = S.Env.host, Config = S.Config, UA = require("ua"), propertyPrefixes = ["Webkit", "Moz", "O", "ms"], propertyPrefixesLength = propertyPrefixes.length, doc = win.document || {}, isMsPointerSupported, isPointerSupported, isTransform3dSupported, documentElement = doc && doc.documentElement, navigator, documentElementStyle, isClassListSupportedState = true, isQuerySelectorSupportedState = false, isTouchEventSupportedState = "ontouchstart" in doc && !UA.phantomjs, vendorInfos = {}, ie = UA.ieMode;
  if(documentElement) {
    if(documentElement.querySelector && ie !== 8) {
      isQuerySelectorSupportedState = true
    }
    documentElementStyle = documentElement.style;
    isClassListSupportedState = "classList" in documentElement;
    navigator = win.navigator || {};
    isMsPointerSupported = "msPointerEnabled" in navigator;
    isPointerSupported = "pointerEnabled" in navigator
  }
  function getVendorInfo(name) {
    if(name.indexOf("-") !== -1) {
      name = S.camelCase(name)
    }
    if(name in vendorInfos) {
      return vendorInfos[name]
    }
    if(!documentElementStyle || name in documentElementStyle) {
      vendorInfos[name] = {propertyName:name, propertyNamePrefix:""}
    }else {
      var upperFirstName = name.charAt(0).toUpperCase() + name.slice(1), vendorName;
      for(var i = 0;i < propertyPrefixesLength;i++) {
        var propertyNamePrefix = propertyPrefixes[i];
        vendorName = propertyNamePrefix + upperFirstName;
        if(vendorName in documentElementStyle) {
          vendorInfos[name] = {propertyName:vendorName, propertyNamePrefix:propertyNamePrefix}
        }
      }
      vendorInfos[name] = vendorInfos[name] || null
    }
    return vendorInfos[name]
  }
  S.Feature = {isMsPointerSupported:function() {
    return isMsPointerSupported
  }, isPointerSupported:function() {
    return isPointerSupported
  }, isTouchEventSupported:function() {
    return isTouchEventSupportedState
  }, isTouchGestureSupported:function() {
    return isTouchEventSupportedState || isPointerSupported || isMsPointerSupported
  }, isDeviceMotionSupported:function() {
    return!!win.DeviceMotionEvent
  }, isHashChangeSupported:function() {
    return"onhashchange" in win && (!ie || ie > 7)
  }, isInputEventSupported:function() {
    return!Config.simulateInputEvent && "oninput" in win && (!ie || ie > 9)
  }, isTransform3dSupported:function() {
    if(isTransform3dSupported !== undefined) {
      return isTransform3dSupported
    }
    if(!documentElement || !getVendorInfo("transform")) {
      isTransform3dSupported = false
    }else {
      var el = doc.createElement("p");
      var transformProperty = getVendorInfo("transform").name;
      documentElement.insertBefore(el, documentElement.firstChild);
      el.style[transformProperty] = "translate3d(1px,1px,1px)";
      var computedStyle = win.getComputedStyle(el);
      var has3d = computedStyle.getPropertyValue(transformProperty) || computedStyle[transformProperty];
      documentElement.removeChild(el);
      isTransform3dSupported = has3d !== undefined && has3d.length > 0 && has3d !== "none"
    }
    return isTransform3dSupported
  }, isClassListSupported:function() {
    return isClassListSupportedState
  }, isQuerySelectorSupported:function() {
    return!Config.simulateCss3Selector && isQuerySelectorSupportedState
  }, getCssVendorInfo:function(name) {
    return getVendorInfo(name)
  }};
  return S.Feature
});

KISSY.use('ua, util');/**
 * @ignore
 * 1. export KISSY 's functionality to module system
 * 2. export light-weighted json parse
 */
(function (S) {
    var UA = S.UA,
        Env = S.Env,
        win = Env.host,
    /*global global*/
        nativeJson = ((UA.nodejs && typeof global === 'object') ? global : win).JSON;

    // ie 8.0.7600.16315@win7 json bug!
    if (UA.ieMode < 9) {
        nativeJson = null;
    }

    if (nativeJson) {
        S.add('json', function () {
            S.JSON = nativeJson;
            return nativeJson;
        });
        // light weight json parse
        S.parseJson = function (data) {
            return nativeJson.parse(data);
        };
    } else {
        // Json RegExp
        var INVALID_CHARS_REG = /^[\],:{}\s]*$/,
            INVALID_BRACES_REG = /(?:^|:|,)(?:\s*\[)+/g,
            INVALID_ESCAPES_REG = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            INVALID_TOKENS_REG = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
        S.parseJson = function (data) {
            if (data === null) {
                return data;
            }
            if (typeof data === 'string') {
                // for ie
                data = S.trim(data);
                if (data) {
                    // from json2
                    if (INVALID_CHARS_REG.test(data.replace(INVALID_ESCAPES_REG, '@')
                        .replace(INVALID_TOKENS_REG, ']')
                        .replace(INVALID_BRACES_REG, ''))) {
                        /*jshint evil:true*/
                        return (new Function('return ' + data))();
                    }
                }
            }
            return S.error('Invalid Json: ' + data);
        };
    }
})(KISSY);/**
 * @ignore
 * Default KISSY Gallery and core alias.
 * @author yiminghe@gmail.com
 */

KISSY.config({
    modules: {
        ajax: {
            alias: 'io'
        }
    }
});

KISSY.config({
    packages: {
        gallery: {
            base: location.protocol === 'https' ?
                'https://s.tbcdn.cn/s/kissy/gallery' : 'http://a.tbcdn.cn/s/kissy/gallery'
        }
    }
});

KISSY.use('feature');/*jshint indent:false, quotmark:false*/
(function(S){
S.config("requires",{
    "anim/base": [
        "dom",
        "promise"
    ],
    "anim/timer": [
        "anim/base"
    ],
    "anim/transition": [
        "anim/base"
    ],
    "attribute": [
        "event/custom"
    ],
    "base": [
        "attribute"
    ],
    "button": [
        "component/control"
    ],
    "color": [
        "attribute"
    ],
    "combobox": [
        "menu",
        "io"
    ],
    "combobox/multi-word": [
        "combobox"
    ],
    "component/container": [
        "component/control"
    ],
    "component/control": [
        "node",
        "base",
        "component/manager",
        "xtemplate/runtime"
    ],
    "component/extension/align": [
        "node"
    ],
    "component/extension/content-render": [
        "component/extension/content-xtpl"
    ],
    "component/extension/delegate-children": [
        "node",
        "component/manager"
    ],
    "component/extension/shim": [
        "ua"
    ],
    "component/plugin/drag": [
        "dd"
    ],
    "component/plugin/resize": [
        "resizable"
    ],
    "date/format": [
        "date/gregorian"
    ],
    "date/gregorian": [
        "i18n!date"
    ],
    "date/picker": [
        "i18n!date/picker",
        "component/control",
        "date/format",
        "date/picker-xtpl"
    ],
    "date/popup-picker": [
        "date/picker",
        "component/extension/shim",
        "component/extension/align"
    ],
    "dd": [
        "node",
        "base",
        "event/gesture/drag"
    ],
    "dd/plugin/constrain": [
        "node",
        "base"
    ],
    "dd/plugin/proxy": [
        "dd"
    ],
    "dd/plugin/scroll": [
        "dd"
    ],
    "dom": [
        "ua"
    ],
    "dom/base": [
        "ua"
    ],
    "dom/class-list": [
        "dom/base"
    ],
    "dom/ie": [
        "dom/base"
    ],
    "dom/selector": [
        "dom/basic"
    ],
    "editor": [
        "html-parser",
        "component/control"
    ],
    "event": [
        "event/dom",
        "event/custom",
        "event/gesture"
    ],
    "event/base": [
        "util"
    ],
    "event/custom": [
        "event/base"
    ],
    "event/dom/base": [
        "event/base",
        "dom"
    ],
    "event/dom/focusin": [
        "event/dom/base"
    ],
    "event/dom/hashchange": [
        "event/dom/base",
        "uri"
    ],
    "event/dom/ie": [
        "event/dom/base"
    ],
    "event/dom/input": [
        "event/dom/base"
    ],
    "event/gesture/base": [
        "event/dom/base"
    ],
    "event/gesture/drag": [
        "event/gesture/base"
    ],
    "event/gesture/shake": [
        "event/dom/base"
    ],
    "event/gesture/touch": [
        "event/gesture/base"
    ],
    "feature": [
        "ua"
    ],
    "filter-menu": [
        "menu"
    ],
    "io": [
        "dom",
        "event/custom",
        "promise",
        "uri",
        "event/dom"
    ],
    "menu": [
        "component/container",
        "component/extension/delegate-children",
        "component/extension/content-render",
        "component/extension/align",
        "component/extension/shim"
    ],
    "menubutton": [
        "button",
        "menu"
    ],
    "navigation-view": [
        "component/container",
        "component/extension/content-render"
    ],
    "node": [
        "dom",
        "event/dom",
        "event/gesture",
        "anim"
    ],
    "overlay": [
        "component/container",
        "component/extension/shim",
        "component/extension/align",
        "component/extension/content-render"
    ],
    "path": [
        "util"
    ],
    "resizable": [
        "dd"
    ],
    "resizable/plugin/proxy": [
        "node",
        "base"
    ],
    "router": [
        "event/dom",
        "uri",
        "event/custom"
    ],
    "scroll-view/base": [
        "anim/timer",
        "component/container",
        "component/extension/content-render"
    ],
    "scroll-view/plugin/pull-to-refresh": [
        "base"
    ],
    "scroll-view/plugin/scrollbar": [
        "component/control",
        "event/gesture/drag"
    ],
    "scroll-view/touch": [
        "scroll-view/base"
    ],
    "separator": [
        "component/control"
    ],
    "split-button": [
        "menubutton"
    ],
    "stylesheet": [
        "dom"
    ],
    "swf": [
        "dom",
        "json",
        "attribute"
    ],
    "tabs": [
        "toolbar",
        "button"
    ],
    "toolbar": [
        "component/container",
        "component/extension/delegate-children"
    ],
    "tree": [
        "component/container",
        "component/extension/content-render",
        "component/extension/delegate-children"
    ],
    "ua": [
        "util"
    ],
    "uri": [
        "path"
    ],
    "xtemplate": [
        "xtemplate/compiler"
    ],
    "xtemplate/compiler": [
        "xtemplate/runtime"
    ],
    "xtemplate/runtime": [
        "util"
    ]
});
var Feature = S.Feature, UA = S.UA;
function alias(cfg) {
    S.config("alias", cfg);
}
alias({
    anim: Feature.getCssVendorInfo('transition') ? 'anim/transition' : 'anim/timer'
});
alias({
    'dom/basic': [
        'dom/base',
        UA.ieMode < 9 ? 'dom/ie' : '',
        Feature.isClassListSupported() ? '' : 'dom/class-list'
    ],
    dom: [
        'dom/basic',
        Feature.isQuerySelectorSupported() ? '' : 'dom/selector'
    ]
});
alias({
    'event/dom': [
        'event/dom/base',
        Feature.isHashChangeSupported() ? '' : 'event/dom/hashchange',
        UA.ieMode < 9 ? 'event/dom/ie' : '',
        Feature.isInputEventSupported() ? '' : 'event/dom/input',
        UA.ie ? '' : 'event/dom/focusin'
    ],
    'event/gesture': [
        'event/gesture/base',
        Feature.isTouchGestureSupported() ? 'event/gesture/touch' : ''
    ]
});
alias({
    'scroll-view': Feature.isTouchGestureSupported() ? 'scroll-view/touch' : 'scroll-view/base'
});

})(KISSY);
