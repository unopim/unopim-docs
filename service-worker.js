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
    "revision": "124f7cf5ae37c23a8581662d6f37311b"
  },
  {
    "url": "0.1/advanced/helpers.html",
    "revision": "5bd057d6ee54d6861d0b8780f7c21463"
  },
  {
    "url": "0.1/advanced/index.html",
    "revision": "6f877d7d32566d95a8d800035028f29a"
  },
  {
    "url": "0.1/advanced/override-core-model.html",
    "revision": "bac029343ed63e5fe916bf559862bfa3"
  },
  {
    "url": "0.1/advanced/render-event.html",
    "revision": "9cd13ad6f49c14546ccab88648a5ab5c"
  },
  {
    "url": "0.1/api/attribute_families.html",
    "revision": "25ad3e7340df10ea4d42ac4257d136e9"
  },
  {
    "url": "0.1/api/attribute_groups.html",
    "revision": "e4b0a4070c892779b9841d27a4e85850"
  },
  {
    "url": "0.1/api/attribute_options.html",
    "revision": "c8b189d2e5874166670a13c45b0c048c"
  },
  {
    "url": "0.1/api/attribute.html",
    "revision": "a5fac08016da56ca21fcc3e99f69e4b9"
  },
  {
    "url": "0.1/api/authenticate.html",
    "revision": "a71e908da234708b43b6ad8ebf1f1e8a"
  },
  {
    "url": "0.1/api/category_field_options.html",
    "revision": "e3fa4907133d6354f3ae3279cd1a58d5"
  },
  {
    "url": "0.1/api/category_fields.html",
    "revision": "0a13e1661f420c99e84e78dd75155810"
  },
  {
    "url": "0.1/api/category.html",
    "revision": "99ebd03e1c28d9b3a2ab75a99c228747"
  },
  {
    "url": "0.1/api/channel.html",
    "revision": "ec0a273d2e655d7ea5badd3db3d31020"
  },
  {
    "url": "0.1/api/configurable_products.html",
    "revision": "2bbd5ff29cc4aa6faf1999750bc44fdd"
  },
  {
    "url": "0.1/api/configuration.html",
    "revision": "ab221f5207dbcd8a414775245beee2a9"
  },
  {
    "url": "0.1/api/currency.html",
    "revision": "208bf6dd7f2b487e397766473b57e100"
  },
  {
    "url": "0.1/api/explanation.html",
    "revision": "fa3cab9983fc40eb8e54a83077abadf1"
  },
  {
    "url": "0.1/api/getting-started-with-the-api.html",
    "revision": "9479f0b300f29a8f4dfcd7ed26753762"
  },
  {
    "url": "0.1/api/index.html",
    "revision": "0864e5ca56bb8eb65dff318c9514c40e"
  },
  {
    "url": "0.1/api/locales.html",
    "revision": "a4cbf3e156381c9a0b207ff84118e740"
  },
  {
    "url": "0.1/api/media.html",
    "revision": "0a6aeb71e5d8574d90b35909c304ee14"
  },
  {
    "url": "0.1/api/postman_collection.html",
    "revision": "504a815848a07d52e8920f4a14f29550"
  },
  {
    "url": "0.1/api/product.html",
    "revision": "221e6979d2b9bc45a2382794e6f37928"
  },
  {
    "url": "0.1/architecture/frontend.html",
    "revision": "d233ec34ffb8fe74d3fbcac3c3dfdb0f"
  },
  {
    "url": "0.1/architecture/index.html",
    "revision": "caeb0dbf9d357b7ac311ad0c1ff2bbc4"
  },
  {
    "url": "0.1/architecture/modular-design.html",
    "revision": "4eeaf299610ad59d1844ffc1b0a730aa"
  },
  {
    "url": "0.1/architecture/packages.html",
    "revision": "9ef44dc7021e76198fcd836c814acb44"
  },
  {
    "url": "0.1/architecture/repository-pattern.html",
    "revision": "156a2a7c9752fa524b485fe3a760c418"
  },
  {
    "url": "0.1/introduction/index.html",
    "revision": "fe830bc08ef9f852b8a0cd3e8884e578"
  },
  {
    "url": "0.1/introduction/installation.html",
    "revision": "bd769557f6215cc339e00a9155666bae"
  },
  {
    "url": "0.1/introduction/requirements.html",
    "revision": "be1521e3fd2cb0a6dc75f1a6daf09277"
  },
  {
    "url": "0.1/packages/add-menu-in-admin.html",
    "revision": "fcd6bd2d79a507e4c2c6a4ed2baf4523"
  },
  {
    "url": "0.1/packages/blade-components.html",
    "revision": "1a15877b908ecdc8bb6dab1dc0b522a2"
  },
  {
    "url": "0.1/packages/bundling-assets.html",
    "revision": "8eaad40b86b5035772407509aba03f7a"
  },
  {
    "url": "0.1/packages/controllers.html",
    "revision": "41590265afba0fc28b0a5c5f01728fad"
  },
  {
    "url": "0.1/packages/create-acl.html",
    "revision": "6a626c29fddb4fa0ea38487ab53f03e9"
  },
  {
    "url": "0.1/packages/create-migrations.html",
    "revision": "531fef99829be8ca67d00ab399aa3125"
  },
  {
    "url": "0.1/packages/create-models.html",
    "revision": "cfda4968c0772c4e0ab67346396b7467"
  },
  {
    "url": "0.1/packages/create-package.html",
    "revision": "239c5fb9aede7c452d6276000f1d2437"
  },
  {
    "url": "0.1/packages/data-transfer.html",
    "revision": "ac7a7fcd9198e7de6cb5c1ed13b6a5c1"
  },
  {
    "url": "0.1/packages/datagrid.html",
    "revision": "d20581cc13e630d22222c44bd6464967"
  },
  {
    "url": "0.1/packages/history.html",
    "revision": "da858db8e09d9451a2e857ff42ec4b6e"
  },
  {
    "url": "0.1/packages/index.html",
    "revision": "3d74488b0238e8c3458a45faf660eda5"
  },
  {
    "url": "0.1/packages/layouts.html",
    "revision": "2ddd3906119ce091b1df194a2de7ec8b"
  },
  {
    "url": "0.1/packages/localization.html",
    "revision": "697067e582095a95d4df1a6fcb150d33"
  },
  {
    "url": "0.1/packages/routes.html",
    "revision": "0e7d8bb450ec5cc3ccef89f0436bcd0c"
  },
  {
    "url": "0.1/packages/store-data-through-repositories.html",
    "revision": "4ebd059fe8d2e2c35b262c9d7ad5e70d"
  },
  {
    "url": "0.1/packages/validation.html",
    "revision": "dd9d0122556a9e46dce0207d291a56c9"
  },
  {
    "url": "0.1/packages/views.html",
    "revision": "bdedb85fb907d4d6fd00fc603725dbfa"
  },
  {
    "url": "0.1/plugins/add-side-menu.html",
    "revision": "0ba1b8d350f27ad9aee1d780db6fd4f8"
  },
  {
    "url": "0.1/plugins/create-export-profile.html",
    "revision": "db19b54421dec2d991cb2d34778bf540"
  },
  {
    "url": "0.1/plugins/create-import-profile.html",
    "revision": "469a6c8d76121dc4820b14cdb68d76d3"
  },
  {
    "url": "0.1/plugins/create-plugin.html",
    "revision": "a689027bd5615e68982b23960ef0e198"
  },
  {
    "url": "0.1/plugins/index.html",
    "revision": "02c49472346c8f9422ec20509e7bc849"
  },
  {
    "url": "0.1/plugins/plugin-deployment.html",
    "revision": "24aea0c94b44bc6e17d74718d4e838a3"
  },
  {
    "url": "0.1/prologue/contribution-guide.html",
    "revision": "6bcb331c5c078ca978289fd350b1833f"
  },
  {
    "url": "0.1/prologue/index.html",
    "revision": "223cce81e9a1469b8038e11a7da562d0"
  },
  {
    "url": "404.html",
    "revision": "555c0f5f91c5705aa1a77a98a62785fa"
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
    "url": "assets/js/101.3ca69aa2.js",
    "revision": "3c9fed73116dfe74e6f74ac9f25a2485"
  },
  {
    "url": "assets/js/102.d8d5f5aa.js",
    "revision": "dec02f3e140d05dc0eb90fc3d34a823f"
  },
  {
    "url": "assets/js/103.0b78a1e6.js",
    "revision": "24452b7b5724fe4cff329abbe371d5da"
  },
  {
    "url": "assets/js/104.a860f74b.js",
    "revision": "275c89960585bcd0e062bec285fdb602"
  },
  {
    "url": "assets/js/105.654a844b.js",
    "revision": "725bb31112328a5c6463609435d428bc"
  },
  {
    "url": "assets/js/106.2621e430.js",
    "revision": "4f664fa7ed8fb6727f8f48805a4c11bb"
  },
  {
    "url": "assets/js/107.53e00172.js",
    "revision": "3f2efa92fd1e6de0e799a3935bda2285"
  },
  {
    "url": "assets/js/108.20b4dc9a.js",
    "revision": "be35a636a23da08d10333a181bdecc49"
  },
  {
    "url": "assets/js/109.3ccd4823.js",
    "revision": "b66eda20398f93e4ae676f2f9371e22f"
  },
  {
    "url": "assets/js/11.7a5942b2.js",
    "revision": "47f2ed28b814943a0210ae159a901a95"
  },
  {
    "url": "assets/js/110.65420aef.js",
    "revision": "8cfc52c96f29973ba30214ab57948e55"
  },
  {
    "url": "assets/js/111.7e59c0a9.js",
    "revision": "8fcb90b4ae4895507ae0f8a9cd5e79bc"
  },
  {
    "url": "assets/js/112.d983e8b1.js",
    "revision": "a2b6ddbb10b18ed3a65db73d2a7a1f80"
  },
  {
    "url": "assets/js/113.0cda7498.js",
    "revision": "f2d9b1bc037ae979045389d060b42329"
  },
  {
    "url": "assets/js/114.88265cb5.js",
    "revision": "e8d640ce3b3b614b66f63700b0a18b2c"
  },
  {
    "url": "assets/js/115.339dd7bc.js",
    "revision": "b42f52911ce38e7553a84e396f87a5c6"
  },
  {
    "url": "assets/js/116.c5b5a641.js",
    "revision": "5cf774b2d63dc4738efe898c31a57580"
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
    "url": "assets/js/125.421ea950.js",
    "revision": "497318a50d735150e87c6d1ce348701e"
  },
  {
    "url": "assets/js/126.1eeb2d85.js",
    "revision": "b8888606ad3148137e484b0254e3cd35"
  },
  {
    "url": "assets/js/127.974c3b90.js",
    "revision": "83ae946e0720f74cdaf8e599a886a73f"
  },
  {
    "url": "assets/js/128.5f4896a2.js",
    "revision": "3769fb28f48bd9f94c9c3335dbb04b31"
  },
  {
    "url": "assets/js/129.2d42b4c2.js",
    "revision": "87c34b0900a141e665e81c846918fdfd"
  },
  {
    "url": "assets/js/13.9c2c520e.js",
    "revision": "13c4145d59b2ca162df6408a8d21b4c9"
  },
  {
    "url": "assets/js/130.3b57e21b.js",
    "revision": "95a0a05e2e820af92f80071e35d0e219"
  },
  {
    "url": "assets/js/131.816a8313.js",
    "revision": "6ad50a86491f1bbd2baf4da400f252a9"
  },
  {
    "url": "assets/js/132.fa4424e5.js",
    "revision": "d68837a85b0bbe1ef76d2cd4897aa161"
  },
  {
    "url": "assets/js/133.fc6f5410.js",
    "revision": "905a10b07542b887d044a9332dfcf69f"
  },
  {
    "url": "assets/js/134.48d50706.js",
    "revision": "aa728038ee5d1687f7a9d68e3c7aee74"
  },
  {
    "url": "assets/js/135.7eecbb5c.js",
    "revision": "bac77bab8e81a7b56ffd400049d08e4e"
  },
  {
    "url": "assets/js/136.45392de5.js",
    "revision": "0736cbc973cae17003aae99ec472493d"
  },
  {
    "url": "assets/js/137.56fa407d.js",
    "revision": "e5dd477176407742962a56224afc5d47"
  },
  {
    "url": "assets/js/138.1e58f9fb.js",
    "revision": "b3019d3ebc527b654950742931ee111e"
  },
  {
    "url": "assets/js/14.8828b582.js",
    "revision": "2002ff8361fa0734a700a82ebe76f702"
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
    "url": "assets/js/26.dce6da9d.js",
    "revision": "a98748282e90231ea6a495ccb4e5c3c0"
  },
  {
    "url": "assets/js/27.97558a31.js",
    "revision": "f4a23ed9ab8278219c35eaaffeced843"
  },
  {
    "url": "assets/js/28.6913b540.js",
    "revision": "26ad6dbb043aceaa3f2aba9fc7959d27"
  },
  {
    "url": "assets/js/29.de19ad48.js",
    "revision": "dcb079123cc83da3affd89610264d1d9"
  },
  {
    "url": "assets/js/3.c08788cf.js",
    "revision": "9a5397d300c118eaed270de3385d25b0"
  },
  {
    "url": "assets/js/30.754f7f63.js",
    "revision": "8d3406c89a1ac08c70fd6c4dd1e33e0b"
  },
  {
    "url": "assets/js/31.c0a4244b.js",
    "revision": "eaf766be7f695907aabc171d4d6a1f94"
  },
  {
    "url": "assets/js/32.471dcd3c.js",
    "revision": "37650844ba4713270d56b8bac42f61fd"
  },
  {
    "url": "assets/js/33.8508f937.js",
    "revision": "4309eeced3a625686f6110ea8d1d1904"
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
    "url": "assets/js/38.537b489e.js",
    "revision": "aea0e9df69d5ea00b09b16ad91c67e4b"
  },
  {
    "url": "assets/js/39.f8bfd296.js",
    "revision": "1dfd26985f3d9030da713b54d1649514"
  },
  {
    "url": "assets/js/4.8063a9b6.js",
    "revision": "98ecdc2047bc9fb2330c842d05d9372d"
  },
  {
    "url": "assets/js/40.cedc89b1.js",
    "revision": "9e762ab9d547e2c96b871d3e540700a7"
  },
  {
    "url": "assets/js/41.aa210a1b.js",
    "revision": "d56d3a5d038170d39229030338f2abc9"
  },
  {
    "url": "assets/js/42.56c62b6d.js",
    "revision": "ba07365d436e20f6d2ccf2d91031da77"
  },
  {
    "url": "assets/js/43.f624e1e6.js",
    "revision": "6f149a4af3b3230262bab3e7a253c4fb"
  },
  {
    "url": "assets/js/44.0fd27e92.js",
    "revision": "930fae434809a989fc8374cfe39ef43e"
  },
  {
    "url": "assets/js/45.15125963.js",
    "revision": "9f92da1d6e0fed02316e14862a3825ba"
  },
  {
    "url": "assets/js/46.bd7446e3.js",
    "revision": "fba43c52e018f6fb340f7eb0b1cde81b"
  },
  {
    "url": "assets/js/47.86708151.js",
    "revision": "4caafbfb28017d3f84ac53c5d6ec4b42"
  },
  {
    "url": "assets/js/48.50c4aac1.js",
    "revision": "a79226f9ff66a40e901043c751b2a4c2"
  },
  {
    "url": "assets/js/49.bf8862c8.js",
    "revision": "ae4f79aaf36995e43feead0935284fb9"
  },
  {
    "url": "assets/js/5.5873d029.js",
    "revision": "1a8e799eb717b41b19039adaf73f51e6"
  },
  {
    "url": "assets/js/50.133aa893.js",
    "revision": "0cf9c83e92965bca7b206be0e4f086b8"
  },
  {
    "url": "assets/js/51.a1ef1742.js",
    "revision": "4cf63a14bca97b87d06d838a596b84d7"
  },
  {
    "url": "assets/js/52.e956e178.js",
    "revision": "b84dae18e27d24f05254ae11e96a5860"
  },
  {
    "url": "assets/js/53.11e78756.js",
    "revision": "be13e16d7b07cebe239bca565eb70907"
  },
  {
    "url": "assets/js/54.bc310a80.js",
    "revision": "f87de776d5a506c93b195f21412012dd"
  },
  {
    "url": "assets/js/55.fe9a7f6c.js",
    "revision": "58be13a0da7c043a0ab0f11424eff7a8"
  },
  {
    "url": "assets/js/56.6cf7e1ce.js",
    "revision": "187160e6d8f264d3665b52b81fc9f839"
  },
  {
    "url": "assets/js/57.97d732cf.js",
    "revision": "920719f13b436a4dceedab0db40b9b18"
  },
  {
    "url": "assets/js/58.365da79a.js",
    "revision": "28f106dfa697cf5e28f288b48d9cf95f"
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
    "url": "assets/js/61.1b117942.js",
    "revision": "822de176b96831ff1118f5d8e834297c"
  },
  {
    "url": "assets/js/62.f93dec74.js",
    "revision": "0f52c6f224622ef7b7a4cc2a2d1996db"
  },
  {
    "url": "assets/js/63.36eef7bf.js",
    "revision": "b083d945fca639a47f51fb647f24138b"
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
    "url": "assets/js/67.75c41163.js",
    "revision": "e0a30cb0c10c9166ba1594dade2a8cc7"
  },
  {
    "url": "assets/js/68.bf20cda5.js",
    "revision": "81336feb76d27d1376399c76d88e74f3"
  },
  {
    "url": "assets/js/69.643b734a.js",
    "revision": "965c8fe666bb3a992ce727fbff3cd67d"
  },
  {
    "url": "assets/js/70.56587591.js",
    "revision": "b184133f83220832d9bac44cd5351a94"
  },
  {
    "url": "assets/js/71.fc163cb5.js",
    "revision": "aa022fdce6414f097c2493f49050f569"
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
    "url": "assets/js/74.b9a9aba8.js",
    "revision": "51b86ab8b8748d05f7c0af699174a7c5"
  },
  {
    "url": "assets/js/75.0b1e276a.js",
    "revision": "d1eb3f5a81bb591f372689998511e83c"
  },
  {
    "url": "assets/js/76.f81f30e1.js",
    "revision": "f915a30a0e00f7d05596a8adadbbc1c4"
  },
  {
    "url": "assets/js/77.5c4122f1.js",
    "revision": "1060158f00e293ebcf6db5f70316cf1a"
  },
  {
    "url": "assets/js/78.c53f955c.js",
    "revision": "ed6c53215e7e5d9c0771a5d3650c7c86"
  },
  {
    "url": "assets/js/79.f95d0ed5.js",
    "revision": "d1ddfa3eab8cc866d062ce1b75756a15"
  },
  {
    "url": "assets/js/8.11eb4c04.js",
    "revision": "e6f1463d058e8995cf88e3027da8e36c"
  },
  {
    "url": "assets/js/80.5c550fcc.js",
    "revision": "480e81cb2e0f6786a3dccac73afd0d58"
  },
  {
    "url": "assets/js/81.e4271b0e.js",
    "revision": "f9871f6175bfcdc23292579587989ab9"
  },
  {
    "url": "assets/js/82.65fa1ca8.js",
    "revision": "5dd8425b7a767ae2ffe01c54748737fc"
  },
  {
    "url": "assets/js/83.e5778419.js",
    "revision": "0e4d079136b1e8bef5e1649c2dd96584"
  },
  {
    "url": "assets/js/84.ce87e452.js",
    "revision": "4cc4bc69a5233e8f58c47e68e484d4ff"
  },
  {
    "url": "assets/js/85.06160d31.js",
    "revision": "dac412e55d2ea8c4b6b8cb7e37c23c77"
  },
  {
    "url": "assets/js/86.804769fd.js",
    "revision": "8f6ba0799b814eb89297a27be3ef1122"
  },
  {
    "url": "assets/js/87.bede7d8e.js",
    "revision": "c8bebc3e4dd5a777fa952fbfd269038b"
  },
  {
    "url": "assets/js/88.d52885f3.js",
    "revision": "332835b85ec1ce89e3a8c02606675be8"
  },
  {
    "url": "assets/js/89.e938a665.js",
    "revision": "4a645f3eaf767e3940c79f9a302c8b16"
  },
  {
    "url": "assets/js/9.87cd171b.js",
    "revision": "09ac2a291466db1d881498af5aa28d8a"
  },
  {
    "url": "assets/js/90.498847b6.js",
    "revision": "dff1449ed31ab5263079179d29b25552"
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
    "url": "assets/js/93.858f12e7.js",
    "revision": "7bc70f9f82d3d8e42038aab8de50e5ab"
  },
  {
    "url": "assets/js/94.e2a63bce.js",
    "revision": "2a2fb05131f87eb9b1e7a9e9eab5428b"
  },
  {
    "url": "assets/js/95.0a5429c7.js",
    "revision": "15fee68b5a4e03da7ef79fe173e64dec"
  },
  {
    "url": "assets/js/96.dde44de3.js",
    "revision": "3cf730de53db71db10e7d663e230043b"
  },
  {
    "url": "assets/js/97.31c3ef0b.js",
    "revision": "86e5df17671f6cf5eabad96522d1d8e2"
  },
  {
    "url": "assets/js/98.33089bef.js",
    "revision": "c62e1e9c409c0695553ef44c01c6c4ff"
  },
  {
    "url": "assets/js/99.683d859e.js",
    "revision": "d93b28cd7eae8f1cf690b191e3a85db1"
  },
  {
    "url": "assets/js/app.1d23e517.js",
    "revision": "3d810529893bf0000990af98c8d76296"
  },
  {
    "url": "assets/js/vendors~docsearch.853f9491.js",
    "revision": "2a35ff79546433b513381c2030dc1b6f"
  },
  {
    "url": "index.html",
    "revision": "c7e1bd201de5bec8ae78e55f47cea248"
  },
  {
    "url": "logo.png",
    "revision": "b6fe2a7e1a8fcc87485babdbcb598c31"
  },
  {
    "url": "master/advanced/events.html",
    "revision": "dda1d31b3d4e5491252f027ad60233d0"
  },
  {
    "url": "master/advanced/helpers.html",
    "revision": "30f87ad88e9e557082253c6a888b0005"
  },
  {
    "url": "master/advanced/index.html",
    "revision": "865927be0fd519bf6f1d9c438fb9f6a2"
  },
  {
    "url": "master/advanced/override-core-model.html",
    "revision": "ff5314c1ea6a6943cb08b7cc3f4e0fbe"
  },
  {
    "url": "master/advanced/render-event.html",
    "revision": "44f3b30a7fa02be0b3165aab62c3ba71"
  },
  {
    "url": "master/api/attribute_families.html",
    "revision": "3d391cbadfbf1ccb9596aac23a44da10"
  },
  {
    "url": "master/api/attribute_groups.html",
    "revision": "0c0933232134fa8e8f2d5b1b4c0d40f6"
  },
  {
    "url": "master/api/attribute_options.html",
    "revision": "8fc85f83eaf97ff0a0a1f66ee4ea95af"
  },
  {
    "url": "master/api/attribute.html",
    "revision": "5a03396f54053d2b0fe8f976c2a8d83d"
  },
  {
    "url": "master/api/authenticate.html",
    "revision": "f08afd55a642267477cfd24ece1fba93"
  },
  {
    "url": "master/api/category_field_options.html",
    "revision": "4d201f54298370e4b50547adc731ffe7"
  },
  {
    "url": "master/api/category_fields.html",
    "revision": "dc8cffa9f3525a9c8fd1658a8887b68f"
  },
  {
    "url": "master/api/category.html",
    "revision": "594465f420bc73be63125c15569f5525"
  },
  {
    "url": "master/api/channel.html",
    "revision": "01debf2fa456b9f3e660fe9e061fa38f"
  },
  {
    "url": "master/api/configurable_products.html",
    "revision": "9780b4aa6e80e4c76332e7e594918a2a"
  },
  {
    "url": "master/api/configuration.html",
    "revision": "3560cf4d68290677fbd8a4d7917970df"
  },
  {
    "url": "master/api/currency.html",
    "revision": "d009ab4b30a699c19f4ec7d6b9045431"
  },
  {
    "url": "master/api/explanation.html",
    "revision": "062f23a9de65151e8dd989b33306e31b"
  },
  {
    "url": "master/api/getting-started-with-the-api.html",
    "revision": "113c882f14ea4b1a04266d66ce6bd4cb"
  },
  {
    "url": "master/api/index.html",
    "revision": "a997a046bb89323bc93ce0fa27eb2a87"
  },
  {
    "url": "master/api/locales.html",
    "revision": "fe1b2f75c7887c2988f9496b8d2ceef0"
  },
  {
    "url": "master/api/media.html",
    "revision": "328cd55e9cf60a16791cb3af02ad7688"
  },
  {
    "url": "master/api/postman_collection.html",
    "revision": "299b6ed44760f15c06bb27397039bc96"
  },
  {
    "url": "master/api/product.html",
    "revision": "197dee6b937a30ee38e869acb944efde"
  },
  {
    "url": "master/architecture/frontend.html",
    "revision": "c1eba93851adcc60428b54c16322ae79"
  },
  {
    "url": "master/architecture/index.html",
    "revision": "a297159b3e749fe59b775eb5d0ae8fcb"
  },
  {
    "url": "master/architecture/modular-design.html",
    "revision": "3c1c430a3a872ebb82bbc6fe0f4d2b50"
  },
  {
    "url": "master/architecture/packages.html",
    "revision": "89c2980002df8be53c1db2caed9837fa"
  },
  {
    "url": "master/architecture/repository-pattern.html",
    "revision": "f0ad30b4e7b78983d97f21d98e2a03d6"
  },
  {
    "url": "master/introduction/index.html",
    "revision": "e636c58f9f307e4cdc8a18f5753e0266"
  },
  {
    "url": "master/introduction/installation.html",
    "revision": "468f2f295c082d69e55eb1cc5a27e587"
  },
  {
    "url": "master/introduction/requirements.html",
    "revision": "8ffd872f95c2a68361de0fdf73386234"
  },
  {
    "url": "master/packages/add-menu-in-admin.html",
    "revision": "062c680bf6efd4866f92df6d8d9429bd"
  },
  {
    "url": "master/packages/blade-components.html",
    "revision": "5e7233b39e3b57bb057210bd85fbf48d"
  },
  {
    "url": "master/packages/bundling-assets.html",
    "revision": "af3aedf8ef34db7900cb67df531fa43a"
  },
  {
    "url": "master/packages/controllers.html",
    "revision": "faa4b92dcd53942626c1d649bf84ef48"
  },
  {
    "url": "master/packages/create-acl.html",
    "revision": "a196ccd1119a2bb40c3274648421e026"
  },
  {
    "url": "master/packages/create-migrations.html",
    "revision": "73d9647889e12e840804e6b7d5121e55"
  },
  {
    "url": "master/packages/create-models.html",
    "revision": "82d41b53ddf5f5b69410000486b03277"
  },
  {
    "url": "master/packages/create-package.html",
    "revision": "1aa425aaed64195df33c7b002523851c"
  },
  {
    "url": "master/packages/data-transfer.html",
    "revision": "5df48de047d32888c7f411f7000463d6"
  },
  {
    "url": "master/packages/datagrid.html",
    "revision": "5898ff685da1f7d011bef6ae2c77d2ef"
  },
  {
    "url": "master/packages/history.html",
    "revision": "ec4cf8896f09939b886463c73ac78ad1"
  },
  {
    "url": "master/packages/index.html",
    "revision": "d4eff6099822d6ecb45a361a10fee839"
  },
  {
    "url": "master/packages/layouts.html",
    "revision": "86325f0d2d29a98da3cd25d079dad482"
  },
  {
    "url": "master/packages/localization.html",
    "revision": "bfe976e7a625b1478ebb8e13bab3ea61"
  },
  {
    "url": "master/packages/routes.html",
    "revision": "f72fafdc41cd8e4d9e0a44fa7fa2bd0e"
  },
  {
    "url": "master/packages/store-data-through-repositories.html",
    "revision": "1dab9ee62fb81700cd03222175aef331"
  },
  {
    "url": "master/packages/validation.html",
    "revision": "d7293eae9cb5c727a07fb451a61ef65c"
  },
  {
    "url": "master/packages/views.html",
    "revision": "469839f56dae1f4a4593ad1e008d79e0"
  },
  {
    "url": "master/plugins/add-side-menu.html",
    "revision": "bec16bd037d7a4846b27a9a4a51ff144"
  },
  {
    "url": "master/plugins/create-export-profile.html",
    "revision": "f1f992dd306d28394e9e3bdff6c96e4e"
  },
  {
    "url": "master/plugins/create-import-profile.html",
    "revision": "807525be5cd6837dcb8402c763539e3a"
  },
  {
    "url": "master/plugins/create-plugin.html",
    "revision": "0ecea02eb29255f5a0cb34946e135795"
  },
  {
    "url": "master/plugins/index.html",
    "revision": "a762e9c997b8bb9c2210d75b5b12fa8b"
  },
  {
    "url": "master/plugins/plugin-deployment.html",
    "revision": "7ed6922e5b3f52244c6af83bd5fba024"
  },
  {
    "url": "master/prologue/contribution-guide.html",
    "revision": "6fe12466bf172a32c47fd0de26b777d6"
  },
  {
    "url": "master/prologue/index.html",
    "revision": "17b66bc564ad3649622f7f7d3c314ed3"
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
