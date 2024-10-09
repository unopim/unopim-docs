(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{411:function(e,n,a){"use strict";a.r(n);var t=a(10),s=Object(t.a)({},(function(){var e=this,n=e._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h2",{attrs:{id:"technical-codebase"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#technical-codebase"}},[e._v("#")]),e._v(" Technical Codebase")]),e._v(" "),n("p",[e._v("If you are looking to extend the functionalities of the UnoPim platform, creating a package is the way to go. A package is a self-contained module that adds specific features to the platform. It allows developers to introduce custom functionality without altering the core codebase of UnoPim.")]),e._v(" "),n("p",[e._v("This guide will walk you through the process of developing a package for UnoPim.")]),e._v(" "),n("p",[e._v("In UnoPim, various packages are located at "),n("strong",[n("code",[e._v("packages/Webkul/")])]),e._v(". Below is a basic tree structure of a package:")]),e._v(" "),n("div",{staticClass:"language-directory-structure extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("└── Webkul\n    └── Example\n        └── src\n            ├── Config\n            │   ├── acl.php\n            │   └── menu.php\n            ├── Console\n            │   └── Commands\n            ├── Contracts\n            │   └── Example.php\n            ├── Database\n            │   ├── Migrations\n            │   │   └── 2024_10_10_122434_create_examples_table.php\n            │   └── Seeders\n            ├── Events\n            ├── Helpers\n            │   ├── Exporters\n            |   |   └── Product\n            │   │       └── Exporter.php\n            │   └── Importers\n            |       └── Product\n            |           └── Importer.php\n            ├── Http\n            │   ├── Controllers\n            │   │   └── ExampleController.php\n            │   ├── Middleware\n            │   └── Requests\n            ├── Listeners\n            ├── Models\n            │   ├── Example.php\n            │   └── ExampleProxy.php\n            ├── Providers\n            │   ├── ExampleServiceProvider.php\n            │   └── ModuleServiceProvider.php\n            ├── Routes\n            │   └── routes.php\n            ├── Repositories\n            │   └── ExampleRepository.php\n            └── Resources\n                ├── assets\n                │   ├── images\n                │   │   └── example-icon.png\n                │   ├── js\n                │   │   └── app.js\n                │   └── css\n                │       └── app.css\n                ├── lang\n                │   └── app.php\n                └── views\n                    └── example\n                        ├── create.blade.php\n                        ├── edit.blade.php\n                        └── index.blade.php\n\n")])])])])}),[],!1,null,null,null);n.default=s.exports}}]);