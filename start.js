"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const util = require('util');
var exec = require('child_process').exec;
var fs_1 = __importDefault(require("fs"));
var Start = /** @class */ (function () {
    function Start() {
    }
    Start.prototype.start = function () {
        var _this = this;
        this.getLastFiles().then(function (value) {
            console.log(value);
            var lines = value.split('\n');
            var commit = _this.getLastCommit(lines);
            console.log("commit 1");
            console.log(commit);
            lines = lines.slice(3);
            commit = _this.getLastCommit(lines);
            console.log("commit 2");
            console.log(commit);
        });
    };
    Start.prototype.createPatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearPatchs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formatPatchs(3)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.joinFiles()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Start.prototype.applyPatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearPatchs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.splitFiles()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.applyPatchs()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Start.prototype.splitFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var count, str, files;
            return __generator(this, function (_a) {
                console.log("splitFiles()");
                count = 1;
                str = fs_1.default.readFileSync('result.txt', 'utf8');
                files = str.split('__FILES_SPLITTER__');
                files.forEach(function (file) {
                    if (file == '')
                        return;
                    //"FC\\KhasanovSr" <KhasanovSr@ufa.uralsib.ru>
                    fs_1.default.writeFileSync("patchs/" + count + ".patch", file, 'utf8');
                    count++;
                });
                return [2 /*return*/];
            });
        });
    };
    Start.prototype.applyPatchs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                console.log("applyPatchs()");
                files = fs_1.default.readdirSync("patchs/");
                files.forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(file);
                                return [4 /*yield*/, new Promise((function (resolve, reject) {
                                        exec('cd ../../ && git apply repowork/lib/patchs/' + file + '', function (err, stdout, stderr) {
                                            if (err) {
                                                reject(err);
                                            }
                                            console.log(stdout);
                                            resolve();
                                        });
                                    }))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Start.prototype.clearPatchs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("clearPatchs()");
                        return [4 /*yield*/, fs_1.default.readdir("patchs/", function (err, files) {
                                files.forEach(function (file) {
                                    console.log(file);
                                    fs_1.default.unlinkSync('patchs/' + file);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Start.prototype.formatPatchs = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("formatPatchs()");
                return [2 /*return*/, new Promise((function (resolve, reject) {
                        exec('cd ./patchs/ && git format-patch -' + count + '', function (err, stdout, stderr) {
                            if (err) {
                                reject(err);
                            }
                            console.log(stdout);
                            resolve();
                        });
                    }))];
            });
        });
    };
    Start.prototype.joinFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("joinFiles()");
                        return [4 /*yield*/, fs_1.default.readdir("patchs/", function (err, files) {
                                var newFile = '';
                                files.forEach(function (fpath) {
                                    console.log(fpath);
                                    var file = fs_1.default.readFileSync('patchs/' + fpath, 'utf8');
                                    file = file.replace("FC\\KhasanovSr", "sarvar");
                                    file = file.replace("FC\\KhasanovSr", "sarvar");
                                    file = file.replace("FC\\KhasanovSr", "sarvar");
                                    file = file.replace("FC\\KhasanovSr", "sarvar");
                                    file = file.replace("KhasanovSr@ufa.uralsib.ru", "sarkhas@mail.ru");
                                    file = file.replace("KhasanovSr@ufa.uralsib.ru", "sarkhas@mail.ru");
                                    file = file.replace("KhasanovSr@ufa.uralsib.ru", "sarkhas@mail.ru");
                                    file = file.replace("KhasanovSr@ufa.uralsib.ru", "sarkhas@mail.ru");
                                    newFile += file + '__FILES_SPLITTER__';
                                });
                                fs_1.default.writeFileSync("result.txt", newFile, 'utf8');
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Start.prototype.getLastCommit = function (lines) {
        var step = 0;
        var needContinue = 0;
        var commit = "";
        var files = [];
        var lineNumber = 0;
        var needBreak = false;
        lines.forEach(function (line, index, array) {
            if (needBreak) {
                return;
            }
            lineNumber++;
            if (needContinue > 0) {
                needContinue--;
                return;
            }
            if (step == 0) {
                if (!line.startsWith("commit "))
                    return;
                commit = line.substr(7);
                needContinue = 3;
                step = 1;
            }
            else if (step == 1) {
                if (line.trim() != '')
                    return;
                step = 2;
            }
            else if (step == 2) {
                if (line.trim() == '') {
                    step = 0;
                    needBreak = true;
                    return;
                }
                files.push(line.trim());
            }
        });
        return { id: commit, files: files };
    };
    Start.prototype.getLastFiles = function () {
        return new Promise(function (resolve, reject) {
            exec('cd ../../ && git log --name-only', function (err, stdout, stderr) {
                if (err) {
                    reject(err);
                }
                // the *entire* stdout and stderr (buffered)
                //console.log(`stdout: ${stdout}`);
                //console.log(`stderr: ${stderr}`);
                resolve(stdout);
            });
        });
    };
    return Start;
}());
var start = new Start();
if (process.argv[2] === 'apply') {
    start.applyPatch();
}
else if (process.argv[2] === 'create') {
    start.createPatch();
}
else {
    console.log("use argument 'apply' or 'create'");
}
//# sourceMappingURL=start.js.map
