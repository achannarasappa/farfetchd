    <a name="module_body"></a>

## body

* [body](#module_body)
    * [Body](#exp_module_body--Body) ⏏
        * [new Body([body])](#new_module_body--Body_new)
        * [.text()](#module_body--Body+text) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.json()](#module_body--Body+json) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.formData()](#module_body--Body+formData) ⇒ <code>Promise.&lt;FormData&gt;</code>

<a name="exp_module_body--Body"></a>

### Body ⏏
[Body mixin](https://fetch.spec.whatwg.org/#body-mixin) representing the body of a request or response. A body can be used through one of the class methods after which is can not be used again.

**Kind**: Exported class  
<a name="new_module_body--Body_new"></a>

#### new Body([body])
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[body]</td><td><code>String</code> | <code>FormData</code></td><td><code>&#x27;&#x27;</code></td>
    </tr>  </tbody>
</table>

<a name="module_body--Body+text"></a>

#### body.text() ⇒ <code>Promise.&lt;String&gt;</code>
Uses body and returns a Promise that resolves the body.

**Kind**: instance method of <code>[Body](#exp_module_body--Body)</code>  
<a name="module_body--Body+json"></a>

#### body.json() ⇒ <code>Promise.&lt;Object&gt;</code>
Uses body and returns a Promise that resolves a parsed JSON object from the body.

**Kind**: instance method of <code>[Body](#exp_module_body--Body)</code>  
<a name="module_body--Body+formData"></a>

#### body.formData() ⇒ <code>Promise.&lt;FormData&gt;</code>
Uses body and returns a Promise that resolves an instance of FormData.

**Kind**: instance method of <code>[Body](#exp_module_body--Body)</code>  
