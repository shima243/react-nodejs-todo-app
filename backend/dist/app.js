"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const todo_1 = __importDefault(require("./routes/todo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const jwt_1 = require("./jwt");
const path_1 = __importDefault(require("path"));
// .envファイルを読み込む
dotenv_1.default.config();
// 環境変数からポート番号を取得する
const port = Number(process.env.PORT) || 3000;
// 環境変数からフロントエンドのURLを取得する
const frontUrl = process.env.FRONT_URL ?? 'http://localhost:5173';
// Webサーバーの土台を作成する
const app = (0, express_1.default)();
// CORSの設定を行う
app.use((0, cors_1.default)({
    origin: frontUrl, // 許可するオリジン
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 許可するHTTPメソッド
    credentials: true // 認証情報の送信を許可する
}));
// JSON形式のリクエストボディを解析するミドルウェアを追加する
app.use(express_1.default.json());
// クッキーを解析するミドルウェアを追加する
app.use((0, cookie_parser_1.default)());
// ToDoのCRUD機能を担当する各ルートを読み込む
app.use('/api/todos', jwt_1.verifyToken, todo_1.default);
// 認証機能を担当する各ルートを読み込む
app.use('/api/auth', auth_1.default);
// 本番環境ではフロントエンドのビルド済みファイルを配信する
if (process.env.NODE_ENV === 'production') {
    const staticDir = path_1.default.join(__dirname, '../../frontend/dist');
    app.use(express_1.default.static(staticDir));
    app.get('/{*splat}', (_, res) => res.sendFile(path_1.default.join(staticDir, 'index.html')));
}
// 定義したルート以外へのアクセスに対する処理（404 Not Found）
app.use((req, res) => {
    res.status(404).set('Content-Type', 'text/html; charset=utf-8');
    res.send('<h1>ページが見つかりませんでした。</h1>');
});
// アプリ終了時にDB接続プールを安全に破棄する
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
    process.on(signal, async () => {
        console.log(`\n${signal}を受信。アプリケーションの終了処理中...`);
        await (0, db_1.closePool)();
        process.exit();
    });
});
// Webサーバーを指定したポートで起動する
app.listen(port, () => {
    console.log(`Webサーバーが起動しました。`);
});
//# sourceMappingURL=app.js.map