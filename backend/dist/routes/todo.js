"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
// ルーティング操作用オブジェクト
const router = (0, express_1.Router)();
// サーバーエラーを処理する関数
function handleServerError(res, err, message = 'サーバーエラー') {
    console.error(err);
    res.status(500).json({ error: message });
}
// ToDoの全データを返すルート
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT id, title, completed, created_at AS createdAt, updated_at AS updatedAt FROM todos WHERE user_id = ? ORDER BY createdAt DESC';
        const params = [req.user.id];
        const rows = await (0, db_1.query)(sql, params);
        res.status(200).json(rows);
    }
    catch (err) {
        handleServerError(res, err);
    }
});
// ToDoを追加するルート
router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title.trim()) {
        res.status(400).json({ error: 'ToDoを入力してください。' });
        return;
    }
    if (title.trim().length > 50) {
        res.status(400).json({ error: 'ToDoは50文字以内で入力してください。' });
        return;
    }
    try {
        const sql = 'INSERT INTO todos (title, completed, created_at, user_id) VALUES (?, ?, ?, ?)';
        const params = [title, false, new Date(), req.user.id];
        await (0, db_1.exec)(sql, params);
        res.status(201).json({ message: 'ToDoを追加しました。' });
    }
    catch (err) {
        handleServerError(res, err);
    }
});
// ToDoを更新するルート
router.put('/:id', async (req, res) => {
    const { title, completed } = req.body;
    if (!title.trim()) {
        res.status(400).json({ error: 'ToDoを入力してください。' });
        return;
    }
    if (title.trim().length > 50) {
        res.status(400).json({ error: 'ToDoは50文字以内で入力してください。' });
        return;
    }
    try {
        const sql = 'UPDATE todos SET title = ?, completed = ? WHERE id = ? AND user_id  = ?';
        const params = [title, completed, req.params.id, req.user.id];
        const result = await (0, db_1.exec)(sql, params);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: '指定されたToDoが見つかりません。' });
            return;
        }
        res.status(200).json({ message: 'ToDoを更新しました。' });
    }
    catch (err) {
        handleServerError(res, err);
    }
});
// ToDoを削除するルート
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM todos WHERE id = ? AND user_id  = ?';
        const params = [req.params.id, req.user.id];
        const result = await (0, db_1.exec)(sql, params);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: '指定されたToDoが見つかりません。' });
            return;
        }
        res.status(200).json({ message: 'ToDoを削除しました。' });
    }
    catch (err) {
        handleServerError(res, err);
    }
});
exports.default = router;
//# sourceMappingURL=todo.js.map