let messages = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/messages.json')
        .then(response => response.json())
        .then(data => {
            messages = data.messages;  // メッセージを保存
        })
        .catch(error => console.error('Failed to load messages:', error));

    if (!localStorage.getItem('user_id')) {
        userId = generateId("t-u-");
        localStorage.setItem('user_id', userId);
        displayMessage('ご協力ありがとうございます！',"left");
        displayMessage('タスク分解して欲しい大タスクは「アルバイトを始める」です！',"left");
        displayMessage("入力数は30個まででお願いします！","left")
        displayMessage('終了したい場合は「おしまい！」と送信して下さい！',"left");
        displayMessage('1個目はありますか？',"left");
        
    }else {
        displayMessage('おかえりなさい！',"left");
        displayMessage('終了したい場合は「おしまい！」と送信して下さい！',"left");
        
    }
});

function generateId(type) {
    // 簡単な例としてランダムなUUIDを生成
    return type + Math.random().toString(36).substr(2, 9);
}

function sendForm() {
    const inputField = document.getElementById('chat-input');
    const userInput = inputField.value.trim();
    inputField.value = ''; // Clear the input field after the input is processed
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];

    displayMessage(userInput,'right')
    if(userInput === "「おしまい！」"){
        sendEnd();
    }else if(userInput === "おしまい！"){
        sendEnd();
    }else{
        sendTask(userInput);
        displayMessage(message,'left')
        checkTaskCount();
    }

}

function sendEnd() {
    // ローカルストレージから user_id を削除
    localStorage.removeItem('user_id');

    // メッセージをユーザーに表示（任意）
    displayMessage('タスク分解の終了を確認しました！', 'left');
    displayMessage('クラウドワークスの方に戻り、「asdf」と入力しましたら、タスク終了になります！',"left");
    displayMessage('ありがとうございました！',"left");

}

// タスクをサーバーに送信する関数
function sendTask(task) {

    const userId = localStorage.getItem('user_id');  // ローカルストレージからユーザーIDを取得
    const taskId = generateId('t-');  // 新しいタスクIDを生成

    if (task) {
        // サーバーにタスクデータを送信
        fetch('/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                task_id: taskId,
                task: task
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error sending task:', error));
    }
}

function checkTaskCount() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        console.log('No user ID found in local storage.');
        return;
    }

    fetch(`/get_task_count/${userId}`)
        .then(response => response.json())
        .then(data => {
            displayMessage(data.count+1+"個目はありますか？","left");
        })
        .catch(error => console.error('Error fetching task count:', error));
}

function displayMessage(message, side) {
    var chatBox = document.getElementById('chat-box');
    var msgElement = document.createElement('div');
    msgElement.classList.add('message');
    msgElement.classList.add(side); // 'left' または 'right'
    msgElement.textContent = message;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function requestUserInput() {
    const numberInput = document.getElementById('number-input');
    numberInput.value = ''; // 入力フィールドをクリア
    numberInput.focus(); // 入力フィールドにフォーカスを当てる
}

