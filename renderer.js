const newTodoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todos');

newTodoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && newTodoInput.value.trim() !== '') {
    addTodo(newTodoInput.value.trim());
    newTodoInput.value = '';
  }
});

function addTodo(text) {
  const li = document.createElement('li');
  li.textContent = text;
  todoList.appendChild(li);
}
