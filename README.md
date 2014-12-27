# Markdown-More

Little additions on top of [markdown-js](https://github.com/evilstreak/markdown-js).  
Comes with a little set of helpers to register filters easily.  

### API

#### Markdown(string[,locals])
equivalent to the original `markdown.toHTML()`, but goes through all the filters before rendering. `locals` is anything you want to pass to your functions.

#### Markdown.register(hook)
Returns a function `register(function)` that allows to register functions on the defined hook. Hooks are (in order):

- 'before': acts on the raw string
- 'json': acts on the jsonmlTree
- 'html': acts on the htmlTree
- 'after': acts on the raw html string

Example:
```js
var register_html = markdown.register('html');
register_html(func1);
```

**Note**: Function order **MATTERS**.

#### Markdown.register(hook,function)
Registers a function at a particular hook.  
All functions have a signature of `function(data,locals)`, where `locals` is whatever you passed down to `markdown()` and `data` is:

- Functions defined in 'before' and 'after' receive an object {str:string}, where the string is respectively the raw text and the raw html
- Functions defined in 'json' receive the jsonml tree
- Functions defined in 'html' receive the html tree

All functions are expected to work on the first argument passed and shouldn't return anything.
`Markdown.register(hook,function)` returns a curried version of itself, so you can chain, for example:
```js
markdown.register('json')(func1)(func2)(func3);
//is equivalent to
markdown.register('json')(func1);
markdown.register('json')(func2);
markdown.register('json')(func3);
```

#### Markdown.makeJsonFilter(function)

Registers a function at json level. Will go through every item in the jsonml array, and passe them to the function. The function is tasked with returning explicitely `false` for every item it does *not* want to parse.

#### Markdown.makeJsonFilter(RegExp[,baseElem],parse)

Registers a json filter that uses the provided RegExp to parse the tree. The `parse` function passed should have a signature of: `function(chunk,locals)`, where `locals` is whatever you passed, `chunk` is the current processed chunk of text that matches the RegExp you provided, and `baseElem` is how you want your returned element to be wrapped ('text','para'...), and defaults to 'text'.
`this.regExp` will be filled with the regExp you provided.  
Here is an easy example to turn line returns into <br>:
```js
var lineReturnsFilter = markdown.makeJsonFilter(/(\n|\r)/g,'text',function(chunk){
    if(chunk.match(this.regExp)){
        return ['linebreak'];
    }
    return chunk;
});
markdown.register('json',lineReturnsFilter);
```

#### Markdown.registerJsonFilter(RegExp,baseElem,parse)

Same as `makeJsonFilter`, but avoids the step of having to register the function.

### Examples:

You'll find a few examples in `example/filter.js`, namely to:

  - turn "[\*]abcde" into checkboxes, [ ] into unticked checkboxes, and [#] into ticked *and* disabled checkboxes (as well as a handy function to sync checking of those boxes with the underlying markdown), while keeping your [links](#) intact. If a text immediatly follows a [x], it will be considered a label (as long as there is no space between them).
  - turn @string into mentions and #string into hashtags
  - turn line returns (`\r`,`\n`) into `<br>`
  - turn -> and <- into arrows
  - turn >45435kdfgfd into a link
  - create a table of contents automagically
  - Have a very simple mustache-type renderer that turns {{exampleVar}} into text, before rendering
  - And a very simple html wrapper, that wraps the whole result, after rendering.

### LICENSE
MIT
