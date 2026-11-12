"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const jwt_1 = require("../jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
// ルーティング操作用オブジェクト
const router = (0, express_1.Router)();
// ユーザーを登録するルート
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim()) {
        res.status(400).json({ error: 'メールアドレスとパスワードを入力してください。' });
        return;
    }
    if (password.trim().length < 8) {
        res.status(400).json({ error: 'パスワードは8文字以上で入力してください。' });
        return;
    }
    try {
        const checkSql = 'SELECT * FROM users WHERE email = ?;';
        const checkParams = [email];
        const existingUsers = await (0, db_1.query)(checkSql, checkParams);
        // すでに同じメールアドレスのユーザーが存在する場合は409エラーを返す
        if (existingUsers.length > 0) {
            res.status(409).json({ error: 'そのメールアドレスはすでに登録済みです。' });
            return;
        }
        // パスワードをハッシュ化する
        const hashed = await bcrypt_1.default.hash(password, 10);
        const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?);';
        const insertParams = [email, hashed];
        // ユーザーをデータベースに登録する
        await (0, db_1.exec)(insertSql, insertParams);
        res.status(201).json({ message: '会員登録に成功しました。' });
    }
    catch (err) {
        res.status(500).json({ error: 'データベースエラーが発生しました。' });
    }
});
// ログイン処理を行うルート
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE email = ?;';
        const params = [email];
        const rows = await (0, db_1.query)(sql, params);
        const user = rows[0];
        // ユーザーが存在しない場合は401エラーを返す
        if (!user) {
            res.status(401).json({ error: 'ユーザーが存在しません。' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        // パスワードが不一致の場合は401エラーを返す
        if (!isMatch) {
            res.status(401).json({ error: 'パスワードが間違っています。' });
            return;
        }
        // パスワードが一致した場合は認証トークンを生成する
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        // 認証トークンをクッキーに保存する（ブラウザへ指示を出す）
        res.cookie('authToken', token, {
            httpOnly: true, // JavaScriptからのアクセスを禁止する（XSS対策）
            secure: process.env.NODE_ENV === 'production', // 本番環境では暗号化されたHTTPSでのみ送信する（盗聴リスク低減）
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 本番環境では別サイトからのリクエスト時にクッキーを送信しない（CSRF対策）
            maxAge: 60 * 60 * 1000, // 有効期限（1時間）
        });
        // ステータスコードのみ返却する（認証トークンはクッキー経由で返却する）
        res.status(200).json({ message: 'ログインに成功しました。' });
    }
    catch (err) {
        res.status(500).json({ error: 'データベースエラーが発生しました。' });
    }
});
// ログアウト処理を行うルート
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'ログアウトしました。' });
});
// ログイン済みかどうかを確認するルート
router.get('/check', jwt_1.verifyToken, (req, res) => {
    res.status(200).json({ message: 'ログイン済みです。' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map