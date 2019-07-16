# react-hook-in-detail-19

## What are react hooks ??

* So what are hooks? Well hooks are a new way or offer us a new way of writing our components.

* Thus far, of course we have functional and class-based components, right? 

    * Functional components receive props and you return some JSX code that should be rendered to the screen.They are great for presentation, so for rendering the UI part, not so much about the business logic and they are typically focused on one or a few purposes per component.

    * Class-based components on the other hand also will receive props but they also have this internal state, class-based components are the components which actually hold the majority of our business logic, so with business logic, I mean things like we make an HTTP request and we need to handle the response and to change the internal state of the app or maybe even without HTTP. A user fills out the form and we want to show this somewhere on the screen, we need state for this, we need class-based components for this and therefore we also typically use class based components to orchestrate our other components and pass our state down as props to functional components

* One problem that converting from one component form to the other is annoying.It's not really difficult but it is annoying.

*  lifecycle hooks can be hard to use right I should say. Obviously it's not hard to add componentDidMount and execute some code in there but knowing which lifecycle hook to use, when and how to use it correctly, that can be challenging especially in more complex applications

* wouldn't it be nice if we had one way of creating components and that super component could then handle both state and side effects like HTTP requests and also render the user interface ? Well this is exactly what hooks are all about.

* Hooks are extra features, extra functions we can call in our functional component which give us access to certain capabilities we could only use in class-based components before.

## Enabling Hook.
* Now to use React hooks, you need to use the right version.any version higher than 16.8 or at least 16.8 will do because the hooks feature was included in that version.
* Make sure you have the below dependencies and then run "npm install"
```jsx
"dependencies": {
    "react": "^16.8.0",
    "react-dom": "^16.8.0",
    "react-scripts": "2.1.1"
  }
```
##  The useState() Hook

* Lets create a simple todo component with a input box and add button to add the entered input to the list.
```jsx
import React from 'react';

const todo = props => {
    return <React.Fragment>
        <input type="text" placeholder="Todo"/>
        <button type="button">Add</button>
        <ul>

        </ul>
    </React.Fragment>;
};

export default todo;
```
* Now how can we make sure that we capture the user input? Historically, to capture the user input, we needed a class-based component right.

*  In a class-based component, what we did is we added the onChange listener to execute some handler method which would call set state, and then form that input element state property we could access the values. Now this is simply a syntax which is not available to us anymore because we're not in a class-based
component,there is no state property in this function.

* Now let's explore how we can do this with hooks.Instead we can use a new feature added by that alpha version of React, we import it from the React package and it's called useState

```jsx
import React, { useState } from 'react';
```
*  Now the use here at the beginning signals that this is a so-called hook function,it allows us to hook into a certain React functionality. 

*  How do we use this function?  what does this function do?

*  This function takes an initial state. So let's say we want to manage the user input, we could say initially that should be empty, so we pass an empty string.We can pass anything here by the way, an empty string, 0, null, an empty array, an empty object, whichever kind.

```jsx
const inputState = useState('');
```
* Now this alone doesn't do much because there is no magic connection between calling this function and this input here but useState will returns array.

* this array will have exactly two elements.
    * The first element is the current state,so in our case our full empty string as the first element.
    * The second element in this inputState array is a function which we can use to manipulate that state and this function is also given to us by React.
```jsx
<input type="text" placeholder="Todo" onChange={inputState[1]} value={inputState[0]}/>
```
* instead I want to execute my own function which then in turn executes this function with the updated state.

```jsx
const inputChangeHandler = (event) => {
    inputState[1](event.target.value);
}

<input type="text" placeholder="Todo" onChange={inputChangeHandler} value={inputState[0]}/>
```
### UseSteate Quick wrap up.

* useState function which is coming from React to which we pass our initial state and which then seems to return an array with two values.the first value is always our latest state and the second value in input state is a function which we can execute to update this state here with a new value. This is how useState hook works.

## Adding Array Destructuring

* since this input state in the end just holds an array, we can use a feature called array destructuring.

* Array destructuring allows us to pull out the elements in that array right at the time we get it and store them in separate variables or constants.

```jsx
const [currentTodoStateName, setTodoName] = useState('');

const inputChangeHandler = (event) => {
    setTodoName(event.target.value);
}

<input type="text" placeholder="Todo" onChange={inputChangeHandler} value={currentTodoStateName}/>
```

##  Using Multiple State (!!! Recommended approach to handle Multiple State)

* We can use useState as many as we need. Now lets add Today List array using useState hook

```jsx
import React, { useState } from 'react';

const todo = props => {

    const [currentTodoStateName, setTodoName] = useState('');

    const [currentTodoListState, pushTodoList] = useState([]);

    const inputChangeHandler = (event) => {
        setTodoName(event.target.value);
    }
    const addTodoListHandler = () => {
        pushTodoList(currentTodoListState.concat(currentTodoStateName));
    }

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={currentTodoStateName}/>
            <button type="button" onClick={addTodoListHandler}>Add</button>
            <ul>
                {currentTodoListState.map(todo => 
                <li key={todo}>{todo}</li>)}
            </ul>
        </React.Fragment>
    );
};

export default todo;
```

##  Using One State Instead (!!! Not recommended approach to handle Multiple State)

* We now use two instances of the useState function, we call it two times and that is perfectly fine and actually the way I would recommend working with that,you separate your states across multiple hooks where each hook manages one individual state.

* We can of course also merge states into an object as one state.

```jsx
import React, { useState } from 'react';

const todo = props => {

    // const [currentTodoStateName, setTodoName] = useState('');

    // const [currentTodoListState, pushTodoList] = useState([]);

    const [todoStateData, setTodoStateFunc] = useState(
        {
        currentTodoStateName: '',
        currentTodoListState: []
        }
    );

    const inputChangeHandler = (event) => {
        setTodoStateFunc({
            currentTodoStateName : event.target.value,
            currentTodoListState : todoStateData.currentTodoListState
        });
    }
    const addTodoListHandler = () => {
        // pushTodoList(currentTodoListState.concat(currentTodoStateName));

        setTodoStateFunc({
            currentTodoStateName : todoStateData.currentTodoStateName,
            currentTodoListState : todoStateData.currentTodoListState.concat(todoStateData.currentTodoStateName)
        });
    }

    return (
        <React.Fragment>
            <input type="text" placeholder="Todo" onChange={inputChangeHandler} value={todoStateData.currentTodoStateName}/>
            <button type="button" onClick={addTodoListHandler}>Add</button>
            <ul>
                {todoStateData.currentTodoListState.map(todo => 
                <li key={todo}>{todo}</li>)}
            </ul>
        </React.Fragment>
    );
};

export default todo;
```
* Because one important takeaway is that unlike set state which took an object and merged it with the existing state, the hook created update function here will not merge whatever you pass in with the old state, it will simply replace the old state with the new one and that is super important to understand


