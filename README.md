#Markdown-More

Little additions on top of [markdown-js](https://github.com/evilstreak/markdown-js).  
Comes with a little set of helpers to register filters easily. Uses the "[Maruku](https://github.com/bhollis/maruku/blob/master/docs/markdown_syntax.md)" dialect by default, which means it supports some features on top of regular markdown, like tables or footnotes.

- [repo](https://github.com/Xananax/markdownmore)
- [examples](http://xananax.github.io/markdownmore)

Makdown-more is intended as a more fully-featured version of markdown geared towards static site generation.

if you don't want the filters but just the helper functions, instead of
```js
var markdown = include('markdown-more')
```

do

```js
var markdown = include('markdown-more/markdown')
```

then you can include the filters you want:

```js
require('markdown-more/filters/arrows')(markdown);
```

---

## Usage

```javascript
var markdown = require('markdown-more');
var htmlText = markdown(markdownText,options);
```

For the options available, see below. To check the example (this very page, rendered with markdown-more), navigate to the `/example` directory and run `node index.js`, then open `localhost:3000` in your browser.
There is a full run-down of all options available in `example/options.js`

---

## Included Filters

### Icons
add it with `require('makdown-more/filters/icons')(markdown);`.  
Replaces `(+)` with `<i class="fa fa-plus-circle"><span>+</span></i>`, `(-)` with `<i class="fa fa-minus-circle"><span>-</span></i>`, and so on. You can add your own icons, or even replace the template in case you don't use FontAwesome. Default options:

```javascript
var options = {
    markdown:{    
        class_prefix:'fa'
    ,   render:function(className,content){
            return ['i',{class:className},['span',content]];
        }
    ,   characters:{
            '+':'plus-circle'
        ,   '-':'minus-circle'
        ,   '#':'check'
        ,   'x':'times'
        ,   '?':'question'
        }
    }
};
```

examples:

- this will be translated to a (+) "+"
- this will be a fontAwesome (?) questionmark

---

### Iframes
add it with `require('makdown-more/filters/iframes')(markdown);`.  
You can add iframes like so: 
`[iframe //youtu.be/somestring]`
That's all. You'll get the following markup:
```html
<div class="iframe iframe-youtube">
    <iframe src="//youtu.be/somestring" frameborder="0" width="400px" height="300px"></iframe>
</div>
```
*Note: .com, .org, .net extensions will be removed from the classname. So `youtube.com` will become `.iframe-youtube`, but `something.io` will become `.iframe-somethingio`.*

You can specify width and height, as well as border, by adding "|" separated options: `[iframe url|500x600|0]`

You can set default options:
```javascript
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

examples:

[iframe http://dabblet.com/gist/8333352|540x480]

---

### Wrap
add it with `require('makdown-more/filters/wrap')(markdown);`. 
Just wraps elements in `span` wrappers. You can use it to wrap all `<a/>` in `span.link` for example.
To use, just set an array of elements to wrap:

```js
var options = {
    markdown:{
        wrap:{
            class_suffix:'-wrapper'
        ,   wrappers:['link','table','iframe']
        }
    }
};
```

So this table:

| header 1 | header 2 |
|----------|----------|
| content  | content  |
| content  | content  |
| content  | content  |

Would be wrapped in a `span.table-wrapper`

---

### LineBreaks
add it with `require('makdown-more/filters/linebreaks')(markdown);`.  
Just turns any linebreak into a newline, useful for markdown newbies that can't remember to add two spaces at the end.

---

### Headers
This simply adds an id for each header, which allows for in-page links. Ids are generated from the text itself: spaces are replaced with "-", special characters are removed, and the text gets lowercased.

Default options:

```javascript
var options = {
    markdown:{
        id_prefix:'' //gets pre-pended to the ids
    ,   level:3 //which is the maximal level of header to include
    }
};
```

---

### Embed
add it with `require('makdown-more/filters/embed')(markdown);`.  
Embed from many providers simply by having a url on it's own line. For example:
https://www.youtube.com/watch?v=dZW5B_7xydI
. Note that this is a newline in the original markdown file, not necessarily in your generated html (i.e, you don't have to add two spaces at the end of your lines). You don't have to include `http` in the beginning, and you can specify a size by pre-pending `560x320:` to the url:
280x157:https://youtu.be/K8nrF5aXPlQ
for the moment, only youtube and vimeo are supported. You may add your own providers:
```javascript
var options = {
    markdown:{
        embed:{
            class_prefix:'embed'//className is "embed embed-someprovider"
        ,   providers:{
                'someprovider.org':function(frag,width,height){
                    //frag is whatever comes after "somprovider.org/"
                }
            }
        }
    }
}
```

iframes are inside a `<span>` element of classes `.embed.embed-provider`, where `provider` is `youtube` or `vimeo`


---

### Entities
add it with `require('makdown-more/filters/entities')(markdown);`.  
Transforms `<-` and `->` into unicode `←` and `→`, `(c)` into `©`, and so on. Additionally, wraps the entity in a span with class `.entity.entity-X`, where "x" is the type of entity. You can add yours by changing the options:
```javascript
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

examples:

- -> will be an arrow
- (c) will be a copyright sign

---

### Checkboxes
add it with `require('makdown-more/filters/checkboxes')(markdown);`.  
Transforms `[ ]` and `[x]` into checkboxes. Any of the following characters are valid:
- `[ ]`: Will create an empty checkbox
- `[x]`,`[*]`,`[✓]`,`[✔]`,`[☑]`: Will create a checked checkbox
- `[×]`,`[X]`,`[✕]`,`[☓]`: Will create a disabled checkbox (these are not regular "x"'s)
- `[✖]`,`[✗]`,`[✘]`: Will create checked *and* disabled checkboxes

You can include a label for the checkbox like you would a markdown inline link: `[x](my label)`. Checkboxes take an id and a class, and labels take a class too (there's a span inside the label that also receives a class. You can specify the classes with the options below.
*options*:
```javascript
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

examples:

[ ] an empty checkbox, [x] a checked checkbox, and a [✓](checked) checkbox with a label

---

### Mentions and Hashtags
add it with `require('makdown-more/filters/mentions-hashtags')(markdown);`.  
Any string of letters preceeded with `@` or with `#` will be wrapped in a span with class `mention` or `hashtag`. You can optionally specify a prefix for the classes:
```javascript
var options = {
    markdown:{
        mentions:{
            class_prefix:''
        }
    }
};
```

examples:

hello @someone, let's tag this #awesome

---

### Templating
add it with `require('makdown-more/filters/templating')(markdown);`.  
You can use your markdown as a simple templating engine by using mustache-like `{{` and `}}`. This is a very very simple templating engine and just replaces `{{variable}}` by what you've supplied in your `options.variable`. Supports functions: if your options have, for example:

```javascript
var options ={
    title:'My function'
,   helpers:{
        add:function(a,b){return a+b}
    }
};
```

Then the string `{{title}} adds number like so: {{helpers.add(1,2)}}` will render as `My function adds numbers like so: 3`.  
Note: you can add your functions anywhere, they're on `helpers` in the example just to demonstrate that nested variables are possible.
Templating runs prior to everything else, and does apply everywhere (other filters do not work inside `backticks` for example).

---

## Additional Filters

### Table Of Contents
This filter generates an automatic table of contents and inserts it at the top of the document.
Requires the "headers" filter.
Available options:

```javascript
var options = 
    markdown:{
        level:3 //minimum level of header
    ,   class_prefix:'toc' //prefixed to classes used in the table of contents
    ,   title:'Table of Contents' //will show as an h1 at the top of the table
    }
}
```

---

### Page
add it with `require('makdown-more/filters/page')(markdown);`.  
This filter simply wraps your markdown in `<html>` and `<body>` tags to make it a valid html page.

---

### Calculus
add it with `require('makdown-more/filters/calculus')(markdown);`.  
This transforms allows simple maths inline or over the document. any string of letters followed directly with an `=` and an expression enclosed in `(` and `)` will see the expression treated as math (spaces break the expression). Variables are retained throughout the document, so referencing them is possible.
Feel free to provide a new scope or to add variables in scope by setting the `locals.markdown.calculus` object.

Examples:

- let's say a=(3+1)
- and b=(cos(34))
- and c will not render c=(PI)!
- and this line d=(5.8^2)! will not render either
- this will just print a result =(a+b-c+d)
- This is invalid: e=(ru(^9))
 
The above will render as:

- let's say a = 4
- and b = -0.8485702747846051
- and c will not render
- and this line will not render either
- this will just print a result 33.649837071625605
- This is invalid: e = ru(^9)

Add a final `!` to execute an operation without printing it. For example, `e=(d+1)!` will not show at all. I could print it later by writing `=(e)`.

---

## API

#### Markdown(string[,locals])
equivalent to the original `markdown.toHTML()`, but goes through all the filters before rendering. `locals` is anything you want to pass to your functions.

There there is a bunch of helper functions to register filters, but they aren't going to be documented here right now. Check the example filters, they should provide with most use cases.

---

## FAQ

#### Is it fast?
Nah.

#### Is is stable?
No

#### Is it tested?
Tests are being written, but for the time being there aren't any

#### Aren't you re-inventing the wheel?
You mean, why not just write HTML? Or use BBCode or something similar? Well I happen to like markdown, a lot. I use it for everything. It is just a bit lacking for creating slightly complex pages. So I did this. If you don't like it, don't use it.

#### Can it be used in the client?
Sure. Grab the pre-built libs in `/dist`.

---

## Libraries Used:

Markdown-mode is built on top of [markdown-js](https://github.com/evilstreak/markdown-js), and uses [MathJs](http://mathjs.org/) for the calculus filter.
The examples uses [prismjs](prismjs.com) and [fontAwesome](http://fortawesome.github.io/Font-Awesome/).


---

## License

Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.