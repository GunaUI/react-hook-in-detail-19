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
* Here with the help of useEffect we will fix this issue... once we git the response lets call the useEffect and update pushTodoList only/immediately if the submittedStatus value changes