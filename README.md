# React hook in detail

## The "Rules of Hooks"

* You must only use useState and all the other hooks you'll learn about in this module at the top level of your component function and that already contains a lot of important things. Important is that it has to be a component function, so such a function which takes props and returns JSX, a function which React can use to render a component. It has to be such a function, you can't use another function and call a hook in there.

* You must only call useState directly in your top level of the function body.You must not call in a function of the function

* You must also not call it in an if statement, The same goes for for loops also.

* only call useState at the root level of this function 

##  Sending Data via Http

```jsx
axios.post('https://test-21ad7.firebaseio.com/todos.json',{name : currentTodoStateName} )
    .then(res =>{
        console.log(res);
    })
    .catch(error =>{
        console.log(error);
    })
```
## The useEffect() Hook - alternative to ComponentDidMount(classbased component)
* We storing to do on server typically we also want to fetch them and let's say we want to fetch them when this component gets loaded.

* Well for that, we can use another hook and that is the so-called useEffect hook.

* Now useEffect, just as useState has to be imported from React
```jsx
import React, { useState, useEffect } from 'react';
```
* to this useEffect function here, you pass a function that should be executed.
```jsx
useEffect(() => {

});
```
* Now here, I'll pass a function with no arguments and in this function, you put your code that for example should be executed when this component loads for the first time

* So this function here will execute when this component runs for the first time

* so things like make HTTP requests or manipulate the DOM on your own or send analytics data to some server, don't do these things here in the render function, do them in a callback function passed to useEffect instead.

```jsx
useEffect(() => {
        axios.get('https://test-21ad7.firebaseio.com/todos.json')
        .then(result => {
            console.log(result)
        })
    });
```
* So this is OK because this again, this useEffect hook here hooks into React's internals and makes sure that this code executes at the right time which is after this render cycle finished, so that this can run in a high performant way and that the UI is always updated correctly and you don't end up with some strange state changes behind the scenes outside of what React expected or anything like that.

```jsx
    const [currentTodoStateName, setTodoName] = useState('');

    const [currentTodoListState, pushTodoList] = useState([]);

    useEffect(() => {
        axios.get('https://test-21ad7.firebaseio.com/todos.json')
        .then(result => {
            const todoData = result.data;
            const todos = []
            for (const key in todoData){
                todos.push({id : key , name: todoData[key].name})
            }
            // Calling pushTodoList is absolutely fine,it would not be OK to call useState in here or to call useEffect in here because of the rules of hooks
            pushTodoList(todos);
        })
    });
```
## Controlling Effect Execution

* So I added the useEffect hook to cause side effects, it worked but well we caused quite a big side effect because we entered an infinite loop.

* The reason for that is that useEffect does not only run once, like for example componentDidMount did but it runs ofter every render cycle.

* Now how can we avoid doing that? Well useEffect takes actually two arguments.

* It does not just take this first argument which is the function it executes,it takes a second argument instead which is an array of values.

* we want to have a look at before it executes this function(ie first param) and only if the values we have a look at changed, only in this case this effect should run again.

```jsx
useEffect(() => {
        axios.get('https://test-21ad7.firebaseio.com/todos.json')
        .then(result => {
            console.log(result)
            const todoData = result.data;
            const todos = []
            for (const key in todoData){
                todos.push({id : key , name: todoData[key].name})
            }
            pushTodoList(todos);
        })
    },[currentTodoStateName]);
```
* if currentTodoStateName value change run execute this useEffect function.

* the second argument you pass to useEffect is an array where you list all the values, all the variables you want to look for and only if a value passed here in this second argument array, only if one of the values you pass in here changed, this function here, this first argument to useEffect will run again.

* So if you have multiple elements here, multiple things you're watching for, then any change in any item will be enough to run this again.

* Now if you only want to run an effect, on mounting ie on loading , well then you pass an empty array here because what you're saying here is this should only run when the items in here, when one of the items in here changed and if you pass no items, well then React hasn't anything to watch and therefore it will not detect any changes and therefore this first argument function will never run again. So if you want to replicate componentDidMount, then pass an empty array

```jsx
useEffect(() => {
        axios.get('https://test-21ad7.firebaseio.com/todos.json')
        .then(result => {
            console.log(result)
            const todoData = result.data;
            const todos = []
            for (const key in todoData){
                todos.push({id : key , name: todoData[key].name})
            }
            pushTodoList(todos);
        })
    },[]);
```
* if you want to replicate componentDidMount in combination with componentDidUpdate with an if check included in it, then you should add watch param (currentTodoStateName) as second argument.

## Effect Cleanup

* Now what about componentDidUnmount, what if you want to run something whenever a component gets removed or in general, what if you have side effects that require cleanup work ??

* You can return something in this function you pass as a first argument.
```jsx
const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);
```
* Here before adding addEventListener we want to clean(remove) the old EventListener by using return function, removeEventListener will get called before addEventListener.

* And the second paramter [] (arrya) indicates this first paramter addEventListener will be called on component mounting (ie added) and return function (clean up) will be called only on component unmounting(ie removed)

## Converting the "App" Component

* Header.js
```jsx
import React from 'react';

const header = props => (
    <header>
        <button onClick={props.onLoadTodos}>Todo List</button> | <button onClick={props.onLoadAuth}>Auth</button>
    </header>
);

export default header;
```
* Auth.js
```jsx
import React from 'react'

const auth = props => (
    <h1>Auth Component</h1>
);

export default auth;
```
* First of all convert app.js to a hook-based functional component as well and thereafter, let's make sure that we can manage that auth status and use that in the different parts of our app

```jsx
const app = props =>(
      <div className="App">
        <Header/>
        <hr/>
        <Todo/>
        <Auth/>
      </div>
    );

export default app;
```

* The more interesting part will be that we should able to switch between these two pages now, that this is a functional component and for this, we'll need to manage state.

```jsx
import React, { useState } from 'react';
import Todo from './components/Todo';
import Header from './components/Header';
import Auth from './components/Auth';

const app = props => {

  const [page, setPage] = useState('auth')

  const switchPage = (PageName) => {
    setPage(PageName);
  };

  return(
    <div className="App">
      <Header 
      onLoadTodos={switchPage.bind(this, 'todos')} 
      onLoadAuth={switchPage.bind(this, 'auth')}
      />
      <hr/>
      {page === 'auth' ? <Auth/> : <Todo/>}
    </div>
  )

};
  
export default app;
```
## The useContext() Hook

* Lets add some fake auth mechanism in auth component
```jsx

```
* Now what I want to do here is, whenever I press this button, I obviously set the state to being logged in and I want to set the state through the context API.
*************************************************************************************************************************************************************
* From Section 7 Deepdive into React Js : Now React create context actually allows us to initialize our context with a default value because what
the context in the end is is a globally available Javascript object

* which can be passed between React components without using props, behind the scenes so to say. So you can initialize as with any value you want.

* if I initialize my default value with everything I want to be able to access on this context from different components in my application

*  Now authContext can be used as a component and it should wrap and that's important, it should wrap all the parts of your application that need access to this context.

* Refer Dive deep fully including Legacy ...


*************************************************************************************************************************************************************

* This API which allows you to pass state or values around your component tree without having to pass props all the time

```jsx
import React from 'react';

const authContext = React.createContext(false);

export default authContext;

```
* Now let us use this context in app.js
```jsx
import AuthContext from './auth-context'

const [page, setPage] = useState('auth');

const switchPage = (PageName) => {
    setPage(PageName);
};

return(
    <div className="App">
        <AuthContext.Provider>
            <Header 
            onLoadTodos={switchPage.bind(this, 'todos')} 
            onLoadAuth={switchPage.bind(this, 'auth')}
            />
            <hr/>
            {page === 'auth' ? <Auth/> : <Todo/>}
        </AuthContext.Provider>
     </div>
)

```
* here have to set up a so-called provider. For that we simply wrap everything, which should be able to receive the context.
* Now anyware inside the header component we can consume the false value which is set above
* Now we have to update the auth status to true when the user clicks login
```jsx
const [authStatus, setPageStatus] = useState(false);

const login = () => {
    setPageStatus(true);
  };

```
* Now we have to pass this authstatus and login function to  AuthContext.Provider
```jsx
<AuthContext.Provider value={{status : authStatus, loginFunc : login}}>
    <Header 
    onLoadTodos={switchPage.bind(this, 'todos')} 
    onLoadAuth={switchPage.bind(this, 'auth')}
    />
    <hr/>
    {page === 'auth' ? <Auth/> : <Todo/>}
</AuthContext.Provider>
```
* So now my context is actually a Javascript object which holds the current status, a boolean (true/false) and which holds the reference to a function which allows us to change that boolean. 

### Lets now use the context we holds now

* now want to access my context and we can do this with the help of a hook. The hook is called useContext and it does what the name implies.
```jsx
import React from 'react';

const authContext = React.createContext({status : false, loginFunc  : () => {}});

export default authContext;

```
* Now the thing is, there can be more than one context in React and therefore we need some identifier for the context we want to tap into here and the identifier is simply that context object we create here

* Now the values we enter here as starting values don't really matter because we overwrite them here in app.js anyways where I set this real value

* Now lets use the set authContext value in Auth.js 

```jsx
import React, {useContext} from 'react'

import AuthContext from '../auth-context';

const auth = props => {
    const authVal = useContext(AuthContext);

    return <button onClick={authVal.loginFunc}>Log in!!</button> ;
};


export default auth;
```
* I only want to unlock the to-do list button if we are authenticated and for this in the header, I also need to get access to authContext.
```jsx
import React, {useContext} from 'react';

import AuthContext from '../auth-context';

const header = props => {
    const authObj = useContext(AuthContext)
    return <header>
        { authObj.status ? <button onClick={props.onLoadTodos}>Todo List</button> : null} 
        <button onClick={props.onLoadAuth}>Auth</button>
    </header>
};

export default header;

```
* Now we can use the logedin Status in our header component.

## State and Effects Gotchas
* The problem we're facing is that at the point of time we click the button, we enter this function and this essentially is a closure which means that our variable values which we get from outside, like the todoName but also the todoList is logged in at the point of time this function, this button click
function here starts to execute and therefore both our first and the second todo we add build up on the same starting todoList.

* When you try to add continously todo with in a second we will able to see only the todo value added second not the first todo.. why ??? only on refresh we will able to see both the todo... how to fix this.

* One simple fix is add new use context about stubmit status which will start with null (Todo.js)
```jsx
const [submittedStatus, updateSubmitedStatus] = useState(null);

useEffect(() => {
        if(submittedStatus!=null){
            pushTodoList(currentTodoListState.concat(submittedStatus));
        }
    }, [submittedStatus]);

const addTodoListHandler = () => {
        
        axios.post('https://test-21ad7.firebaseio.com/todos.json',{name : currentTodoStateName} )
            .then(res =>{
                setTimeout(()=>{
                    const updatedTodoVal = {id : res.data.name , name: currentTodoStateName}
                    updateSubmitedStatus(updatedTodoVal);

                }, 300);
            })
            .catch(error =>{
                console.log(error);
            })
    }
```
* Here with the help of useEffect we will fix this issue... once we git the response lets call the useEffect and update pushTodoList only/immediately if the submittedStatus value changes.

## The useReducer() Hook

* let me introduce useReducer. Now if you went through the Redux sections in this course, you already know what a reducer is,

* useReducer allows us to bundle the logic for updating the state in one simple function. Now how can we use useReducer here?

```jsx
const todoListReducer = (state, action) => {
    switch(action.type) {
        case 'ADD':
            return state.concat(action.payload);
        case 'SET':
            return action.payload;
        case 'REMOVE':
            return state.filter((todo) => todo.id != action.payload.id);
        default:
            return state;
    }
  };
```

* The action basically will be an object with information about what to do and the state will be our latest state which we want to edit based on the action.

* useReducer is totally independent from Redux or React Redux, it's built into core React and it's a simple function that helps us manipulate state conveniently.

* now it's up to us to register this reducer and use it correctly.

* Now for that, we first of all use useReducer and there we first of all pass a reducer function, here I will pass todoListReducer, so I will pass this function as the first argument.

* The second argument can be our starting state.Now remember, I want to have a todoList here as state,so I will start with an empty array,

* Now the third argument could be an initial action we want to execute, so we could already pass in an action here with type add then some default item which we want to add but of course I don't want to do that here, I just want to initialize that like this.

```jsx
// const [todoList, setTodoList] = useState([]);

// useReducer is alternative to useState
const [todoListState , dispatchFunc] = useReducer(todoListReducer, []);
```
* useReducer is basically alternative to useState , So I can comment out this useState which is below
* Replace setTodoList with  dispatchFunc since we commented useState logic.
* On load component
```jsx
useEffect(() => {
    axios.get('https://test-3e15a.firebaseio.com/todos.json').then(result => {
      console.log(result);
      const todoData = result.data;
      const todos = [];
      for (const key in todoData) {
        todos.push({ id: key, name: todoData[key].name });
      }
      //setTodoList(todos);
      dispatchFunc({type:'SET',payload : todos});
    });
    return () => {
      console.log('Cleanup');
    };
  }, []);
```
* And also while add New item
```jsx
const todoAddHandler = () => {
    // setTodoState({
    //   userInput: todoState.userInput,
    //   todoList: todoState.todoList.concat(todoState.userInput)
    // });

    axios
      .post('https://test-3e15a.firebaseio.com/todos.json', { name: todoName })
      .then(res => {
        setTimeout(() => {
          const todoItem = { id: res.data.name, name: todoName };
          dispatchFunc({ type: 'ADD', payload: todoItem });
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  };

```
* On Remove item
```jsx
<ul>
{todoList.map(todo => (
    <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
    {todo.name}
    </li>
))}
</ul>
```
* Remove handler
```jsx
const todoRemoveHandler = todoId => {
    axios
        .delete(`https://test-3e15a.firebaseio.com/todos/${todoId}.json`)
        .then(res => {
        dispatch({ type: 'REMOVE', payload: todoId });
        })
        .catch(err => console.log(err));
};
```

## useReducer() vs useState()

* By using dispatch, we pass this on to a function which will always receive the latest state when it runs and then manipulate that state and return a new state and that we get the latest state is handled and guaranteed by React which hooks into its internal state management system and gives us that state.

* So therefore here, we can save the time of adding an extra effect and using useState with an extra state,instead here we can really just use that one reducer function

* React always gives us the latest state in there, we can always rely on working with the latest state here, so no matter how many items we add in one and the same timeout period, they will end up in the state correctly because for every run of this reducer function, this state will be the latest state snapshot
and not the state snapshot at the point of time we started some logic down there.

## Working with References and useRef()

*  You might remember that when using class-based components, we could use references to interact with inputs for example or interact with any element on our page.

* before hooks in functional components, this was not possible because functional components have no properties which we used to store the references

* Now with hooks though, we can start using refs, references in our functional components.

* So let's say for this input, we don't want to get the value and set the value through todoName like this XXXXXXXXX !!!!!
```jsx
<input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
```
* just add useRef
```jsx
const todoInputElRef = useRef()

<input
    type="text"
    placeholder="Todo"
    // onChange={inputChangeHandler}
    // value={todoName}
    ref={todoInputElRef} 
/>
```
* Now a connection is established between this input element and this constant(todoInputElRef) through useRef

* And now we can interact with that to get our entered name, our todoName.

* we use the internal state management of the input element and use a ref to extract its current value whenever we need it 
```jsx
const todoName = todoInputElRef.current.value;
```
## Preparing & Optimizing

* Class Setstate is handled by function's useState and lifecycle methods is handled by function's useEffect

* but one hook which can be very important for performance optimization is shouldComponentUpdate.

* In a class-based component, this allows us to define logic that decides whether this component and its child component tree will be re-rendered or not and using that correctly can give us a performance boost.

* Now we can also make sure that with functional components, we only re-render certain components if their value changed as we used in useEffect and a good example is our todoList

* Lets move our list alone to new functional component and then render ListComponent.

```jsx
import React, {} from 'react'

const list = props => {
    console.log('Rendering List ...');

    return <ul>
            {props.items.map(todo => (
                <li key={todo.id} onClick={props.OnclickRemoveHandler.bind(this, todo.id)}>
                {todo.name}
                </li>
            ))}
            </ul>
};

export default list;
```
* use this List component in todo list

```jsx
<list item={todoList} OnclickRemoveHandler={todoRemoveHandler}/>
```
* Currently it will rerender the componenet whe we add new item and when we try to remove a item . Now what can we optimize about this?

* Let add some validations to our input element ie show error if not valid value kind of thing

```jsx
import React, {useState} from 'react';

const [inputIsVaid , setInputIsValid] = useState(false);

const inputValidationHandler = event =>{
    if(event.target.value.trim() === ''){
        setInputIsValid(false);
    }else{
        setInputIsValid(true);
    }
}

<input
    type="text"
    placeholder="Todo"
    // onChange={inputChangeHandler}
    // value={todoName}
    ref={todoInputElRef} 
    onChange={inputValidationHandler}
    style={backgroundColor: inputIsVaid ? 'transparent': 'red' }
/>
```
* You will notice now is that as I type, rendering the list gets called again and again for each key press..

* Now re-rendering in React of course does not mean that the DOM is really rendered but the virtual DOM is re-rendered and React checks whether the real DOM needs to change. So we can improve the performance because this check is totally redundant,we know that there is no need in updating that list here 

* just to highlight this, this is not just a case for typing in an input. Whenever you set some state here in this component, React will re-render it and if that state does not directly affect this list, you want to make sure that this list does not unnecessarily get re-rendered.

* So how can we solve this?

##  Avoiding Unnecessary Re-Rendering

* Now to make sure that we don't unnecessarily re-render list, we can use another hook provided by React and that is the useMemo hook.

```jsx
import React, {useMemo} from 'react';

{
    useMemo(
        () => <list item={todoList} OnclickRemoveHandler={todoRemoveHandler}/>, [todoList]
    )
}


```
* memoization basically is all about caching values if their inputs don't change 

* When todoList and todoRemoveHandler, if these two inputs to this function ,  if these don't change, then we don't want to regenerate this.we just want to take the old stored cached,

* Now to tell you useMemo or React which inputs are important for this list, we have to add a second argument to useMemo because it can't infer this.

* and this argument is an array where we list all the arguments we want React to watch out for.here ..todoList

## Creating a Custom Hook

* you can create your own hooks. And creating your own hooks is super simple and allows you to extract functionality out of a component and share it across multiple components.

* Lets create a validation hook.
```jsx
import { useState } from 'react';

export const useFormInput = () => {
  const [value, setValue] = useState('');
  const [validity, setValidity] = useState(false);

  const inputChangeHandler = event => {
    setValue(event.target.value);
    if (event.target.value.trim() === '') {
      setValidity(false);
    } else {
      setValidity(true);
    }
  };

  return { value: value, onChange: inputChangeHandler, validity };
};

```
* your own hook functions, so functions which you intend to use as hooks should start with use, lowercase.

* Now we can use our own hook...

```jsx
import { useFormInput } from '../hooks/forms'

const todoInput = useFormInput();

<input
        type="text"
        placeholder="Todo"
        onChange={todoInput.onChange}
        value={todoInput.value}
        style={{ backgroundColor: todoInput.validity === true ? 'transparent' : 'red' }}
      />
```
