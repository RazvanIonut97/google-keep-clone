'use strict'
const url = 'http://localhost:3000/todos';
let currentCardId = 0;
const createTodoText = document.querySelector('#create-todo-text');
const createTodoCard = document.querySelector('#create-todo-card');
const createTodoButton = document.querySelector('#create-todo-btn');
const createTodoTitle = document.querySelector('#create-todo-title');
const searchInput = document.querySelector('#search-input');
const popUp = document.querySelector('#pop-up');
const popUpTitle = document.querySelector('#edit-title');
const popUpText = document.querySelector('#edit-text');
const editTodoButton = document.querySelector('#edit-todo-btn');
const whiteButton = document.querySelector('#white-btn');
const redButton = document.querySelector('#red-btn');
const blueButton = document.querySelector('#blue-btn');
const greenButton = document.querySelector('#green-btn');
const deleteTodoButton = document.querySelector('#delete-todo');
const changeBackgroundButton = document.querySelector('#edit-backgound');
const fileSelector = document.createElement('input');
fileSelector.setAttribute('type', 'file');
fileSelector.setAttribute('id', '#file-input');
fileSelector.setAttribute('accept', 'image/*');
const editToDoCard = document.querySelector('#edit-todo');
window.addEventListener('click', function(e) {
    if (popUp.style.display == 'flex') {
        if (!editToDoCard.contains(e.target)) {
            editTodo();
        }
    }
})
window.addEventListener('click', function(e) {
    if (createTodoTitle.value != '' || createTodoText.value != '') {
        if (!createTodoCard.contains(e.target)) {
            createTodo();
        }
    }
})
createTodoButton.addEventListener('click', createTodo);
searchInput.addEventListener('keyup', filterTodos);
editTodoButton.addEventListener('click', editTodo);
whiteButton.addEventListener('click', () => changeColor('white'));
redButton.addEventListener('click', () => changeColor('red'));
blueButton.addEventListener('click', () => changeColor('blue'));
greenButton.addEventListener('click', () => changeColor('green'));
deleteTodoButton.addEventListener('click', () => deleteTodo());
changeBackgroundButton.addEventListener('click', () => fileSelector.click());
fileSelector.addEventListener('change', () => changeBackground());

displayTodos();

function createTodo() {
    const title = document.querySelector('#create-todo-title').value;
    const text = document.querySelector('#create-todo-text').value;
    const color = 'white';
    const background = '';
    const payload = {title,text,color,background};

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(() => {
        displayTodos();
    });
}

async function displayTodos() {
    const todos = await getTodos();
    const todosHtml = createTodosHtml(todos);
    const section = document.querySelector('#todo-list');
    section.innerHTML = null;
    createTodoText.value = '';
    createTodoTitle.value = '';
    section.append(todosHtml);
}

function getTodos() {
    return fetch(url).then((res) => res.json());
}
function createTodosHtml(todos) {
    const fragment = document.createDocumentFragment();

    todos.forEach((todo) => {
        const div = document.createElement('div');
        const title = document.createElement('h3');
        const text = document.createElement('p');
        const img = document.createElement('img');

        div.classList.add('todo-card');
        div.classList.add(todo.color);
        div.addEventListener('click', () => {
            setCurrentId(todo.id)
        });
        div.setAttribute('id', todo.id);
        title.classList.add('card-titile');
        title.innerText = todo.title;
        text.classList.add('card-text');
        text.innerText = todo.text;
        img.classList.add('card-img');
        img.setAttribute('src', todo.background)

        div.appendChild(title);
        div.appendChild(text);
        div.appendChild(img);

        fragment.append(div);
    });
    return fragment;
}
async function filterTodos() {
    const todos = await getFiltredTodos();
    const todosHtml = createTodosHtml(todos);
    const section = document.querySelector('#todo-list');

    section.innerHTML = null;
    section.append(todosHtml);

}

function getFiltredTodos() {
    const searchString = document.querySelector('#search-input').value;
    return fetch(`${url}/?title_like=${searchString}`).then((res) => res.json());
}

async function setCurrentId(id) {

    const currentCard = await fetch(`${url}/${id}`).then((res) => res.json());
    popUpTitle.value = currentCard.title;
    popUpText.value = currentCard.text;
    popUp.style.display = 'flex';
    currentCardId = id;
    const currentTodo = document.getElementById(id);
}

function editTodo() {
    const title = popUpTitle.value;
    const text = popUpText.value;

    fetch(`${url}/${currentCardId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                text: text
            })
        })
        .then(() => {
            popUp.style.display = "none";
            displayTodos();
            popUpTitle.value = null;
            popUpText.value = null;
        })
}

function changeColor(color) {
    fetch(`${url}/${currentCardId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                color: color
            })
        })
        .then(() => {
            displayTodos();
        })

}

function deleteTodo() {
    fetch(`${url}/${currentCardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            popUp.style.display = "none";
            displayTodos();

        })

}

function changeBackground() {
    const reader = new FileReader();
    reader.readAsDataURL(fileSelector.files[0]);
    reader.addEventListener('load', () => {
        fetch(`${url}/${currentCardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    background: reader.result
                })
            })
            .then(() => {
                displayTodos();
            })
    })

}