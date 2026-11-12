"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = closePool;
exports.query = query;
exports.exec = exec;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
// .envファイルを読み込む
dotenv_1.default.config();
// DB接続設定
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306, // Macの場合は8889
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || ''
};
// DB接続プールを作成する
const pool = promise_1.default.createPool(dbConfig);
// DB接続プールを破棄する関数
async function closePool() {
    try {
        await pool.end();
        console.log('データベース接続プールを破棄しました。');
    }
    catch (err) {
        console.error('データベース接続プールの破棄中にエラーが発生しました：', err);
    }
}
// SQL文を実行する関数（SELECT）
async function query(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    }
    catch (err) {
        console.error('SQLの実行中にエラーが発生しました：', err);
        throw err;
    }
}
// SQL文を実行する関数（INSERT、UPDATE、DELETE）
async function exec(sql, params = []) {
    try {
        const [result] = await pool.execute(sql, params);
        return result;
    }
    catch (err) {
        console.error('SQLの実行中にエラーが発生しました：', err);
        throw err;
    }
}
//# sourceMappingURL=db.js.map