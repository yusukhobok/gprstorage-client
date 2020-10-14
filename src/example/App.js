import React from "react";
import axios from "axios";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ListGroup from "react-bootstrap/ListGroup";

import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";
import TodoMessage from "./TodoMessage";
import TodoList from "./TodoList";
import LoginForm from "./LoginForm";

const API_URL = "https://boiling-woodland-05459.herokuapp.com/api/";
const API_URL_CATEGORIES =
  "https://boiling-woodland-05459.herokuapp.com/categories/";
const API_URL_AUTH = "https://boiling-woodland-05459.herokuapp.com/auth/token/";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token: localStorage.getItem("token"),
      wrongLoginOrPassword: false,
      loading: true,
      isError: false,
      errorMessage: "",
      showCompleted: false,
      draggable: false,
      currentCategory: 1,
      categories: [],
      todos: [],
    };

    const TIMER_DELAY = 1 * 60 * 1000;
    this.timer = setInterval(this.handleTimer, TIMER_DELAY);
  }

  componentDidMount() {
    if (this.state.token !== null) {
      this.refreshTodos(true);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.token !== this.state.token) {
      if (this.state.token !== null) {
        this.refreshTodos(true);
      } else {
        this.setState((prevState) => {
          return {
            ...prevState,
            categories: [],
            todos: [],
          };
        });
      }
    }
  }

  handleTimer = () => {
    if (this.state.token !== null) {
      if (!this.state.loading) {
        this.refreshTodos(false);
      }
    }
  };

  setToken = (token) => {
    if (token === null) localStorage.removeItem("token");
    else localStorage.setItem("token", token);
    this.setState((prevState) => {
      return {
        ...prevState,
        token: token,
        wrongLoginOrPassword: false,
      };
    });
  };

  getTokenInfo = () => {
    return { headers: { Authorization: "Token " + this.state.token } };
  };

  login = async (username, password) => {
    try {
      const data = { username, password };
      const res = await axios.post(API_URL_AUTH + "login/", data);
      const token = res.data["auth_token"];
      this.setToken(token);

      this.refreshTodos(true);
    } catch (error) {
      this.setState((prevState) => {
        return {
          ...prevState,
          wrongLoginOrPassword: true,
        };
      });
    }
  };

  logout = async () => {
    try {
      await axios.post(API_URL_AUTH + "logout/", null, this.getTokenInfo());
      this.setToken(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  //Удаление тех дел, которых уже нет на сервере
  removeOldTodos = (todosFromAPI) => {
    const filteredTodos = this.state.todos.filter((item) => {
      const id = item.id;
      const index = todosFromAPI.findIndex((item) => item.id === id);
      return index !== -1;
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        todos: filteredTodos,
      };
    });
  };

  //Добавление тех дел, которые появились на сервере
  addNewTodos = (todosFromAPI) => {
    const filteredTodosFromAPI = todosFromAPI.filter((item) => {
      const id = item.id;
      const index = this.state.todos.findIndex((item) => item.id === id);
      return index === -1;
    });
    this.setState((prevState) => {
      return {
        ...prevState,
        todos: prevState.todos.concat(filteredTodosFromAPI),
      };
    });
  };

  //чтение списка дел с сервера
  getTodosFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL, this.getTokenInfo());
      let todosFromAPI = responce.data.slice();

      // todosFromAPI = todosFromAPI.map((item) => {
      //   return {
      //     ...item,
      //     order: item.id
      //   }
      // })
      return todosFromAPI;
    } catch (error) {
      throw new Error("Ошибка доступа к данным");
    }
  };

  //чтение списка категорий с сервера
  getCategoriesFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL_CATEGORIES, this.getTokenInfo());
      const categoriesFromAPI = responce.data.slice();
      this.setState((prevState) => {
        return {
          ...prevState,
          categories: categoriesFromAPI,
        };
      });
    } catch (error) {
      throw new Error("Ошибка доступа к данным категорий");
    }
  };

  //синхронизация списка дел (между текущим состоянием и тем, что было на сервере)
  updateTodosToAPI = async (currentTodosFromAPI) => {
    if (this.state.todos.length === 0) return;
    try {
      // проверить, что в currentTodoFromAPI даты ранее, чем у нас
      const newersFromAPI = currentTodosFromAPI.filter((item) => {
        const id = item.id;
        const index = this.state.todos.findIndex((item) => item.id === id);
        if (index === -1) return false;
        const serverDate = Date.parse(item.lastChangeDateTime);
        const localDate = Date.parse(
          this.state.todos[index].lastChangeDateTime
        );
        // console.log(serverDate, localDate);
        return serverDate > localDate;
      });
      console.log("newersFromAPI", newersFromAPI);

      const newersFromLocal = this.state.todos.filter((item) => {
        const id = item.id;
        const index = currentTodosFromAPI.findIndex((item) => item.id === id);
        if (index === -1) return false;
        const localDate = Date.parse(item.lastChangeDateTime);
        const serverDate = Date.parse(
          currentTodosFromAPI[index].lastChangeDateTime
        );
        // console.log(serverDate, localDate);
        return localDate > serverDate;
      });
      console.log("newersFromLocal", newersFromLocal);

      if (newersFromLocal.length !== 0)
        await axios.put(API_URL, newersFromLocal, this.getTokenInfo());

      if (newersFromAPI.length !== 0)
        this.setState((prevState) => {
          return {
            ...prevState,
            todos: newersFromAPI,
          };
        });
    } catch (error) {
      throw new Error("Ошибка обновления данных");
    }
  };

  refreshTodos = async (isGetCategoriesFromAPI = false) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });

    try {
      const todosFromAPI = await this.getTodosFromAPI();
      this.removeOldTodos(todosFromAPI); //удаление дел, которых уже нет на сервере
      try {
        await this.updateTodosToAPI(todosFromAPI); //синхронизация дел между сервером и клиентом (локально)
        this.addNewTodos(todosFromAPI); // добавление на сервер новых дел (появившихся локально)
        this.setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
          };
        });
      } catch (error) {
        console.log(error.message);
        this.setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
            todos: todosFromAPI,
          };
        });
      }

      if (isGetCategoriesFromAPI) this.getCategoriesFromAPI();
    } catch (error) {
      console.log(error.message);
      this.setToken(null);
      // this.setState(prevState => {
      //   return {
      //     ...prevState,
      //     loading: false,
      //     isError: true,
      //     errorMessage: error.message,
      //     todos: [],
      //   }
      // });
    }
  };

  onChangeTodoCompleted = (todo) => {
    const now = new Date();
    const newTodo = {
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
      lastChangeDateTime: now.toISOString(),
      order: todo.order,
      category: todo.category,
    };
    // console.log(newTodo);

    this.setState((prevState) => {
      return {
        ...prevState,
        todos: prevState.todos.map((item) => {
          if (item.id === newTodo.id) return newTodo;
          else return item;
        }),
      };
    });
  };

  //удаление дела
  onDelete = async (todo) => {
    this.setState((prevState) => {
      return { ...prevState, loading: true };
    });
    try {
      await axios.delete(API_URL + todo.id + "/", this.getTokenInfo());
      this.setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          todos: prevState.todos.filter((item) => item.id !== todo.id),
        };
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  onChangeShowCompleted = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        showCompleted: !prevState.showCompleted,
      };
    });
  };

  onChangeDraggable = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        draggable: !prevState.draggable,
      };
    });
  };

  onChangeCurrentCategory = (newCurrentCategory) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        currentCategory: newCurrentCategory,
      };
    });
  };

  //добаление нового дела
  onAddTodo = async (newTitle) => {
    const found = this.state.todos.find(
      (item) => item.title.toUpperCase() === newTitle.toUpperCase()
    );
    if (found === undefined || found.category !== this.state.currentCategory) {
      const orders = this.state.todos.map((item) => item.order);
      const maxOrder = Math.max(...orders);

      const now = new Date();
      const newTodo = {
        title: newTitle,
        isCompleted: false,
        lastChangeDateTime: now.toISOString(),
        order: maxOrder + 1,
        category: this.state.currentCategory,
      };

      this.setState((prevState) => {
        return { ...prevState, loading: true };
      });

      try {
        const res = await axios.post(API_URL, newTodo, this.getTokenInfo());
        const newTodoFromAPI = res.data;

        let newTodos = this.state.todos.slice();
        newTodos.push(newTodoFromAPI);
        this.setState((prevState) => {
          return {
            ...prevState,
            todos: newTodos,
            loading: false,
          };
        });
      } catch (error) {
        console.log(error.message);
      }
    } else if (
      found !== undefined &&
      found.category === this.state.currentCategory &&
      found.isCompleted
    ) {
      const now = new Date();
      const newTodo = {
        id: found.id,
        title: found.title,
        isCompleted: false,
        lastChangeDateTime: now.toISOString(),
        order: found.order,
        category: found.category,
      };
      // console.log(newTodo);

      this.setState((prevState) => {
        return {
          ...prevState,
          todos: prevState.todos.map((item) => {
            if (item.id === newTodo.id) return newTodo;
            else return item;
          }),
        };
      });
    }
  };

  changeTodos = (newVisibleTodos) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        todos: prevState.todos.map((item) => {
          const newTodo = newVisibleTodos.find((item2) => item2.id === item.id);
          if (newTodo === undefined) return item;
          else return { ...item, order: newTodo.order };
        }),
      };
    });
  };

  sortTodosInAlphabeticalOrder = () => {
    let newTodos = this.state.todos.slice();

    newTodos.sort((a, b) => {
      if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
      if (a.title.toUpperCase() === b.title.toUpperCase()) return 0;
      if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
      return 0;
    });

    newTodos = newTodos.map((item, index, array) => {
      return { ...item, order: index };
    });

    this.setState((prevState) => {
      return {
        ...prevState,
        todos: newTodos,
        loading: false,
      };
    });
  };

  render() {
    if (this.state.token === null) {
      return (
        <LoginForm
          loginSubmit={this.login}
          wrongLoginOrPassword={this.state.wrongLoginOrPassword}
        />
      );
    } else {
      let todoList;
      if (this.state.isError) {
        todoList = (
          <TodoMessage msg={this.state.errorMessage} variant="danger" />
        );
      } else if (this.state.loading) {
        todoList = <TodoMessage msg="Загрузка..." variant="info" />;
      } else {
        todoList = (
          <>
            <ListGroup.Item>
              <TodoSettings
                showCompleted={this.state.showCompleted}
                draggable={this.state.draggable}
                onChangeShowCompleted={this.onChangeShowCompleted}
                onChangeDraggable={this.onChangeDraggable}
                onRefresh={this.refreshTodos}
                categories={this.state.categories}
                currentCategory={this.state.currentCategory}
                onChangeCurrentCategory={this.onChangeCurrentCategory}
                onSortTodosInAlphabeticalOrder={
                  this.sortTodosInAlphabeticalOrder
                }
                logout={this.logout}
              />
            </ListGroup.Item>

            <TodoList
              todos={this.state.todos}
              currentCategory={this.state.currentCategory}
              showCompleted={this.state.showCompleted}
              draggable={this.state.draggable}
              onChangeTodoCompleted={this.onChangeTodoCompleted}
              onDelete={this.onDelete}
              onSortEnd={this.changeTodos}
            />

            <ListGroup.Item>
              <AddTodo onAddTodo={this.onAddTodo} />
            </ListGroup.Item>
          </>
        );
      }

      return (
        <div className="App">
          <header className="App-header">{todoList}</header>
        </div>
      );
    }
  }
}

export default App;
