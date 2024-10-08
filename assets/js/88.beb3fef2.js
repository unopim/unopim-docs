(window.webpackJsonp=window.webpackJsonp||[]).push([[88],{383:function(e,t,a){"use strict";a.r(t);var r=a(10),s=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"events"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#events"}},[e._v("#")]),e._v(" Events")]),e._v(" "),t("p"),t("div",{staticClass:"table-of-contents"},[t("ul",[t("li",[t("a",{attrs:{href:"#introduction"}},[e._v("Introduction")])]),t("li",[t("a",{attrs:{href:"#creating-an-event-class"}},[e._v("Creating an Event Class")]),t("ul",[t("li",[t("a",{attrs:{href:"#manually-registering-events"}},[e._v("Manually Registering Events")])]),t("li",[t("a",{attrs:{href:"#manually-registering-listeners"}},[e._v("Manually Registering Listeners")])])])]),t("li",[t("a",{attrs:{href:"#specifying-events"}},[e._v("Specifying Events")])]),t("li",[t("a",{attrs:{href:"#events-fired-in-unopim"}},[e._v("Events Fired in UnoPim")])]),t("li",[t("a",{attrs:{href:"#listening-to-existing-events"}},[e._v("Listening to Existing Events")]),t("ul",[t("li",[t("a",{attrs:{href:"#registering-a-listener"}},[e._v("Registering a Listener")])])])])])]),t("p"),e._v(" "),t("h2",{attrs:{id:"introduction"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#introduction"}},[e._v("#")]),e._v(" Introduction")]),e._v(" "),t("p",[e._v("Event Listeners in UnoPim are a way to implement the observer pattern, where listeners respond to events that occur in the application. Events can be thought of as announcements made by the application, and listeners are the actions taken in response to those announcements. All event classes in UnoPim are stored in the "),t("code",[e._v("Providers")]),e._v(" folder, and the listeners are stored in the "),t("code",[e._v("Listeners")]),e._v(" folder.")]),e._v(" "),t("p",[e._v("In UnoPim, events and listeners are organized in a clear and structured manner:")]),e._v(" "),t("ul",[t("li",[e._v("Events are typically stored in the Events folder.")]),e._v(" "),t("li",[e._v("Listeners are stored in the Listeners folder.")])]),e._v(" "),t("p",[e._v("This organization makes it easy to manage and locate the event-driven components of your application.")]),e._v(" "),t("p",[e._v("To learn in detail about Controllers, you can visit the Laravel documentation "),t("a",{attrs:{href:"https://laravel.com/docs/11.x/events",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("h2",{attrs:{id:"creating-an-event-class"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#creating-an-event-class"}},[e._v("#")]),e._v(" Creating an Event Class")]),e._v(" "),t("h3",{attrs:{id:"manually-registering-events"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#manually-registering-events"}},[e._v("#")]),e._v(" Manually Registering Events")]),e._v(" "),t("p",[e._v("In UnoPim, you register events manually in the "),t("code",[e._v("boot")]),e._v(" method of your "),t("code",[e._v("EventServiceProvider.php")]),e._v(" file. Here is an example of how to register events:")]),e._v(" "),t("div",{staticClass:"language-php extra-class"},[t("pre",{pre:!0,attrs:{class:"language-php"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/**\n * Register any other events for your application.\n *\n * @return void\n */")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("public")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("function")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token function-definition function"}},[e._v("boot")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("//...")]),e._v("\n\n    "),t("span",{pre:!0,attrs:{class:"token class-name static-context"}},[e._v("Event")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("listen")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'event.name'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'path-upto-listener@function'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),t("p",[e._v("In this example, "),t("code",[e._v("event.name")]),e._v(" is the name of the event, and "),t("code",[e._v("path-upto-listener@function")]),e._v(" is the listener method that will handle the event.")]),e._v(" "),t("h3",{attrs:{id:"manually-registering-listeners"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#manually-registering-listeners"}},[e._v("#")]),e._v(" Manually Registering Listeners")]),e._v(" "),t("p",[e._v("When registering events, you specify the listener function to be executed when an event is triggered. Here is an example of how to register a listener:")]),e._v(" "),t("div",{staticClass:"language-php extra-class"},[t("pre",{pre:!0,attrs:{class:"language-php"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("class")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token class-name-definition class-name"}},[e._v("EventServiceProvider")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("extends")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("ServiceProvider")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/**\n     * Bootstrap services.\n     *\n     * @return void\n     */")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("public")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("function")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token function-definition function"}},[e._v("boot")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("//...")]),e._v("\n\n        "),t("span",{pre:!0,attrs:{class:"token class-name static-context"}},[e._v("Event")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("listen")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'catalog.attribute.create.after'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'Webkul\\Catalog\\Listeners\\Attribute@handleAttributeCreated'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),t("h2",{attrs:{id:"specifying-events"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#specifying-events"}},[e._v("#")]),e._v(" Specifying Events")]),e._v(" "),t("p",[e._v("In UnoPim, events are typically fired before and after the execution of CRUD operations. This allows listeners to perform additional actions, such as logging, notifications, or data manipulation, at specific points in the lifecycle of an operation.")]),e._v(" "),t("p",[e._v("For example, you might have events fired during product creation, updating, or deletion. Here’s an example of firing events before and after saving a product:")]),e._v(" "),t("div",{staticClass:"language-php extra-class"},[t("pre",{pre:!0,attrs:{class:"language-php"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("namespace")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token package"}},[e._v("Webkul"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("Catalog"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("Repositories")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("use")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token package"}},[e._v("Webkul"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("Catalog"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("Contracts"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("Product")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("class")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token class-name-definition class-name"}},[e._v("ProductRepository")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("extends")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("Repository")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("public")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("function")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token function-definition function"}},[e._v("create")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token keyword type-hint"}},[e._v("array")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$data")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n        "),t("span",{pre:!0,attrs:{class:"token class-name static-context"}},[e._v("Event")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("dispatch")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'catalog.product.create.before'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$data")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n        "),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$product")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token keyword static-context"}},[e._v("parent")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("create")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$data")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n        "),t("span",{pre:!0,attrs:{class:"token class-name static-context"}},[e._v("Event")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("dispatch")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'catalog.product.create.after'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$product")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("return")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[e._v("$product")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),t("h2",{attrs:{id:"events-fired-in-unopim"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#events-fired-in-unopim"}},[e._v("#")]),e._v(" Events Fired in UnoPim")]),e._v(" "),t("p",[e._v("In UnoPim, there are several events fired throughout its operations, allowing developers to hook into specific points in the application's lifecycle to customize behavior or add functionality. Here's a list of events that are fired in UnoPim, which you can listen to and handle as needed by creating event listeners:")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("Events name")]),e._v(" "),t("th",[e._v("Functionality")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("admin.password.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after admin password gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.create.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.create.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.update.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.update.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.create.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute family is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.create.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute family is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute family is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute family is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.update.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute family is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute_family.update.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute family is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.create.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute group is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.create.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute group is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute group is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute group is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.update.before")]),e._v(" "),t("td",[e._v("This event is fired before an attribute group is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.attribute.group.update.after")]),e._v(" "),t("td",[e._v("This event is fired after an attribute group is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.categories.mass-update.before")]),e._v(" "),t("td",[e._v("This event is fired before a bulk category update.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.categories.mass-update.after")]),e._v(" "),t("td",[e._v("This event is fired after a bulk category update.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.create.before")]),e._v(" "),t("td",[e._v("This event is fired before a category is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.create.after")]),e._v(" "),t("td",[e._v("This event is fired after a category is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before a category is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after a category is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.update.before")]),e._v(" "),t("td",[e._v("This event is fired before a category is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category.update.after")]),e._v(" "),t("td",[e._v("This event is fired after a category is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.create.before")]),e._v(" "),t("td",[e._v("This event is fired before a category_field is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.create.after")]),e._v(" "),t("td",[e._v("This event is fired after a category_field is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before a category_field is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after a category_field is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.update.before")]),e._v(" "),t("td",[e._v("This event is fired before a category_field is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.category_field.update.after")]),e._v(" "),t("td",[e._v("This event is fired after a category_field is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.create.before")]),e._v(" "),t("td",[e._v("This event is fired before a product is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.create.after")]),e._v(" "),t("td",[e._v("This event is fired after a product is created.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.delete.before")]),e._v(" "),t("td",[e._v("This event is fired before a product is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.delete.after")]),e._v(" "),t("td",[e._v("This event is fired after a product is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.update.before")]),e._v(" "),t("td",[e._v("This event is fired before a product is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("catalog.product.update.after")]),e._v(" "),t("td",[e._v("This event is fired after a product is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before a channel gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after a channel gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before a channel gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after a channel gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before a channel gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.channel.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after a channel gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.configuration.save.before")]),e._v(" "),t("td",[e._v("This event will be fired before configuration save.")])]),e._v(" "),t("tr",[t("td",[e._v("core.configuration.save.after")]),e._v(" "),t("td",[e._v("This event will be fired after configuration save.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before currency gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after currency gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before currency gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after currency gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before currency gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.currency.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after currency gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before a locale gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after a locale gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before a locale gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after a locale gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before a locale gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("core.locale.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after a locale gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.batch.export.after")]),e._v(" "),t("td",[e._v("This event will be fired after batch exports data_transfer.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.batch.export.before")]),e._v(" "),t("td",[e._v("This event will be fired before batch exports data_transfer.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.completed")]),e._v(" "),t("td",[e._v("This event will be fired if exports completed.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after exports data_transfer is created.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before exports data_transfer is created.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.export.now.before")]),e._v(" "),t("td",[e._v("This event will be fired before export data_transfer is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.started")]),e._v(" "),t("td",[e._v("This event will be fired if exports started.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after export data_transfer is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.exports.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before export data_transfer is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.batch.export.after")]),e._v(" "),t("td",[e._v("This event will be fired after batch imports data_transfer.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.batch.export.before")]),e._v(" "),t("td",[e._v("This event will be fired before batch imports data_transfer.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.completed")]),e._v(" "),t("td",[e._v("This event will be fired if imports completed.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after imports data_transfer is created.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before imports data_transfer is created.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.indexing")]),e._v(" "),t("td",[e._v("This event will be fired if imports indexing.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.linking")]),e._v(" "),t("td",[e._v("This event will be fired if imports linking.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.started")]),e._v(" "),t("td",[e._v("This event will be fired if imports started.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after imports data_transfer is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before imports data_transfer is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.validate.after")]),e._v(" "),t("td",[e._v("This event will be fired after imports validate.")])]),e._v(" "),t("tr",[t("td",[e._v("data_transfer.imports.validate.before")]),e._v(" "),t("td",[e._v("This event will be fired before imports validate.")])]),e._v(" "),t("tr",[t("td",[e._v("products.datagrid.sync")]),e._v(" "),t("td",[e._v("This event is fired to sync the product datagrid.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after admin gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before admin gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after admin gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before admin gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after admin gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("user.admin.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before admin gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_integration.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after API integration is created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_integration.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before API integration is created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_integration.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after API integration is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_integration.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before API integration is updated.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_key.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after API key is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.api_key.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before API key is deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.create.after")]),e._v(" "),t("td",[e._v("This event will be fired after role gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.create.before")]),e._v(" "),t("td",[e._v("This event will be fired before role gets created.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.delete.after")]),e._v(" "),t("td",[e._v("This event will be fired after role gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.delete.before")]),e._v(" "),t("td",[e._v("This event will be fired before role gets deleted.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.update.after")]),e._v(" "),t("td",[e._v("This event will be fired after role gets updated.")])]),e._v(" "),t("tr",[t("td",[e._v("user.role.update.before")]),e._v(" "),t("td",[e._v("This event will be fired before role gets updated.")])])])]),e._v(" "),t("h2",{attrs:{id:"listening-to-existing-events"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#listening-to-existing-events"}},[e._v("#")]),e._v(" Listening to Existing Events")]),e._v(" "),t("p",[e._v("UnoPim uses events and listeners to implement the observer pattern, allowing you to respond to various actions and events within the application. You can listen to specific events and execute custom code when those events are triggered.")]),e._v(" "),t("h3",{attrs:{id:"registering-a-listener"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#registering-a-listener"}},[e._v("#")]),e._v(" Registering a Listener")]),e._v(" "),t("p",[e._v("Open the "),t("code",[e._v("EventServiceProvider.php")]),e._v(" file located in the "),t("code",[e._v("Providers")]),e._v(" directory of your UnoPim application. This file is where you register event listeners.")]),e._v(" "),t("p",[e._v("Inside the "),t("code",[e._v("boot()")]),e._v(" method of "),t("code",[e._v("EventServiceProvider.php")]),e._v(", use the "),t("code",[e._v("Event::listen")]),e._v(" method to register your listener. This method takes the event name and a callback function or a class method that will handle the event.")]),e._v(" "),t("div",{staticClass:"language-php extra-class"},[t("pre",{pre:!0,attrs:{class:"language-php"}},[t("code",[t("span",{pre:!0,attrs:{class:"token class-name static-context"}},[e._v("Event")]),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("::")]),t("span",{pre:!0,attrs:{class:"token function"}},[e._v("listen")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'catalog.product.create.after'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[e._v("'Webkul\\Notification\\Listeners\\Product@createNotification'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n")])])]),t("p",[e._v("By registering the listener, you have associated the "),t("strong",[t("code",[e._v("createNotification")])]),e._v(" function with the "),t("strong",[t("code",[e._v("catalog.product.create.after")])]),e._v(" event. Whenever this event is triggered, the specified function will be executed.")]),e._v(" "),t("p",[e._v("You can modify the listener function according to your requirements to perform the desired operation.")])])}),[],!1,null,null,null);t.default=s.exports}}]);