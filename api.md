## Functions

<dl>
<dt><a href="#addFunction">addFunction(document, file)</a> ⇒</dt>
<dd><p>Add a file object to a document object</p>
</dd>
<dt><a href="#exports">exports(file, document)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#exports">exports(input, output)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#extractCommand">extractCommand(input, output)</a> ⇒ <code>Promise</code></dt>
<dd><p>Extract a Packdown document</p>
</dd>
<dt><a href="#removeCommand">removeCommand(file, document)</a> ⇒ <code>Promise</code></dt>
<dd><p>Removes a file from a Packdown document</p>
</dd>
<dt><a href="#templateCommand">templateCommand(input, variables, output)</a> ⇒ <code>Promise</code></dt>
<dd><p>Extract a Packdown document as templated files</p>
</dd>
<dt><a href="#filesToDoc">filesToDoc(root, files)</a> ⇒</dt>
<dd><p>Convert a set of files to a document</p>
</dd>
<dt><a href="#PackdownLineParser">PackdownLineParser(input)</a> ⇒</dt>
<dd><p>Parse text into Packdown document</p>
</dd>
<dt><a href="#isSpaceEncoded">isSpaceEncoded(line)</a> ⇒</dt>
<dd></dd>
<dt><a href="#PackdownReader">PackdownReader(input, options)</a> ⇒</dt>
<dd><p>Read text as a Packdown document</p>
</dd>
<dt><a href="#remove">remove(document, path)</a> ⇒</dt>
<dd><p>Remove a file at specified path from a Packdown document</p>
</dd>
<dt><a href="#exports">exports(template, variables)</a> ⇒</dt>
<dd><p>Render a Mustache template</p>
</dd>
<dt><a href="#checkFile">checkFile(file)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#checkDir">checkDir(dir)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#getDir">getDir(dir)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#createDir">createDir(dir)</a></dt>
<dd><p>Create a directory</p>
</dd>
<dt><a href="#getFile">getFile(file)</a> ⇒</dt>
<dd><p>Description</p>
</dd>
<dt><a href="#putFile">putFile(file, content)</a></dt>
<dd><p>Write content to file</p>
</dd>
<dt><a href="#FileBlock">FileBlock(file)</a> ⇒</dt>
<dd><p>Generate a Packdown file text block given a Packdown file object</p>
</dd>
<dt><a href="#Writer">Writer(document)</a> ⇒</dt>
<dd><p>Writes a Packdown document from a document object</p>
</dd>
</dl>

<a name="addFunction"></a>

## addFunction(document, file) ⇒
Add a file object to a document object

**Kind**: global function  
**Returns**: A file already existing at the added path or null  

| Param | Type |
| --- | --- |
| document | <code>Object</code> | 
| file | <code>Object</code> | 

<a name="exports"></a>

## exports(file, document) ⇒
Description

**Kind**: global function  
**Returns**: CallExpression  

| Param |
| --- |
| file | 
| document | 

<a name="exports"></a>

## exports(input, output) ⇒
Description

**Kind**: global function  
**Returns**: CallExpression  

| Param |
| --- |
| input | 
| output | 

<a name="extractCommand"></a>

## extractCommand(input, output) ⇒ <code>Promise</code>
Extract a Packdown document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> | Path to input file |
| output | <code>String</code> | Output path |

<a name="removeCommand"></a>

## removeCommand(file, document) ⇒ <code>Promise</code>
Removes a file from a Packdown document

**Kind**: global function  

| Param |
| --- |
| file | 
| document | 

<a name="templateCommand"></a>

## templateCommand(input, variables, output) ⇒ <code>Promise</code>
Extract a Packdown document as templated files

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> | Path to input file |
| variables | <code>Object</code> | Context to use in template |
| output | <code>String</code> | Output path |

<a name="filesToDoc"></a>

## filesToDoc(root, files) ⇒
Convert a set of files to a document

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | Root directory |
| files |  | An array of file objects with at least a path and a content property |

<a name="PackdownLineParser"></a>

## PackdownLineParser(input) ⇒
Parse text into Packdown document

**Kind**: global function  
**Returns**: Document object  

| Param | Type |
| --- | --- |
| input | <code>String</code> | 

<a name="isSpaceEncoded"></a>

## isSpaceEncoded(line) ⇒
**Kind**: global function  
**Returns**: Boolean  

| Param | Type |
| --- | --- |
| line | <code>String</code> | 

<a name="PackdownReader"></a>

## PackdownReader(input, options) ⇒
Read text as a Packdown document

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> |  |
| options | <code>Object</code> | {disableSpaceEncoding} |

<a name="remove"></a>

## remove(document, path) ⇒
Remove a file at specified path from a Packdown document

**Kind**: global function  
**Returns**: The deleted file, if any, or null  

| Param |
| --- |
| document | 
| path | 

<a name="exports"></a>

## exports(template, variables) ⇒
Render a Mustache template

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | The template to render |
| variables | <code>Object</code> | The values used within template |

<a name="checkFile"></a>

## checkFile(file) ⇒
Description

**Kind**: global function  
**Returns**: stat  

| Param |
| --- |
| file | 

<a name="checkDir"></a>

## checkDir(dir) ⇒
Description

**Kind**: global function  
**Returns**: stat  

| Param |
| --- |
| dir | 

<a name="getDir"></a>

## getDir(dir) ⇒
Description

**Kind**: global function  
**Returns**: CallExpression  

| Param |
| --- |
| dir | 

<a name="createDir"></a>

## createDir(dir)
Create a directory

**Kind**: global function  

| Param | Type |
| --- | --- |
| dir | <code>String</code> | 

<a name="getFile"></a>

## getFile(file) ⇒
Description

**Kind**: global function  
**Returns**: ObjectExpression  

| Param |
| --- |
| file | 

<a name="putFile"></a>

## putFile(file, content)
Write content to file

**Kind**: global function  

| Param | Type |
| --- | --- |
| file | <code>String</code> | 
| content | <code>String</code> | 

<a name="FileBlock"></a>

## FileBlock(file) ⇒
Generate a Packdown file text block given a Packdown file object

**Kind**: global function  
**Returns**: String  

| Param | Type |
| --- | --- |
| file | <code>File</code> | 

<a name="Writer"></a>

## Writer(document) ⇒
Writes a Packdown document from a document object

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | object |

