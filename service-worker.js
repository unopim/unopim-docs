/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "0.1/advanced/events.html",
    "revision": "ed043a960309a2894bf0add100cf67d6"
  },
  {
    "url": "0.1/advanced/helpers.html",
    "revision": "6275b34a5cd434af5eda59ce3e81b640"
  },
  {
    "url": "0.1/advanced/index.html",
    "revision": "e89443ff327906217d72658c3ac213e7"
  },
  {
    "url": "0.1/advanced/override-core-model.html",
    "revision": "31f19273ca4b8733e1ddecf58fb65c3c"
  },
  {
    "url": "0.1/advanced/render-event.html",
    "revision": "7bf19a03b2f9b43ac4c7813bed5359fd"
  },
  {
    "url": "0.1/api/attribute_families.html",
    "revision": "cb5e60589289c4ee20b2473d52ebd98d"
  },
  {
    "url": "0.1/api/attribute_groups.html",
    "revision": "b5b1c79e5a67a981757bd76635a828fa"
  },
  {
    "url": "0.1/api/attribute_options.html",
    "revision": "aebe9ca030bbd5e2b5a7e83225fb0b5a"
  },
  {
    "url": "0.1/api/attribute.html",
    "revision": "885f6e3215e7e04b56bedc7fc9d9b7e3"
  },
  {
    "url": "0.1/api/authenticate.html",
    "revision": "7bbb72a543be73bf30c415c93d632164"
  },
  {
    "url": "0.1/api/category_field_options.html",
    "revision": "c75db962d840c5cc6f9fe1506097c99c"
  },
  {
    "url": "0.1/api/category_fields.html",
    "revision": "5b3490d2637f41d9eeb89e0b704cdeec"
  },
  {
    "url": "0.1/api/category.html",
    "revision": "e3588d79302c1014f4d7c93638f5f417"
  },
  {
    "url": "0.1/api/channel.html",
    "revision": "2ef8c0f89f1aac72139389d87f1ef982"
  },
  {
    "url": "0.1/api/configurable_products.html",
    "revision": "1afd8e8314350e1a4e8e0b6b636c9548"
  },
  {
    "url": "0.1/api/configuration.html",
    "revision": "bf943b9b445cb776d6d9a4401fcdbe2b"
  },
  {
    "url": "0.1/api/currency.html",
    "revision": "ba5da3b0babb089c119947566ec8f811"
  },
  {
    "url": "0.1/api/explanation.html",
    "revision": "0261f250f0d74152b71b4e7ac5661848"
  },
  {
    "url": "0.1/api/getting-started-with-the-api.html",
    "revision": "0f8a812e07a2cbb946e56446dbf08dd2"
  },
  {
    "url": "0.1/api/index.html",
    "revision": "86c226ccd91c99ab45c41ae2a11f020d"
  },
  {
    "url": "0.1/api/locales.html",
    "revision": "d8eb9c1f53c5532f95d3ccf969a6b9ef"
  },
  {
    "url": "0.1/api/media.html",
    "revision": "7ea2afda5af8df22808e515d1e19a14f"
  },
  {
    "url": "0.1/api/postman_collection.html",
    "revision": "299f5f816c1fed6d93f9c359130f1bfc"
  },
  {
    "url": "0.1/api/product.html",
    "revision": "ee16847e33f89ad242f0abb66db1d9f0"
  },
  {
    "url": "0.1/architecture/frontend.html",
    "revision": "d3403450294e4e90b73bb7379e41d8c4"
  },
  {
    "url": "0.1/architecture/index.html",
    "revision": "c24eddf8fc11054af5d59a082f7f4191"
  },
  {
    "url": "0.1/architecture/modular-design.html",
    "revision": "ae94d15d4c8ea3e16f6832b26a82e90f"
  },
  {
    "url": "0.1/architecture/packages.html",
    "revision": "4633b953edbca3c3fc5f2d15f1e65764"
  },
  {
    "url": "0.1/architecture/repository-pattern.html",
    "revision": "88c18c38db4d462d4328eda26a9e5021"
  },
  {
    "url": "0.1/introduction/index.html",
    "revision": "73d5b7b3a33a4b5fe5d8b5d56c8b875f"
  },
  {
    "url": "0.1/introduction/installation.html",
    "revision": "1a9200009bbc4cbe5316fc55689be1f5"
  },
  {
    "url": "0.1/introduction/requirements.html",
    "revision": "0c429aff81b187a674178d63a08bdc0c"
  },
  {
    "url": "0.1/packages/add-menu-in-admin.html",
    "revision": "4d04c1e7c0639985e15f52c5dab689c0"
  },
  {
    "url": "0.1/packages/blade-components.html",
    "revision": "d8ecba97404827532c88a32a113e8416"
  },
  {
    "url": "0.1/packages/bundling-assets.html",
    "revision": "6f2ad484aa64eb4b18ca6f1a0141f26c"
  },
  {
    "url": "0.1/packages/controllers.html",
    "revision": "124554436d88bc3737cae752ce5d68c7"
  },
  {
    "url": "0.1/packages/create-acl.html",
    "revision": "364f1a9987a5693e3fc9497a46b8250c"
  },
  {
    "url": "0.1/packages/create-migrations.html",
    "revision": "374b000953fe011c5f55f0a573c70e6d"
  },
  {
    "url": "0.1/packages/create-models.html",
    "revision": "2dff465dc6347e8f8636e61cd5869f3e"
  },
  {
    "url": "0.1/packages/create-package.html",
    "revision": "60caedb40928a4d4aae42de81aa0d21d"
  },
  {
    "url": "0.1/packages/data-transfer.html",
    "revision": "2e3eec2a900c20aa53d474497684b8c9"
  },
  {
    "url": "0.1/packages/datagrid.html",
    "revision": "8bfafdfa79a58503d6b75a0674895329"
  },
  {
    "url": "0.1/packages/history.html",
    "revision": "5014df032f11ed426f03a93c788afddb"
  },
  {
    "url": "0.1/packages/index.html",
    "revision": "8e00e078daea36da55f380e28fa23783"
  },
  {
    "url": "0.1/packages/layouts.html",
    "revision": "f985478c18fed08f32d6cb2c6643868b"
  },
  {
    "url": "0.1/packages/localization.html",
    "revision": "d82bff0bf1079c069ac2e7a3d5ac2f66"
  },
  {
    "url": "0.1/packages/routes.html",
    "revision": "8466ccfa3a8066d95c5c38b074065ca5"
  },
  {
    "url": "0.1/packages/store-data-through-repositories.html",
    "revision": "504e150eb4c7510be01a09146ce301e8"
  },
  {
    "url": "0.1/packages/validation.html",
    "revision": "1e2ce792a47f78964570e3d2dc7da8d6"
  },
  {
    "url": "0.1/packages/views.html",
    "revision": "cb4d6c7262064b959d62d70496f07a6b"
  },
  {
    "url": "0.1/plugins/add-side-menu.html",
    "revision": "1fd23efce7e70f2d25421188608eaf6f"
  },
  {
    "url": "0.1/plugins/create-export-profile.html",
    "revision": "d3011102283214dc79c5c0f709442d62"
  },
  {
    "url": "0.1/plugins/create-import-profile.html",
    "revision": "433815990c9375e4622b65cfb0a8259c"
  },
  {
    "url": "0.1/plugins/create-plugin.html",
    "revision": "0315d519c4cac53daff39d364bb1902d"
  },
  {
    "url": "0.1/plugins/index.html",
    "revision": "7f01670b7c2cf0b70f2e689d1b9b0f07"
  },
  {
    "url": "0.1/plugins/plugin-deployment.html",
    "revision": "2aa5776718b8c7adf5cd0702be2a28ff"
  },
  {
    "url": "0.1/prologue/contribution-guide.html",
    "revision": "2b180ce4f30973bb65e20a46e0e065ed"
  },
  {
    "url": "0.1/prologue/index.html",
    "revision": "1265851e32746b1d0f4f0e4b01a62f7f"
  },
  {
    "url": "404.html",
    "revision": "d09f9971adf0e88e36294f69973091bf"
  },
  {
    "url": "assets/css/0.styles.d1829642.css",
    "revision": "ccd9566401441bcce58ff3468c1db8c5"
  },
  {
    "url": "assets/img/apiKey.530fc37b.png",
    "revision": "530fc37b5c01405e35da6781e2290bc7"
  },
  {
    "url": "assets/img/collection_export.0c1fb331.png",
    "revision": "0c1fb331c40669d9e910069522f993d3"
  },
  {
    "url": "assets/img/configuration.beedd9e9.png",
    "revision": "beedd9e9f84d58e77e3195234ccc4406"
  },
  {
    "url": "assets/img/environment_export.4d1f8856.png",
    "revision": "4d1f885635f60b5af7c4bbdefee828e2"
  },
  {
    "url": "assets/img/environment_variable.5805dc92.png",
    "revision": "5805dc92fb094bf0ad0345c9bd6eb01b"
  },
  {
    "url": "assets/img/generate.63faefc6.png",
    "revision": "63faefc6c374f54f21efa8c2251c30bf"
  },
  {
    "url": "assets/img/saveIntegration.b9b9e346.png",
    "revision": "b9b9e346e2502fc0ab42b337e83c29cf"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.4723c82d.js",
    "revision": "c4c02dd93ead3760668f9c1a34e32fe6"
  },
  {
    "url": "assets/js/10.fed0cda8.js",
    "revision": "0202f7f187ec8af0610fc3e05a95f1d5"
  },
  {
    "url": "assets/js/100.0829c2f9.js",
    "revision": "46aa59aae123dc4233fc0fb134f6dfa6"
  },
  {
    "url": "assets/js/101.338b1613.js",
    "revision": "bfda1077fac30b91fbb5b2f895b19206"
  },
  {
    "url": "assets/js/102.d8d5f5aa.js",
    "revision": "dec02f3e140d05dc0eb90fc3d34a823f"
  },
  {
    "url": "assets/js/103.20a97eeb.js",
    "revision": "83c118736d274251895fd9cdcc83d4b4"
  },
  {
    "url": "assets/js/104.cccc9a4e.js",
    "revision": "0dbc3ed8d6697523924daaeb8e9e4e85"
  },
  {
    "url": "assets/js/105.da24dae5.js",
    "revision": "8f427884fb9b7119f2e4d66730ed35c4"
  },
  {
    "url": "assets/js/106.2621e430.js",
    "revision": "4f664fa7ed8fb6727f8f48805a4c11bb"
  },
  {
    "url": "assets/js/107.c578921b.js",
    "revision": "abd6ed75d8a7afcc97ddd68edf10d50f"
  },
  {
    "url": "assets/js/108.7d809eff.js",
    "revision": "5c9ce0feced665347bacd286ec85614a"
  },
  {
    "url": "assets/js/109.b0690095.js",
    "revision": "f7e854d1f7f971a9e7557889fc13224f"
  },
  {
    "url": "assets/js/11.7a5942b2.js",
    "revision": "47f2ed28b814943a0210ae159a901a95"
  },
  {
    "url": "assets/js/110.37570d8d.js",
    "revision": "da340189d5c52ff6312da65ff675d981"
  },
  {
    "url": "assets/js/111.53e7efe4.js",
    "revision": "e34acc511274bc7cc95c7e38a0e10fe1"
  },
  {
    "url": "assets/js/112.d3008f7a.js",
    "revision": "1dffccfc8dc8c87a5aa97ba0cb96f536"
  },
  {
    "url": "assets/js/113.7b23e351.js",
    "revision": "6f0a30fe643d4b35d5129419c09ab36d"
  },
  {
    "url": "assets/js/114.8dc4f273.js",
    "revision": "64363f5abd5eef63cdadd46f3001c23a"
  },
  {
    "url": "assets/js/115.38fcf776.js",
    "revision": "9408eb0b082b221915ebce8a688bb04c"
  },
  {
    "url": "assets/js/116.75026478.js",
    "revision": "c94dbf47cbfaae9bf19489a2b5c54000"
  },
  {
    "url": "assets/js/117.b43ad967.js",
    "revision": "9182ff279a167a04c54e95d0b4d4f68a"
  },
  {
    "url": "assets/js/118.1046b5e4.js",
    "revision": "acd9173dbc527a69f97b180465066bcf"
  },
  {
    "url": "assets/js/119.2975d8d8.js",
    "revision": "8b6bd89c15b3b66374a4f45521fb069c"
  },
  {
    "url": "assets/js/12.869a83d5.js",
    "revision": "dde99edf3a2e01854b17368304928f1d"
  },
  {
    "url": "assets/js/120.57ea335d.js",
    "revision": "4847826028b24593c0ac8d466d13e408"
  },
  {
    "url": "assets/js/121.c880a3b2.js",
    "revision": "cc3ae9115897ec90f6cdb13e7d063dcc"
  },
  {
    "url": "assets/js/122.13ff53f3.js",
    "revision": "0d8b22bfabbab2574dfa999b6469b19b"
  },
  {
    "url": "assets/js/123.787301d8.js",
    "revision": "a68674911dc2399f51ec16222137256c"
  },
  {
    "url": "assets/js/124.8d23f406.js",
    "revision": "4ec2ef0627a8c898ae3c6942d9ea5197"
  },
  {
    "url": "assets/js/125.c9b5a4e3.js",
    "revision": "e9e9c3b1b794b70376a5cf14e04eb27c"
  },
  {
    "url": "assets/js/126.cb0112f5.js",
    "revision": "1f717d9b55ae9cd2bbb68b64067d87b9"
  },
  {
    "url": "assets/js/127.ab2eb73f.js",
    "revision": "1e0c586693d2e8da5aae946e799b9ae5"
  },
  {
    "url": "assets/js/128.094920a3.js",
    "revision": "0d8d9eaf975421135f9abf717afdf5d0"
  },
  {
    "url": "assets/js/129.10060b72.js",
    "revision": "482dcf9abe8411473a8de4dcc698e798"
  },
  {
    "url": "assets/js/13.33d3c53f.js",
    "revision": "aee1b4910f1e1a1ecb67446301308c4e"
  },
  {
    "url": "assets/js/130.d5cabd3d.js",
    "revision": "a46080a32060f4c7db1c1d671d898568"
  },
  {
    "url": "assets/js/131.8c43f5d0.js",
    "revision": "ee3c393e60d02ed55705c1855aa67e81"
  },
  {
    "url": "assets/js/132.0d6b6994.js",
    "revision": "0440b3780ae5f7298a9cd32914055800"
  },
  {
    "url": "assets/js/133.c476e6ba.js",
    "revision": "e6574caf57795c55f71d3915b564bc9f"
  },
  {
    "url": "assets/js/134.cf0a6733.js",
    "revision": "103d228323c3ec938e2d784378210fcc"
  },
  {
    "url": "assets/js/135.be23774f.js",
    "revision": "3272a4cd8d538dc0ec184e14cd407e99"
  },
  {
    "url": "assets/js/136.be778fbe.js",
    "revision": "5ffc0151ee944322a6b19ed4c659d44f"
  },
  {
    "url": "assets/js/137.125de74c.js",
    "revision": "3082f93215e702bb95fdada5aab772ab"
  },
  {
    "url": "assets/js/138.1e58f9fb.js",
    "revision": "b3019d3ebc527b654950742931ee111e"
  },
  {
    "url": "assets/js/14.d15b0afa.js",
    "revision": "44dd57d3d98958e6259d095ba1a6928b"
  },
  {
    "url": "assets/js/15.074494e5.js",
    "revision": "007cdff8d2f8cca9ddcbce866cc15210"
  },
  {
    "url": "assets/js/16.00f79b3e.js",
    "revision": "1322e09dbc454cc982bce708e8fb3b91"
  },
  {
    "url": "assets/js/17.f81d5789.js",
    "revision": "93de3f085ce54cb8902db2ab94e1302a"
  },
  {
    "url": "assets/js/18.0b390a25.js",
    "revision": "6651c7e04ff9312951b25a7d0ea3968f"
  },
  {
    "url": "assets/js/19.d5598e67.js",
    "revision": "6faf6fe3efb4136f7017bc670a6066d7"
  },
  {
    "url": "assets/js/2.466c6646.js",
    "revision": "ba2b24fb67e591ece43f493159f91cb3"
  },
  {
    "url": "assets/js/20.14b34ea9.js",
    "revision": "bbb5d74b813e0c070377434bc6ee7c62"
  },
  {
    "url": "assets/js/21.98281c1b.js",
    "revision": "1e7b6bbf5531b6e50b3be33c9e683de8"
  },
  {
    "url": "assets/js/22.db3db27b.js",
    "revision": "8b81fa872f1ff8146f863cdae392237e"
  },
  {
    "url": "assets/js/23.4493258f.js",
    "revision": "282bdec545f16b96b37d3f17cd40cd29"
  },
  {
    "url": "assets/js/24.db5533ba.js",
    "revision": "917924500c99b63d1b422a339df2a707"
  },
  {
    "url": "assets/js/25.de5b17e8.js",
    "revision": "126b65dc047dd5dfe1b04bf81167935f"
  },
  {
    "url": "assets/js/26.61058db3.js",
    "revision": "d576ec3fa2e5129c2c63ce799b6dd2c7"
  },
  {
    "url": "assets/js/27.06880b86.js",
    "revision": "c757a7bc6d369943e34e8fd332dabc05"
  },
  {
    "url": "assets/js/28.99989fab.js",
    "revision": "e29afd1b1209227929327911274f950b"
  },
  {
    "url": "assets/js/29.fea18257.js",
    "revision": "0ddfef0553698e3f3b34ca9b7ee8af7e"
  },
  {
    "url": "assets/js/3.c08788cf.js",
    "revision": "9a5397d300c118eaed270de3385d25b0"
  },
  {
    "url": "assets/js/30.79b6cdef.js",
    "revision": "e6b4586cbad3421a89acd3a6ff8c0435"
  },
  {
    "url": "assets/js/31.d6493165.js",
    "revision": "dba4426d8d6ec6c87fd60ee4a83117b2"
  },
  {
    "url": "assets/js/32.a6fbc880.js",
    "revision": "6a661a13f4650353163b16cda28c6d4d"
  },
  {
    "url": "assets/js/33.9a7ab2dd.js",
    "revision": "06613d4119bb53062dc3d5815f86e7d2"
  },
  {
    "url": "assets/js/34.e2daff22.js",
    "revision": "b2f82cfc48d9dfa108eb0d3b29791402"
  },
  {
    "url": "assets/js/35.a05c9bbc.js",
    "revision": "e69486cf2583d093a3d26197df98ac1e"
  },
  {
    "url": "assets/js/36.edac66d2.js",
    "revision": "43303affee1249f950656d50daafda5e"
  },
  {
    "url": "assets/js/37.886059c5.js",
    "revision": "eabd574b247add64092803996cfa7b13"
  },
  {
    "url": "assets/js/38.7e41fac2.js",
    "revision": "dbe7932445951a2b0d01b066b6dda1ed"
  },
  {
    "url": "assets/js/39.f8bfd296.js",
    "revision": "1dfd26985f3d9030da713b54d1649514"
  },
  {
    "url": "assets/js/4.31558275.js",
    "revision": "fc73b6550a54f3b27cd3cf75f08d8a95"
  },
  {
    "url": "assets/js/40.85e8dd26.js",
    "revision": "86e9541d5e707c58703ea9413e029812"
  },
  {
    "url": "assets/js/41.858ce7bb.js",
    "revision": "52210ff993500dc66660659d3836a8a2"
  },
  {
    "url": "assets/js/42.56c62b6d.js",
    "revision": "ba07365d436e20f6d2ccf2d91031da77"
  },
  {
    "url": "assets/js/43.1066c2bc.js",
    "revision": "dc3ff83a371818ed3c39b67487f6dba1"
  },
  {
    "url": "assets/js/44.3f56dca2.js",
    "revision": "2e90fb10174c29085150d278497c5445"
  },
  {
    "url": "assets/js/45.15125963.js",
    "revision": "9f92da1d6e0fed02316e14862a3825ba"
  },
  {
    "url": "assets/js/46.4795f5d4.js",
    "revision": "479be3c60878bc7e1acf2675d2aa26ef"
  },
  {
    "url": "assets/js/47.1b62a744.js",
    "revision": "b3f9523a4fb0453f1c6e7d2b1a16180f"
  },
  {
    "url": "assets/js/48.d09177f4.js",
    "revision": "033c8bc6986ebe95e430f0440ef5b9e3"
  },
  {
    "url": "assets/js/49.7527987c.js",
    "revision": "8dc45a054983a84f5ac17a0e4fcfb850"
  },
  {
    "url": "assets/js/5.5873d029.js",
    "revision": "1a8e799eb717b41b19039adaf73f51e6"
  },
  {
    "url": "assets/js/50.05d15e12.js",
    "revision": "3f6593198a856e4f9742f38799c19383"
  },
  {
    "url": "assets/js/51.987e5d7c.js",
    "revision": "360cce57d9498ad0b99202ea981763dc"
  },
  {
    "url": "assets/js/52.e956e178.js",
    "revision": "b84dae18e27d24f05254ae11e96a5860"
  },
  {
    "url": "assets/js/53.e78f3b5f.js",
    "revision": "bb813eb06b9b0eb5af5b599212f072a8"
  },
  {
    "url": "assets/js/54.393f5944.js",
    "revision": "6d6ff394d855a23f801ec48bbc8234ec"
  },
  {
    "url": "assets/js/55.fe9a7f6c.js",
    "revision": "58be13a0da7c043a0ab0f11424eff7a8"
  },
  {
    "url": "assets/js/56.18b431b1.js",
    "revision": "e9422563ca96411db8d06f765f22139f"
  },
  {
    "url": "assets/js/57.78b570db.js",
    "revision": "490eac7ce5e61b444d6eee985f61f2a0"
  },
  {
    "url": "assets/js/58.7037b302.js",
    "revision": "188fe1e601ff2e80929a50817f095347"
  },
  {
    "url": "assets/js/59.274d8716.js",
    "revision": "3f9f46a386347720579506206d9a7448"
  },
  {
    "url": "assets/js/60.74589ce8.js",
    "revision": "7b7b18921f0f8a27d57b3b7a06a137fa"
  },
  {
    "url": "assets/js/61.e4eb85b7.js",
    "revision": "8e82c7118c861e0bab1d707d6fba71b2"
  },
  {
    "url": "assets/js/62.3762461b.js",
    "revision": "bedcc4b65020c57a7d076aa07e3450a1"
  },
  {
    "url": "assets/js/63.8d3be896.js",
    "revision": "154f6cc44ed576f7b7a2d6a4bef25b12"
  },
  {
    "url": "assets/js/64.d6c2f4f9.js",
    "revision": "f69493c1d7983b3c266b418d7243aeb1"
  },
  {
    "url": "assets/js/65.20e384c0.js",
    "revision": "a24288e3d9a683c3d952f40075200472"
  },
  {
    "url": "assets/js/66.e6118756.js",
    "revision": "9066213a2ae49c04a4b1100ea622c0d6"
  },
  {
    "url": "assets/js/67.3bab79ee.js",
    "revision": "914e2bc235cce69bd93433eb61ca245d"
  },
  {
    "url": "assets/js/68.154dad72.js",
    "revision": "69249308b178fec72dc65d75f7b66da4"
  },
  {
    "url": "assets/js/69.e4133ed2.js",
    "revision": "a1efee2dbfa2f60389be0d72f41add28"
  },
  {
    "url": "assets/js/70.534af764.js",
    "revision": "f99d60e791d98c59dac511a438a1c810"
  },
  {
    "url": "assets/js/71.6f5d7d49.js",
    "revision": "e1db39eab09d80228e6641301f9f7722"
  },
  {
    "url": "assets/js/72.a45ee5a1.js",
    "revision": "3b0f7d4c0c585b7a636d3d26b05064fd"
  },
  {
    "url": "assets/js/73.7657c2b7.js",
    "revision": "a9b1c1c2aa2a9db5cf639778bf6870d4"
  },
  {
    "url": "assets/js/74.b3989bff.js",
    "revision": "d80390f11dbf7281e4cc1039f92f5509"
  },
  {
    "url": "assets/js/75.57543db5.js",
    "revision": "436e945af7f564430af5a18ad22b872f"
  },
  {
    "url": "assets/js/76.65b9498c.js",
    "revision": "538a52a48b2ee468c481d9b31d86ab53"
  },
  {
    "url": "assets/js/77.9b02c23e.js",
    "revision": "ec256abcdba3c5c8f6fe86417c2e50fe"
  },
  {
    "url": "assets/js/78.d26a5676.js",
    "revision": "b99a9e115acf10b961cd886f511c437a"
  },
  {
    "url": "assets/js/79.575d2ca2.js",
    "revision": "777747fbcd38b77e3592121efc7c42fc"
  },
  {
    "url": "assets/js/8.11eb4c04.js",
    "revision": "e6f1463d058e8995cf88e3027da8e36c"
  },
  {
    "url": "assets/js/80.7c907cad.js",
    "revision": "0cc8ba98eaad92b177e1f4a753672f2e"
  },
  {
    "url": "assets/js/81.8bce5052.js",
    "revision": "7dda177519ac772cdaf2b80fa03dd49f"
  },
  {
    "url": "assets/js/82.770ab6ed.js",
    "revision": "a6f555902b96593e12bf70f4214c4fef"
  },
  {
    "url": "assets/js/83.79938170.js",
    "revision": "69164ac08f8f07e700e6f581213cdffc"
  },
  {
    "url": "assets/js/84.40662c48.js",
    "revision": "195a7b679547a8c8d496c96e3a1df03b"
  },
  {
    "url": "assets/js/85.ff1faa1d.js",
    "revision": "37a42f02871b924bd4fdcc50ad51e51d"
  },
  {
    "url": "assets/js/86.a8aa9f19.js",
    "revision": "af8ed1f025e05a9a3bf0a89aa107555f"
  },
  {
    "url": "assets/js/87.3fd39d51.js",
    "revision": "7ad3fbc5021b7bf6bb1a070e99875f51"
  },
  {
    "url": "assets/js/88.d52885f3.js",
    "revision": "332835b85ec1ce89e3a8c02606675be8"
  },
  {
    "url": "assets/js/89.23619330.js",
    "revision": "efec51710291e30a620137f91cabb4f3"
  },
  {
    "url": "assets/js/9.87cd171b.js",
    "revision": "09ac2a291466db1d881498af5aa28d8a"
  },
  {
    "url": "assets/js/90.bad76de3.js",
    "revision": "e8260642f373cb7482bb6f6ba6aaba77"
  },
  {
    "url": "assets/js/91.92f6d63b.js",
    "revision": "45b186c11d459708c6d9da06ed0eabee"
  },
  {
    "url": "assets/js/92.dfe3d68f.js",
    "revision": "e26b7b48440eacb83d7806ed79400337"
  },
  {
    "url": "assets/js/93.998496c3.js",
    "revision": "ae9539962c897e407dc3479494b43ea4"
  },
  {
    "url": "assets/js/94.c3d3a4e0.js",
    "revision": "680cfb386f041957264a739ca90c8b6a"
  },
  {
    "url": "assets/js/95.d16fe9d1.js",
    "revision": "98743917e78609b51496ae40c129d950"
  },
  {
    "url": "assets/js/96.260e3598.js",
    "revision": "e0e33a9121d76a8e3be9efb9b8e8cd70"
  },
  {
    "url": "assets/js/97.3b49c9c4.js",
    "revision": "e249b02ed9347a43bbddb7f3152bca0f"
  },
  {
    "url": "assets/js/98.029b342f.js",
    "revision": "9041ad98fc9e177185c72984ced2f28d"
  },
  {
    "url": "assets/js/99.ad74d2bf.js",
    "revision": "68d973c5bc657722c079d0f2731e44bd"
  },
  {
    "url": "assets/js/app.5c400c29.js",
    "revision": "b5e37ff8ac0555042006889b389099b1"
  },
  {
    "url": "assets/js/vendors~docsearch.853f9491.js",
    "revision": "2a35ff79546433b513381c2030dc1b6f"
  },
  {
    "url": "index.html",
    "revision": "170ea0937db8862dd40998d5106c414c"
  },
  {
    "url": "logo.png",
    "revision": "b6fe2a7e1a8fcc87485babdbcb598c31"
  },
  {
    "url": "master/advanced/events.html",
    "revision": "e493a0cc83abb25366f75ffeac9715e7"
  },
  {
    "url": "master/advanced/helpers.html",
    "revision": "a014007411fcb3ae450bf6eef5f349fb"
  },
  {
    "url": "master/advanced/index.html",
    "revision": "04bba3909a8fb3a13466fa7b4b6f45f2"
  },
  {
    "url": "master/advanced/override-core-model.html",
    "revision": "02b6455ef043a6a32250178c8c0d0d72"
  },
  {
    "url": "master/advanced/render-event.html",
    "revision": "47b38ae7a378a8861e2c11cd944c35ee"
  },
  {
    "url": "master/api/attribute_families.html",
    "revision": "8d146260e6d854d5d3a3ec5b329c6638"
  },
  {
    "url": "master/api/attribute_groups.html",
    "revision": "4e72c6e2b215ec85c432ba42bf247f19"
  },
  {
    "url": "master/api/attribute_options.html",
    "revision": "90d73a5f704ea6c8f66fa4039f5768d9"
  },
  {
    "url": "master/api/attribute.html",
    "revision": "ddc76818264e82df6a232db7364c57e0"
  },
  {
    "url": "master/api/authenticate.html",
    "revision": "4e74693b120ed563db791366f6272526"
  },
  {
    "url": "master/api/category_field_options.html",
    "revision": "c2612050ec3c6cb90d6e3720579e43d3"
  },
  {
    "url": "master/api/category_fields.html",
    "revision": "0f6aec5204ac6c882e92ddf5246029ce"
  },
  {
    "url": "master/api/category.html",
    "revision": "573785eb5a82bc138535f8ac83a86f9d"
  },
  {
    "url": "master/api/channel.html",
    "revision": "cfabf1871115ef6817a665d132fb373b"
  },
  {
    "url": "master/api/configurable_products.html",
    "revision": "b4398ddc2191a91f33803b97b96b3f8e"
  },
  {
    "url": "master/api/configuration.html",
    "revision": "3bac92bc9db2c564aed51f75e0c67383"
  },
  {
    "url": "master/api/currency.html",
    "revision": "3e9c8b55fe42ae959a1535daf9a6fbf2"
  },
  {
    "url": "master/api/explanation.html",
    "revision": "b9f0951d3eda910b8b81ce1ca5b843c6"
  },
  {
    "url": "master/api/getting-started-with-the-api.html",
    "revision": "6cdef41bf5e14e99a8dfdd89d41f91c9"
  },
  {
    "url": "master/api/index.html",
    "revision": "4dadd279988e7b5c6dca1d78c03304bb"
  },
  {
    "url": "master/api/locales.html",
    "revision": "1d1a31ae41c2281009ff3473375e1b9e"
  },
  {
    "url": "master/api/media.html",
    "revision": "391530663e2835941211b7f5c687f63b"
  },
  {
    "url": "master/api/postman_collection.html",
    "revision": "7c6a6aca7f223e9039640a798bfb8873"
  },
  {
    "url": "master/api/product.html",
    "revision": "59d810d2030b4d891fc7c66bf98b528e"
  },
  {
    "url": "master/architecture/frontend.html",
    "revision": "b3839cf5ced74ae373ad6b46cfbefea0"
  },
  {
    "url": "master/architecture/index.html",
    "revision": "c99c73b1205ecb9c574868f0dd755645"
  },
  {
    "url": "master/architecture/modular-design.html",
    "revision": "84287a9ab390d9a567da274352a80185"
  },
  {
    "url": "master/architecture/packages.html",
    "revision": "c5812ccfcb9e29b9c8e03cf9142d4ef1"
  },
  {
    "url": "master/architecture/repository-pattern.html",
    "revision": "2e6e50e52012af70b3adaf4c5fe14d72"
  },
  {
    "url": "master/introduction/index.html",
    "revision": "2a3f52d938ab1eab4da857f265a953c2"
  },
  {
    "url": "master/introduction/installation.html",
    "revision": "bbb88df01e9b43e1c71781142655b60b"
  },
  {
    "url": "master/introduction/requirements.html",
    "revision": "b00e68f92595c3d70cf5328adca7282f"
  },
  {
    "url": "master/packages/add-menu-in-admin.html",
    "revision": "5d5b70882e924f9421586e54287bfa4d"
  },
  {
    "url": "master/packages/blade-components.html",
    "revision": "f4b480eb53fad940da81de183a48392e"
  },
  {
    "url": "master/packages/bundling-assets.html",
    "revision": "28bb6464c943aa991a4623181f54d853"
  },
  {
    "url": "master/packages/controllers.html",
    "revision": "f152e7af780c1ccda2c758cb523c9d74"
  },
  {
    "url": "master/packages/create-acl.html",
    "revision": "c08480a63a9967c23ffa8809ca0b65e3"
  },
  {
    "url": "master/packages/create-migrations.html",
    "revision": "5a887d63e48a93c24712168b93370bfb"
  },
  {
    "url": "master/packages/create-models.html",
    "revision": "ec7ec7620b351a01894cb9ad0e5dfcd3"
  },
  {
    "url": "master/packages/create-package.html",
    "revision": "450b73daeea68265364b09cd5efc4e25"
  },
  {
    "url": "master/packages/data-transfer.html",
    "revision": "e82e7e49076d6cdae2970165fb1aa15c"
  },
  {
    "url": "master/packages/datagrid.html",
    "revision": "43762644ae1343f43730df266deb7e3f"
  },
  {
    "url": "master/packages/history.html",
    "revision": "7697aa4611379d00e8a2bd8a12abeb43"
  },
  {
    "url": "master/packages/index.html",
    "revision": "a82e1258e999a43c17b02ff807d04c31"
  },
  {
    "url": "master/packages/layouts.html",
    "revision": "f1501062313d074e6fbb900beb0450db"
  },
  {
    "url": "master/packages/localization.html",
    "revision": "fd37c48637edad7b77f909fd5bc80481"
  },
  {
    "url": "master/packages/routes.html",
    "revision": "e9d62f92c2749b14484d517f46378213"
  },
  {
    "url": "master/packages/store-data-through-repositories.html",
    "revision": "cd08ccb13cc3c2cc573f805d8b4ab857"
  },
  {
    "url": "master/packages/validation.html",
    "revision": "648e09682d6663186bb6c1d034d4d0b4"
  },
  {
    "url": "master/packages/views.html",
    "revision": "06f743cfd11ed2bb8f6f86941f4b9a52"
  },
  {
    "url": "master/plugins/add-side-menu.html",
    "revision": "2e82bdaac0ae8d81e02a907fc1e8bd57"
  },
  {
    "url": "master/plugins/create-export-profile.html",
    "revision": "73b8a2e9119645c8ce56c071ef49be33"
  },
  {
    "url": "master/plugins/create-import-profile.html",
    "revision": "523378e681779695f24667f9dd522ef8"
  },
  {
    "url": "master/plugins/create-plugin.html",
    "revision": "7469b9747a2da366e9c1a1d70ca5d9a2"
  },
  {
    "url": "master/plugins/index.html",
    "revision": "19bafcf8bbdb2d46f89c8248fe762ee7"
  },
  {
    "url": "master/plugins/plugin-deployment.html",
    "revision": "b486030b07b5c5a95acc2849ca4a4cb0"
  },
  {
    "url": "master/prologue/contribution-guide.html",
    "revision": "e44aa6c9f9804dc9b063fba742131d1d"
  },
  {
    "url": "master/prologue/index.html",
    "revision": "79b16e0462ac9150f362b7cb96e1b367"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
