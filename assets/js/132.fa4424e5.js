(window.webpackJsonp=window.webpackJsonp||[]).push([[132],{436:function(t,s,e){"use strict";e.r(s);var a=e(10),r=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"implementing-data-export"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#implementing-data-export"}},[t._v("#")]),t._v(" Implementing Data Export")]),t._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#overview-of-the-steps"}},[t._v("Overview of the Steps")])]),s("li",[s("a",{attrs:{href:"#step-1-create-exporter-file"}},[t._v("Step 1: Create Exporter File")]),s("ul",[s("li",[s("a",{attrs:{href:"#directory-structure"}},[t._v("Directory Structure")])])])]),s("li",[s("a",{attrs:{href:"#step-2-implement-exporter-logic"}},[t._v("Step 2: Implement Exporter Logic")]),s("ul",[s("li",[s("a",{attrs:{href:"#key-methods"}},[t._v("Key Methods:")])])])]),s("li",[s("a",{attrs:{href:"#step-3-register-the-exporter"}},[t._v("Step 3: Register the Exporter")]),s("ul",[s("li",[s("a",{attrs:{href:"#step-1-create-exporter-php"}},[t._v("Step 1: Create exporter.php")])]),s("li",[s("a",{attrs:{href:"#step-2-define-the-exporter-configuration"}},[t._v("Step 2: Define the Exporter Configuration")])]),s("li",[s("a",{attrs:{href:"#step-3-load-the-configuration-in-the-service-provider"}},[t._v("Step 3: Load the Configuration in the Service Provider")])])])])])]),s("p"),t._v(" "),s("p",[t._v("In UnoPim, the export functionality mirrors the import process, enabling you to export product or other data into various formats like CSV, XLS, or XLSX. This guide will walk you through the steps to create an exporter, define its logic, and register it in the system.")]),t._v(" "),s("h2",{attrs:{id:"overview-of-the-steps"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#overview-of-the-steps"}},[t._v("#")]),t._v(" Overview of the Steps")]),t._v(" "),s("ol",[s("li",[s("strong",[t._v("Create the Exporter File")]),t._v(": This is where you define the logic for exporting data.")]),t._v(" "),s("li",[s("strong",[t._v("Implement the Exporter Logic")]),t._v(": Implement how the data will be retrieved and processed.")]),t._v(" "),s("li",[s("strong",[t._v("Register the Exporter")]),t._v(": Ensure UnoPim recognizes your exporter and its configuration.")])]),t._v(" "),s("hr"),t._v(" "),s("h2",{attrs:{id:"step-1-create-exporter-file"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-1-create-exporter-file"}},[t._v("#")]),t._v(" Step 1: Create Exporter File")]),t._v(" "),s("h3",{attrs:{id:"directory-structure"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#directory-structure"}},[t._v("#")]),t._v(" Directory Structure")]),t._v(" "),s("p",[t._v("First, create a directory structure for your export functionality. The exporter logic should be placed in a specific directory under your plugin:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("└── packages\n    └── Webkul\n        └── Example\n            ├── ...\n            └── src\n                └── Helpers\n                    └── Exporters\n                        ├── ...\n                        └── FileName\n                            └── Exporter.php\n")])])]),s("p",[t._v("Here:")]),t._v(" "),s("ul",[s("li",[s("strong",[s("code",[t._v("Helpers/Exporters")])]),t._v(": This is the directory where all exporter-related files will reside.")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("Exporter.php")])]),t._v(": This file contains the exporter logic.")])]),t._v(" "),s("hr"),t._v(" "),s("h2",{attrs:{id:"step-2-implement-exporter-logic"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-2-implement-exporter-logic"}},[t._v("#")]),t._v(" Step 2: Implement Exporter Logic")]),t._v(" "),s("p",[t._v("Inside the "),s("code",[t._v("Exporter.php")]),t._v(" file, define the logic for exporting data. The exporter will typically extend the "),s("code",[t._v("AbstractExporter")]),t._v(" class provided by UnoPim, which contains common export functionalities.")]),t._v(" "),s("p",[t._v("Here's an example implementation:")]),t._v(" "),s("div",{staticClass:"language-php extra-class"},[s("pre",{pre:!0,attrs:{class:"language-php"}},[s("code",[s("span",{pre:!0,attrs:{class:"token php language-php"}},[s("span",{pre:!0,attrs:{class:"token delimiter important"}},[t._v("<?php")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("namespace")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token package"}},[t._v("Webkul"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Example"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Helpers"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Exporters"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Product")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("use")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token package"}},[t._v("Illuminate"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Support"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Facades"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Event")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("use")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token package"}},[t._v("Webkul"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("DataTransfer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Helpers"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Exporters"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("AbstractExporter")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("use")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token package"}},[t._v("Webkul"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("DataTransfer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("Contracts"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v("JobTrackBatch")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" JobTrackBatchContract"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name-definition class-name"}},[t._v("Exporter")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AbstractExporter")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * Start the export process.\n     *\n     * @param JobTrackBatchContract $batch\n     * @param string $filePath\n     * @return bool\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-definition function"}},[t._v("exportBatch")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name type-declaration"}},[t._v("JobTrackBatchContract")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$batch")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$filePath")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword return-type"}},[t._v("bool")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Logic to handle the export of a batch of data.")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// This function will prepare data and write it to the provided $filePath.")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// You can gather data from the database, apply filters, and organize the export here.")]),t._v("\n        \n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Return true if the batch export is successful.")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/**\n     * Retrieve and process the results for the export.\n     */")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("protected")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-definition function"}},[t._v("getResults")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$this")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("->")]),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("source")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("->")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("all")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?->")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getIterator")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]),s("h3",{attrs:{id:"key-methods"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#key-methods"}},[t._v("#")]),t._v(" Key Methods:")]),t._v(" "),s("ul",[s("li",[s("strong",[s("code",[t._v("exportBatch()")])]),t._v(": This method is responsible for handling the export process for a batch of data. You can define the logic for data retrieval, formatting, and writing to a file.")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("getResults()")])]),t._v(": This method is used to retrieve the data to be exported. You can query your repository or database here.")])]),t._v(" "),s("hr"),t._v(" "),s("h2",{attrs:{id:"step-3-register-the-exporter"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-3-register-the-exporter"}},[t._v("#")]),t._v(" Step 3: Register the Exporter")]),t._v(" "),s("p",[t._v("To make the exporter available in UnoPim, you need to register it. This involves defining it in a configuration file and loading that configuration within your service provider.")]),t._v(" "),s("h3",{attrs:{id:"step-1-create-exporter-php"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-1-create-exporter-php"}},[t._v("#")]),t._v(" Step 1: Create "),s("code",[t._v("exporter.php")])]),t._v(" "),s("p",[t._v("In your plugin's "),s("code",[t._v("Config")]),t._v(" directory, create a new configuration file named "),s("code",[t._v("exporter.php")]),t._v(". This file will hold the configuration settings for your exporter.")]),t._v(" "),s("p",[t._v("Directory structure:")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("└── packages\n    └── Webkul\n        └── Example\n            ├── ...\n            └── src\n                └── Config\n                    └── exporter.php\n")])])]),s("h3",{attrs:{id:"step-2-define-the-exporter-configuration"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-2-define-the-exporter-configuration"}},[t._v("#")]),t._v(" Step 2: Define the Exporter Configuration")]),t._v(" "),s("p",[t._v("In the "),s("code",[t._v("exporter.php")]),t._v(" file, define your exporter and its settings. Here’s an example configuration for a product exporter:")]),t._v(" "),s("div",{staticClass:"language-php extra-class"},[s("pre",{pre:!0,attrs:{class:"language-php"}},[s("code",[s("span",{pre:!0,attrs:{class:"token php language-php"}},[s("span",{pre:!0,attrs:{class:"token delimiter important"}},[t._v("<?php")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'example'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'title'")]),t._v("       "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'data_transfer::app.exporters.products.title'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'exporter'")]),t._v("    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'Webkul\\Example\\Helpers\\Exporters\\Product\\Exporter'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'source'")]),t._v("      "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'Webkul\\Product\\Repositories\\ProductRepository'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// Specify the repository")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'filters'")]),t._v("     "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'fields'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'name'")]),t._v("       "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'file_format'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'title'")]),t._v("      "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'File Format'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'type'")]),t._v("       "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'select'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'required'")]),t._v("   "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'validation'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'required'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'options'")]),t._v("    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'value'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'Csv'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'label'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'CSV'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'value'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'Xls'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'label'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'XLS'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'value'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'Xlsx'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                            "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'label'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'XLSX'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" \n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'name'")]),t._v("     "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'with_media'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'title'")]),t._v("    "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'With Media'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'required'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'type'")]),t._v("     "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'boolean'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])]),s("p",[t._v("Explanation:")]),t._v(" "),s("ul",[s("li",[s("strong",[s("code",[t._v("title")])]),t._v(": The title of the exporter.")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("exporter")])]),t._v(": The fully-qualified namespace of the exporter class.")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("source")])]),t._v(": The data source (e.g., repository) from which the exporter will retrieve data.")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("filters")])]),t._v(": Configuration options for the exporter, such as file format and other export options.")])]),t._v(" "),s("h3",{attrs:{id:"step-3-load-the-configuration-in-the-service-provider"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#step-3-load-the-configuration-in-the-service-provider"}},[t._v("#")]),t._v(" Step 3: Load the Configuration in the Service Provider")]),t._v(" "),s("p",[t._v("To ensure that UnoPim loads your exporter configuration, you must register it in your service provider by merging the configuration.")]),t._v(" "),s("p",[t._v("In your "),s("code",[t._v("ExampleServiceProvider")]),t._v(", add the following code to the "),s("code",[t._v("register()")]),t._v(" method:")]),t._v(" "),s("div",{staticClass:"language-php extra-class"},[s("pre",{pre:!0,attrs:{class:"language-php"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-definition function"}},[t._v("register")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$this")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("->")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("mergeConfigFrom")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("dirname")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("__DIR__")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(".")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'/Config/exporter.php'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string single-quoted-string"}},[t._v("'exporters'")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("This merges the custom "),s("code",[t._v("exporter.php")]),t._v(" configuration into the core exporter settings in UnoPim.")])])}),[],!1,null,null,null);s.default=r.exports}}]);