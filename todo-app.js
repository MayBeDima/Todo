(function () {

  let todoArr = [];

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let btnWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    btnWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    btnWrapper.append(button);
    form.append(input);
    form.append(btnWrapper);

    button.setAttribute("disabled", "disabled");

    return {
      form,
      input,
      button
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  let changeItemDone = (arr, item) => {
    arr.map(obj => {
      if (obj.id === item.id && obj.done === false) {
        obj.done = true;
      } else if (obj.id === item.id && obj.done === true) {
        obj.done = false;
      }
    })
  }

  function createTodoItem(name) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    let randomId = Math.random() * 15.75;
    item.id = randomId.toFixed(2);

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function () {
      todoArr = JSON.parse(localStorage.getItem(key));
      item.classList.toggle('list-group-item-success');
      changeItemDone(todoArr, item);
      localStorage.setItem(key, JSON.stringify(todoArr));
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        todoArr = JSON.parse(localStorage.getItem(key));

        let newList = todoArr.filter(obj => obj.id !== item.id);
        localStorage.setItem(key, JSON.stringify(newList));
        item.remove();
      };
    });

    return {
      item,
      doneButton,
      deleteButton,
      buttonGroup
    };
  }

  function createTodoApp(container, title = 'Список дел', arrayTodo = [], key) {

    const arrayWithId = arrayTodo.map ( (todo) => {
      return {
        ...todo, id:Math.random().toString()
      }
    })

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.input.addEventListener('input', function () {
      todoItemForm.button.removeAttribute("disabled", "disabled");
      if (!todoItemForm.input.value) {
        todoItemForm.button.setAttribute("disabled", "disabled");
      }
    })

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      todoList.append(todoItem.item);

      let localStorageData = localStorage.getItem(key);

      if (localStorageData == null) {
        todoArr = [];
      } else {
        todoArr = JSON.parse(localStorageData);
      }

      let createItemObj = (arr) => {
        let itemObj = {};
        itemObj.name = todoItemForm.input.value;
        itemObj.id = todoItem.item.id;
        itemObj.done = false;

        arr.push(itemObj);
      }

      createItemObj(todoArr);
      localStorage.setItem(key, JSON.stringify(todoArr));

      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute("disabled", "disabled");
    });


    // ----------------------------------------------------------------------------------------

    (function () {

      if (localStorage.getItem(key)) return;

      if (arrayWithId.length === 0) return;

      let createItemObj = (arr) => {

        let itemObj1 = {};

        for (let i = 0; i < arrayWithId.length; i++) {

          itemObj1 = arrayWithId[i];

          arr.push(itemObj1);
        }
      }

      createItemObj(todoArr);
      localStorage.setItem(key, JSON.stringify(todoArr));
    })()

    // ---------------------------------------------------------------------------------------

    if (localStorage.getItem(key)) {
      todoArr = JSON.parse(localStorage.getItem(key));

      for (let obj of todoArr) {
        let todoItem = createTodoItem(todoItemForm.input.value);

        todoItem.item.textContent = obj.name;
        todoItem.item.id = obj.id;

        if (obj.done === true) {
          todoItem.item.classList.add('list-group-item-success');
        } else {
          todoItem.item.classList.remove('list-group-item-success');
        }

        todoList.append(todoItem.item);
        todoItem.item.append(todoItem.buttonGroup);
      }
    }

  };

  window.createTodoApp = createTodoApp;
})();
