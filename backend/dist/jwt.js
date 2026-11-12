"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
// 環境変数からJWTの秘密鍵を取得する関数
function getSecretKey() {
    const key = process.env.JWT_SECRET_KEY;
    if (!key) {
        throw new Error('環境変数JWT_SECRET_KEYが設定されていません。');
    }
    return key;
}
// JWTの秘密鍵
const SECRET_KEY = getSecretKey();
// JWTの有効期限
const EXPIRES_IN = '1h';
// 認証トークンを生成する関数
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}
// 認証トークンを検証するミドルウェア関数
function verifyToken(req, res, next) {
    // リクエスト内のクッキー情報から認証トークンを取得する
    const token = req.cookies.authToken;
    if (!token) {
        res.status(401).json({ error: '認証トークンがありません。' });
        return;
    }
    try {
        // 認証トークンと秘密鍵を照合し、認証トークンの正当性を検証する
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // 検証に成功した場合、返されたペイロード（ユーザー情報など）をリクエストに追加する
        req.user = decoded;
        // 次のミドルウェアまたはルートに処理を進める
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(440).json({ error: '認証トークンが有効期限切れです。' });
            return;
        }
        res.status(401).json({ error: '認証トークンが無効です。' });
    }
}
//# sourceMappingURL=jwt.js.map