1. What is the difference between Component and PureComponent? give an example where it might break my app.
   - Pure components only re-renders if the object changes its refenrece, so we only have a shallow check of it, therefore not caring too much about the data inside the object referenced.
   - If you want to render a company info as a preview to what the user is typing, if the preview is a Purecomponent, and we are handling the info in a single object, we could end up not having the information being updated on the screen since we would not trigger a rerender.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is
that?
    - Since shouldComponentUpdate works for limit the re-rendering of a component, it could end up stopping the propagation of the Context

3. Describe 3 ways to pass information from a component to its PARENT.
   - Prop drilling a setter callback
   - Global state management
   - Contexts

4. Give 2 ways to prevent components from re-rendering.
   - Memoization
   - PureComponents

5. What is a fragment and why do we need it? Give an example where it might break my app.
    - React always need a parent element to wrap siblings in JSX expressions. So fragments are a performant and DOM friendly way of sufficing that for React without needing to grow your DOM tree.
    - If you map through an Array to return a list of inputs where they have their own labels, this would break the app if you don't wrap them in a parent element.
    ```ts
        const arr = ["1", "2"]
        
        //broken component
        const brokenList = () => {
            return arr.map(i => {
                return (
                    <label htmlFor={i}>{i}</label>
                    <input id={i} />
                    )
            })
        }

        // correct component
        const list = () => {
            return arr.map(i => {
                return (
                    <>
                        <label htmlFor={i}>{i}</label>
                        <input id={i} />
                    </>
                    )
            })
        }
    ```

6. Give 3 examples of the HOC pattern. 

```ts
// Example 1
// Apply brand color
export default const withBrandColor = (Comp) => class WithBrandColor extends React.Component {
    render() {
        return (
            <Comp
                {...this.props}
                style={{...(this.props.style ?? {}), color: "var(--brandColor)"}}
            />
        )
    }
}
// Example 2
// Adds <mark> tag around a matching text based on a search string
export default const withHighlight = (Comp) => class WithHighlight extends React.Component {
    highlight = (text) => {
        const regex = new RegExp(`(${this.props.search})`, "gi");
        return text.split(regex).map((part, i) => (
            <span key={i}>
                {part.toLowerCase() === this.props.search.toLowerCase() ? <mark>{part}</mark> : part}
            </span>
        ))
    }

    render() {
        const {text, search, ...rest} = this.props;
        return (
            <Comp {...rest}>
            {highlight(text)}
            </Comp>
        )
    }
}
// Example 3
// Adds testing parameters
export default const withTestingParams = (Comp) => class WithTestingParams extends React.Component {
    render() {
        return (
            <Comp
                {...this.props}
                data-test-id={this.props.id}
            />
        )
    }
    }
```

7. what's the difference in handling exceptions in promises, callbacks and async...await.
   - Promises can reject(), which can be done inside another async callback inside the promise and yet be handled withing the .catch(), async functions can only throw, regular callbacks don't have error handlers, we would need to treat them outside of it.

8. How many arguments does setState take and why is it async.
   - They take 1 argument which could be the value you want to set or a callback
   - They are async for performance gains, you can do more than one state change in a single callback and if you would trigger all of them sync you would end up having a lot of expensive rerenders.

9.  List the steps needed to migrate a Class to 
Function Component.
    - Update to hooks (states, memoization and etc)
    - Update life cycle methods accordingly to useEffect or useLayoutEffect
    - Get rid of 'this' everywhere
    - Remove render method, keep only the return
    - Remove constructor entirely
    - Add 'const' before the methods

10.   List a few ways styles can be used with components.
     - Stylesheet by importing it at the top of the file
     - Stylesheet modules by importing it at the top of the file and giving it a name
     - 'style' property in each element
     - CSS-in-JS where you would use a lib to work with the JS in a JS, JSX, TS, TSX file

11.   How to render an HTML string coming from the server.
     - dangerouslySetInnerHtml property
     - Be careful with XSS so sanitize it first