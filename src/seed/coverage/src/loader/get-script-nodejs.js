function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/loader/get-script-nodejs.js']) {
  _$jscoverage['/loader/get-script-nodejs.js'] = {};
  _$jscoverage['/loader/get-script-nodejs.js'].lineData = [];
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[7] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[8] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[11] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[12] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[14] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[15] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[16] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[17] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[20] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[21] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[22] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[23] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[26] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[29] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[30] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[32] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[33] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[34] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[36] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[37] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[38] = 0;
}
if (! _$jscoverage['/loader/get-script-nodejs.js'].functionData) {
  _$jscoverage['/loader/get-script-nodejs.js'].functionData = [];
  _$jscoverage['/loader/get-script-nodejs.js'].functionData[0] = 0;
  _$jscoverage['/loader/get-script-nodejs.js'].functionData[1] = 0;
}
if (! _$jscoverage['/loader/get-script-nodejs.js'].branchData) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData = {};
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['14'] = [];
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['14'][1] = new BranchData();
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['20'] = [];
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['20'][1] = new BranchData();
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['22'] = [];
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['22'][1] = new BranchData();
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['34'] = [];
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['38'] = [];
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['38'][1] = new BranchData();
}
_$jscoverage['/loader/get-script-nodejs.js'].branchData['38'][1].init(95, 17, 'error && error(e)');
function visit418_38_1(result) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['38'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script-nodejs.js'].branchData['34'][1].init(246, 20, 'success && success()');
function visit417_34_1(result) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script-nodejs.js'].branchData['22'][1].init(75, 20, 'success && success()');
function visit416_22_1(result) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['22'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script-nodejs.js'].branchData['20'][1].init(197, 55, 'S.startsWith(S.Path.extname(url).toLowerCase(), \'.css\')');
function visit415_20_1(result) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['20'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script-nodejs.js'].branchData['14'][1].init(33, 24, 'S.isPlainObject(success)');
function visit414_14_1(result) {
  _$jscoverage['/loader/get-script-nodejs.js'].branchData['14'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script-nodejs.js'].lineData[7]++;
(function(S) {
  _$jscoverage['/loader/get-script-nodejs.js'].functionData[0]++;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[8]++;
  var fs = require('fs'), vm = require('vm');
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[11]++;
  S.getScript = function(url, success, charset) {
  _$jscoverage['/loader/get-script-nodejs.js'].functionData[1]++;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[12]++;
  var error;
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[14]++;
  if (visit414_14_1(S.isPlainObject(success))) {
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[15]++;
    charset = success.charset;
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[16]++;
    error = success.error;
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[17]++;
    success = success.success;
  }
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[20]++;
  if (visit415_20_1(S.startsWith(S.Path.extname(url).toLowerCase(), '.css'))) {
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[21]++;
    S.log('node js can not load css: ' + url, 'warn');
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[22]++;
    visit416_22_1(success && success());
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[23]++;
    return;
  }
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[26]++;
  var uri = new S.Uri(url), path = uri.getPath();
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[29]++;
  try {
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[30]++;
    var mod = fs.readFileSync(path, charset);
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[32]++;
    var factory = vm.runInThisContext('(function(KISSY,requireNode){' + mod + '})', url);
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[33]++;
    factory(S, require);
    _$jscoverage['/loader/get-script-nodejs.js'].lineData[34]++;
    visit417_34_1(success && success());
  }  catch (e) {
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[36]++;
  S.log('in file: ' + url, 'error');
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[37]++;
  S.log(e.stack, 'error');
  _$jscoverage['/loader/get-script-nodejs.js'].lineData[38]++;
  visit418_38_1(error && error(e));
}
};
})(KISSY);