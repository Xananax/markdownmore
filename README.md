#Markdown-More

Little additions on top of [markdown-js](https://github.com/evilstreak/markdown-js).  
Comes with a little set of helpers to register filters easily. Uses the ["Maruku"](https://github.com/bhollis/maruku/blob/master/docs/markdown_syntax.md) dialect by default, which means it supports some features on top of regular markdown, like tables or footnotes.

if you don't want the filters but just the helper functions, instead of
```
var markdown = include('markdown-more')
```

do

```
var markdown = include('markdown-more/markdown')
```

then you can include the filters you want:

```
require('markdown-more/filters/arrows')(markdown);
```

---

## Usage

```js
var markdown = require('markdown-more');
var htmlText = markdown(markdownText,options);
```

For the options available, see below.

---

## Included Filters

### Icons
add it with `require('makdown-more/filters/icons')(markdown);`.  
Replaces `(+)` with `<i class="fa fa-plus-circle"></i>`, `(-)` with `<i class="fa fa-minus-circle"></i>`, and so on. You can add icons, or even replace the template in case you don't use FontAwesome. Available options:
```js
var options = {
    markdown:{
        icons:{
            template:'<i class="fa fa-%%icon%%></i>' //%%icon%% gets replaced by the below
        ,   characters:{ // those are the characters available by default. If you need more, add them
                '+':'plus-circle'
            ,   '-':'minus-circle'
            ,   '#':'check'
            ,   'x':'times'
            ,   '?':'question'
            }
        }
    }
}
```

### Iframes
add it with `require('makdown-more/filters/iframes')(markdown);`.  
You can add iframes like so: 
`iframe[//youtu.be/somestring]`
That's all. You'll get the following markup:
```html
<div class="iframe iframe-youtube">
    <iframe src="//youtu.be/somestring" frameborder="0" width="400px" height="300px"></iframe>
</div>
```
*Note: .com, .org, .net extensions will be removed from the classname. So `youtube.com` will become `.iframe-youtube`, but `something.io` will become `.iframe-somethingio`.*

You can set default options:
```js
var options = {
    markdown:{
        iframe:{
            border:0
        ,   width:400
        ,   height:300
        ,   class_prefix:'iframe'
        }
    }
}
```

### Embed
add it with `require('makdown-more/filters/embed')(markdown);`.  
Embed from many providers simply by having a url on it's own line. For example:
https://www.youtube.com/watch?v=dZW5B_7xydI
You don't have to include `http` in the beginning, and you can specify a size by pre-pending `560x320:` to the url:
280x157:https://youtu.be/K8nrF5aXPlQ
for the moment, only youtube and vimeo are supported. You may add your own providers:
```js
var options:{
    markdown:{
        embed:{
            class_prefix:'embed'
        ,   providers:{
                'someprovider.org':function(frag,className,width,height){
                    //frag is whatever comes after "somprovider.org/"
                    //className is "embed embed-someprovider"
                }
            }
        }
    }
}
```

### Entities
add it with `require('makdown-more/filters/entities')(markdown);`.  
Transforms `<-` and `->` into unicode `←` and `→`, `(c)` into `©`, and so on. Additionally, wraps the entity in a span with class `.entity.entity-X`, where "x" is the type of entity. You can add yours by changing the options:
```js
var options = {
    markdown:{
        entities:{
            template:'<span class="entity entity-%%icon%%>%%content%%</span>'
        ,   characters:{
                ':\)':['smiley','☺'] //pass the class name, then the entity in an array. 
                                     // Escape regex characters
            ,   '>_<':['disapprove','ಠ_ಠ']
            }
        }
    }
}
```


### Checkboxes
add it with `require('makdown-more/filters/checkboxes')(markdown);`.  
Transforms [ ] and [x] into checkboxes. Any of the following characters are valid:
- [ ]: Will create an empty checkbox
- [x],[*],[✓],[✔],[☑]: Will create a checked checkbox
- [×],[X],[✕],[☓]: Will create a disabled checkbox (these are not regular "x"'s)
- [✖],[✗],[✘]: Will create checked *and* disabled checkboxes

You can include a label for the checkbox like you would a markdown inline link: `[x](my label)`. Checkboxes take an id and a class, and labels take a class too (there's a span inside the label that also receives a class. You can specify the classes with the options below.
*options*:
```js
var options = {
    markdown:{
        checkbox:{
            id_prefix:'checkbox' // checkboxes will have ids 'checkbox0', 'checkbox1' and so on
        ,   class_prefix:'input-checkbox' //checkboxes will have class 'input-checkbox', 
                                          // labels will be 'input-checkbox-label'
                                          // spans in labels will be 'input-checkbox-label-text'
        ,   ids:0 // checkbox id counting will start at 0
                  // this may be useful if you render several markdown blocks on the same page
                  // And don't want repeating ids
                  // Additionally, this number will be the checkboxe's tab index
                  // the id number is changed in the object itself, so just read it 
                  // back from your options object to get the last used id
        }
    }
};
```

### Calculus
add it with `require('makdown-more/filters/calculus')(markdown);`.  
This transforms allows simple maths inline or over the document. any string of letters followed directly with an `=` and an expression will see the expression treated as math (spaces break the expression). Variables are retained throughout the document, so referencing them is possible.
Examples:
- a=3+1
- b=cos(34)
- c=PI
- d=a+b-c
 
The above will render as:

- 4
- -0.8485702747846051
- 3.141592653589793
- -0.009837071625601546

Add a final `!` to execute an operation without printing it. For example, `e=(d+1)!` will not show at all. I could print it later by writing `e=e`.

### Mentions and Hashtags
add it with `require('makdown-more/filters/mentions-hashtags')(markdown);`.  
Any string of letters preceeded with `@` or with `#` will be wrapped in a span with class `mention` or `hashtag`. You can optionally specify a prefix for the classes:
```js
var options = {
    markdown:{
        mentions:{
            class_prefix:''
        }
    }
};
```

### Templating
add it with `require('makdown-more/filters/templating')(markdown);`.  
You can use your markdown as a simple templating engine by using mustache-like `{{` and `}}`. This is a very very simple templating engine and just replaces `{{variable}}` by what you've supplied in your `options.variable`. Supports functions: if your options have, for example:

```js
var options ={
    title:'My function'
,   helpers:{
        add:function(a,b){return a+b}
    }
};
```

Then the string `{{title}} adds number like so: {{helpers.add:1:2}}` will render as `My function adds numbers like so: 3`.  
Note: you can add your functions anywhere, they're on `helpers` in the example just to demonstrate that nested variables are possible.

## Options
Here are the total options for all the filters above:
```js
var options = {
    markdown:{
        icons:{
            template:'<i class="fa fa-%%icon%%></i>'
        ,   characters:{}
        }
    ,   entities:{
            template:'<span class="entity entity-%%icon%%>%%content%%</span>'
        ,   characters:{}
        }
    ,   iframe:{
            border:0
        ,   width:400
        ,   height:300
        ,   class_prefix:'iframe'
        }
    ,   embed:{
            class_prefix:'embed'
            providers:{}
        }
    ,   checkbox:{
            id_prefix:'checkbox'
        ,   class_prefix:'input-checkbox'
        ,   ids:0
        }
    ,   mentions:{
            class_prefix:''
        }
    }
}

```

---

## Additional Filters

### Table Of Contents
This filter is chunked in two:
First, include the part that add ids to all h1's:  
`require('makdown-more/filters/toc/first')(markdown);`.  
After you've added all your filters, add the part that actually pre-pends the table of contents:
`require('makdown-more/filters/toc/last')(markdown);`.  

### Page
add it with `require('makdown-more/filters/page')(markdown);`.  
This filter simply wraps your markdown in `<html>` and `<body>` tags to make it a valid html page.

---

## API

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

---
## License

Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.