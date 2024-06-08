const express = require('express');
const fs = require('fs');
const mysql = require('mysql2'); //MySQLモジュールをインポート
const app = express();
app.use(express.static('public')); // 'public' ディレクトリを静的ファイル用ディレクトリとして設定

const PORT = 3000;

// MySQLデータベース接続の設定
const db = mysql.createConnection({
    host: 'localhost',
    user: 'guest', // データベースのユーザー名
    password: 'Os3tPzbipbxQCTar', // データベースのパスワード
    database: 'form' // データベース名
});

// データベースに接続
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// ミドルウェア設定
app.use(express.static('public'));
app.use(express.json());

// タスク送信のデータベース処理
app.post('/task', (req, res) => {
    const user_id = req.body.user_id;  // ユーザーIDをリクエストから取得
    const task_id = req.body.task_id;  // ユーザーIDをリクエストから取得
    const task = req.body.task;  // タスク名をリクエストから取得

    
    console.log(`Received task from user ${user_id}: ${task_id}: ${task}`);
    const sql = 'INSERT INTO tasks (user_id,task_id,task) VALUES (?, ?, ?)';
    db.query(sql, [user_id,task_id, task], (err, result) => {
        if (err) {
            console.error('Failed to insert task into database', err);
            res.status(500).send('Failed to save task');
            return;
        }
        res.send('Task saved');
    });
});

// ユーザーIDに基づくタスクの数を取得
app.get('/get_task_count/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT COUNT(*) AS taskCount FROM tasks WHERE user_id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).send('Database error');
            return;
        }
        const count = results[0].taskCount;
        res.send({ count });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Node.js Server Started: http://localhost:" + PORT);
    
});
