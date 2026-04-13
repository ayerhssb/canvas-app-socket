var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var express = require("express");
var Server = require("socket.io").Server;
var createServer = require("http").createServer;
var jwtVerify = require("jose").jwtVerify;
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}
var PORT = process.env.PORT || 5000;
var app = express();
var server = createServer(app);
var corsOptions = {
    origin: process.env.CLIENT_URL, // process.env.CLIENT_URL || "*"
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
};
app.use(cors(corsOptions));
var io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, //process.env.CLIENT_URL || "*"
    },
});
app.get("/", function (req, res) {
    res.send("Canvas Socket Server Running");
});
io.use(function (socket, next) { return __awaiter(_this, void 0, void 0, function () {
    var token, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                token = socket.handshake.auth.token;
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""))];
            case 1:
                user = (_a.sent()).payload;
                if (!user)
                    next(new Error("Authentciation error"));
                console.log(user);
                socket.data.user = user;
                next();
                return [3 /*break*/, 3];
            case 2:
                next(new Error('Authentication error'));
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error(e_1);
                next(new Error('Authentication error'));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
io.on("connection", function (socket) {
    console.log("".concat(socket.id, " connected"));
    socket.on('draw', function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = socket.broadcast.to(socket.data.room)).emit.apply(_a, __spreadArray(['draw'], args, false));
    });
    socket.on("join", function (room) { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!io.sockets.adapter.rooms.get(room)) return [3 /*break*/, 2];
                    socket.data.room = room;
                    socket.join(room);
                    return [4 /*yield*/, io.in(room).fetchSockets()];
                case 1:
                    users = (_a.sent()).map(function (socket) { return socket.data.user; });
                    socket.emit("joined", room, users);
                    socket.broadcast.to(room).emit("update-users", users);
                    io.in(room).emit("get-canvas-data");
                    return [3 /*break*/, 3];
                case 2:
                    socket.emit("rejected");
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    socket.on('canvas-data', function (data) {
        if (!socket.data.admin)
            return;
        socket.broadcast.to(socket.data.room).emit("canvas-data", data);
    });
    socket.on('canvas-sync', function (data) {
        socket.broadcast.to(socket.data.room).emit("canvas-sync", data);
    });
    socket.on("cursor-move", function (data) {
        socket.broadcast.to(socket.data.room).emit("cursor-move", data);
    });
    socket.on("cursor-leave", function (data) {
        socket.broadcast.to(socket.data.room).emit("cursor-leave", data);
    });
    socket.on("create", function () {
        socket.data.admin = true;
        var room = "id_" + (new Date()).getTime();
        console.log(room);
        socket.join(room);
        socket.data.room = room;
        socket.emit("joined", room, [socket.data.user]);
    });
    socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("".concat(socket.id, " disconnected"));
                    if (!socket.data.room) return [2 /*return*/];
                    return [4 /*yield*/, io.in(socket.data.room).fetchSockets()];
                case 1:
                    users = (_a.sent()).map(function (socket) { return socket.data.user; });
                    console.log(socket.data.user, socket.data.admin);
                    if (socket.data.admin)
                        socket.broadcast.to(socket.data.room).emit("admin-disconnected");
                    socket.broadcast.to(socket.data.room).emit("update-users", users);
                    return [2 /*return*/];
            }
        });
    }); });
});
server.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
