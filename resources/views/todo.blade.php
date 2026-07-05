<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Todo App</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            color: #172033;
        }

        main {
            width: min(920px, calc(100% - 32px));
            margin: 0 auto;
            padding: 40px 0;
        }

        header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 24px;
        }

        h1 {
            margin: 0 0 6px;
            font-size: 32px;
        }

        p {
            margin: 0;
            color: #62708a;
        }

        .status {
            padding: 8px 12px;
            border-radius: 6px;
            background: #e7f7ef;
            color: #156d3f;
            font-size: 14px;
            white-space: nowrap;
        }

        form {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 10px;
            padding: 16px;
            background: #ffffff;
            border: 1px solid #dde5f0;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        input {
            width: 100%;
            height: 42px;
            border: 1px solid #c8d2e2;
            border-radius: 6px;
            padding: 0 12px;
            font-size: 15px;
        }

        button {
            height: 42px;
            border: 0;
            border-radius: 6px;
            padding: 0 14px;
            background: #1f6feb;
            color: #ffffff;
            font-weight: 700;
            cursor: pointer;
        }

        button.secondary {
            background: #e8eef7;
            color: #172033;
        }

        .list {
            display: grid;
            gap: 10px;
        }

        .todo {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: #ffffff;
            border: 1px solid #dde5f0;
            border-radius: 8px;
        }

        .todo input {
            width: 20px;
            height: 20px;
        }

        .todo h2 {
            margin: 0 0 4px;
            font-size: 17px;
        }

        .todo small {
            color: #62708a;
        }

        .todo.done h2 {
            text-decoration: line-through;
            color: #62708a;
        }

        .empty {
            padding: 28px;
            text-align: center;
            background: #ffffff;
            border: 1px dashed #b9c6d8;
            border-radius: 8px;
            color: #62708a;
        }

        @media (max-width: 720px) {
            header,
            form {
                grid-template-columns: 1fr;
            }

            header {
                align-items: flex-start;
                flex-direction: column;
            }

            form button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
<main>
    <header>
        <div>
            <h1>Todo App</h1>
            <p>Aplikasi sederhana Laravel, Docker, Docker Compose, dan CI/CD.</p>
        </div>
        <div class="status" id="status">Checking API...</div>
    </header>

    <form id="todo-form">
        <input id="title" name="title" placeholder="Judul todo" required>
        <input id="description" name="description" placeholder="Deskripsi">
        <button type="submit">Tambah</button>
    </form>

    <section class="list" id="todos"></section>
</main>

<script>
    const statusEl = document.querySelector('#status');
    const listEl = document.querySelector('#todos');
    const formEl = document.querySelector('#todo-form');
    const titleEl = document.querySelector('#title');
    const descriptionEl = document.querySelector('#description');

    async function request(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`Request gagal: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    async function checkHealth() {
        const health = await request('/api/health');
        statusEl.textContent = `API ${health.status}`;
    }

    async function loadTodos() {
        const todos = await request('/api/todos');

        if (todos.length === 0) {
            listEl.innerHTML = '<div class="empty">Belum ada todo.</div>';
            return;
        }

        listEl.innerHTML = todos.map((todo) => `
            <article class="todo ${todo.completed ? 'done' : ''}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} data-toggle="${todo.id}">
                <div>
                    <h2>${escapeHtml(todo.title)}</h2>
                    <small>${escapeHtml(todo.description || '-')}</small>
                </div>
                <button class="secondary" data-delete="${todo.id}">Hapus</button>
            </article>
        `).join('');
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    formEl.addEventListener('submit', async (event) => {
        event.preventDefault();

        await request('/api/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: titleEl.value,
                description: descriptionEl.value,
            }),
        });

        formEl.reset();
        await loadTodos();
    });

    listEl.addEventListener('click', async (event) => {
        const toggleId = event.target.dataset.toggle;
        const deleteId = event.target.dataset.delete;

        if (toggleId) {
            await request(`/api/todos/${toggleId}`, {
                method: 'PATCH',
                body: JSON.stringify({ completed: event.target.checked }),
            });
            await loadTodos();
        }

        if (deleteId) {
            await request(`/api/todos/${deleteId}`, { method: 'DELETE' });
            await loadTodos();
        }
    });

    Promise.all([checkHealth(), loadTodos()]).catch((error) => {
        statusEl.textContent = error.message;
        statusEl.style.background = '#fde8e8';
        statusEl.style.color = '#9b1c1c';
    });
</script>
</body>
</html>
