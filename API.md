## Functions

<dl>
<dt><a href="#isSpaceEncoded">isSpaceEncoded(line)</a> ⇒</dt>
<dd></dd>
<dt><a href="#read">read(input, options)</a> ⇒</dt>
<dd><p>Read text as a Packdown document</p>
</dd>
<dt><a href="#FileBlock">FileBlock(file)</a> ⇒</dt>
<dd><p>Generate a Packdown file text block given a Packdown file object</p>
</dd>
<dt><a href="#write">write(document)</a> ⇒</dt>
<dd><p>Writes a Packdown document from a document object</p>
</dd>
<dt><a href="#add">add(document, file)</a> ⇒</dt>
<dd><p>Add a file object to a document object</p>
</dd>
<dt><a href="#remove">remove(document, path)</a> ⇒</dt>
<dd><p>Remove a file at specified path from a Packdown document</p>
</dd>
<dt><a href="#filesToDoc">filesToDoc(root, files)</a> ⇒</dt>
<dd><p>Convert a set of files to a document</p>
</dd>
<dt><a href="#template">template(template, variables)</a> ⇒</dt>
<dd><p>Render a Mustache template</p>
</dd>
</dl>

<a name="isSpaceEncoded"></a>

## isSpaceEncoded(line) ⇒
**Kind**: global function  
**Returns**: Boolean  

| Param | Type |
| --- | --- |
| line | <code>String</code> | 

<a name="read"></a>

## read(input, options) ⇒
Read text as a Packdown document

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> |  |
| options | <code>Object</code> | {disableSpaceEncoding} |

<a name="FileBlock"></a>

## FileBlock(file) ⇒
Generate a Packdown file text block given a Packdown file object

**Kind**: global function  
**Returns**: String  

| Param | Type |
| --- | --- |
| file | <code>File</code> | 

<a name="write"></a>

## write(document) ⇒
Writes a Packdown document from a document object

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | object |

<a name="add"></a>

## add(document, file) ⇒
Add a file object to a document object

**Kind**: global function  
**Returns**: A file already existing at the added path or null  

| Param | Type |
| --- | --- |
| document | <code>Object</code> | 
| file | <code>Object</code> | 

<a name="remove"></a>

## remove(document, path) ⇒
Remove a file at specified path from a Packdown document

**Kind**: global function  
**Returns**: The deleted file, if any, or null  

| Param |
| --- |
| document | 
| path | 

<a name="filesToDoc"></a>

## filesToDoc(root, files) ⇒
Convert a set of files to a document

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | Root directory |
| files |  | An array of file objects with at least a path and a content property |

<a name="template"></a>

## template(template, variables) ⇒
Render a Mustache template

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | The template to render |
| variables | <code>Object</code> | The values used within template |

