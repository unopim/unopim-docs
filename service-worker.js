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
    "url": "0.1/advanced/create-data-import.html",
    "revision": "f842c1fd368c23333193178eb919ff1d"
  },
  {
    "url": "0.1/advanced/create-product-type.html",
    "revision": "d5f9f966de90d43c1b57a5acdff499ec"
  },
  {
    "url": "0.1/advanced/events.html",
    "revision": "9667249d3f70cc50bfe647a2672a7857"
  },
  {
    "url": "0.1/advanced/helpers.html",
    "revision": "7e8765beb840638851f41d99e7d9c5a3"
  },
  {
    "url": "0.1/advanced/index.html",
    "revision": "e347ecd1f54884d6e93fbe43b99e8779"
  },
  {
    "url": "0.1/advanced/override-core-model.html",
    "revision": "a55286ff8a191872659263b92a5e73c6"
  },
  {
    "url": "0.1/advanced/render-event.html",
    "revision": "57f1ff26b324f64ad3a16794d2c299d7"
  },
  {
    "url": "0.1/advanced/security-practice.html",
    "revision": "602f3b53c4026434b67835e54bc0462f"
  },
  {
    "url": "0.1/api/attribute_families.html",
    "revision": "083dd754e3c16618f080dd64f0c0d952"
  },
  {
    "url": "0.1/api/attribute_groups.html",
    "revision": "cf61e949a0fe409f1631c72836cc02da"
  },
  {
    "url": "0.1/api/attribute_options.html",
    "revision": "0eb875e8357511ecbd7e1afce6f0fcaa"
  },
  {
    "url": "0.1/api/attribute.html",
    "revision": "5c44a6e000fd709800256926013191b1"
  },
  {
    "url": "0.1/api/authenticate.html",
    "revision": "dd40fe2908832fc8b49e5be087aa3c60"
  },
  {
    "url": "0.1/api/category_field_options.html",
    "revision": "76902a21e217e2512d8da01931086bc5"
  },
  {
    "url": "0.1/api/category_fields.html",
    "revision": "cef4f589648de66fc9594975317b342d"
  },
  {
    "url": "0.1/api/category.html",
    "revision": "c79ca324779f5cd63053a779b45ccbb2"
  },
  {
    "url": "0.1/api/channel.html",
    "revision": "c000e409c360627f1b2825ec8ed1380e"
  },
  {
    "url": "0.1/api/configurable_products.html",
    "revision": "d785bc979e5312fe68228f2244177b79"
  },
  {
    "url": "0.1/api/configuration.html",
    "revision": "b993ca76011aa5408562cd069e770b10"
  },
  {
    "url": "0.1/api/currency.html",
    "revision": "9ac3ce47e1aec59cf3dfbc3d7b0be2f0"
  },
  {
    "url": "0.1/api/explanation.html",
    "revision": "bfce7c7d0d082bdd9f66a3b245b0048d"
  },
  {
    "url": "0.1/api/getting-started-with-the-api.html",
    "revision": "2fa5f5489ffa93a54e62e672b819a0e4"
  },
  {
    "url": "0.1/api/index.html",
    "revision": "aee4142b8e9e53750de75d21a77ac8ab"
  },
  {
    "url": "0.1/api/locales.html",
    "revision": "838818d3138e873f0d731e1d58617ae6"
  },
  {
    "url": "0.1/api/media.html",
    "revision": "31c9be80df38c0e0ef93e4aee9bc8dde"
  },
  {
    "url": "0.1/api/postman_collection.html",
    "revision": "68dee2b7665bc4d2a004a9fa46d88d12"
  },
  {
    "url": "0.1/api/product.html",
    "revision": "3244c14035b653cd87c11ea046496f3c"
  },
  {
    "url": "0.1/architecture/frontend.html",
    "revision": "b54dba2e729285d2fa768dececf5634e"
  },
  {
    "url": "0.1/architecture/index.html",
    "revision": "0fe186325793e76d21ab90c9a3ba07ca"
  },
  {
    "url": "0.1/architecture/modular-design.html",
    "revision": "8f8ada770706e249427f3ecf88883c9b"
  },
  {
    "url": "0.1/architecture/packages.html",
    "revision": "db074a7e9cccfb08188df75678b2d627"
  },
  {
    "url": "0.1/architecture/repository-pattern.html",
    "revision": "3f1a55a8cf95832fcf503750a1bbfe2d"
  },
  {
    "url": "0.1/deploy/index.html",
    "revision": "2d805132e5d619cff1d93636184ee2cb"
  },
  {
    "url": "0.1/introduction/index.html",
    "revision": "89164906ba51946635b00348d24611f8"
  },
  {
    "url": "0.1/introduction/installation.html",
    "revision": "e65877aa9e00f75cab62450ce36099aa"
  },
  {
    "url": "0.1/introduction/requirements.html",
    "revision": "b19705b23c6f5644b671e932e7d40e42"
  },
  {
    "url": "0.1/packages/add-menu-in-admin.html",
    "revision": "6e7b55b0b50d1272a641fee4aa16c286"
  },
  {
    "url": "0.1/packages/blade-components.html",
    "revision": "af027c4d2854c68a2da62143273638de"
  },
  {
    "url": "0.1/packages/bundling-assets.html",
    "revision": "deb42d097e8a3cb4bcef7346390069f6"
  },
  {
    "url": "0.1/packages/controllers.html",
    "revision": "55d2251d1bc9ea98f4b81b1f256cd96d"
  },
  {
    "url": "0.1/packages/create-acl.html",
    "revision": "80591fe77a9c0f6119cac14fbffa9a6e"
  },
  {
    "url": "0.1/packages/create-migrations.html",
    "revision": "30bc517e59e348598c7e7de765191feb"
  },
  {
    "url": "0.1/packages/create-models.html",
    "revision": "990af2fab0186b486633df86f72e5883"
  },
  {
    "url": "0.1/packages/create-package.html",
    "revision": "ab2718c0149d46daf289b9f517d68b65"
  },
  {
    "url": "0.1/packages/data-transfer.html",
    "revision": "a1da326a479984f0aff0ab295c9ecf04"
  },
  {
    "url": "0.1/packages/datagrid.html",
    "revision": "2f4810d9c338407e9cc7ea082af16f80"
  },
  {
    "url": "0.1/packages/history.html",
    "revision": "02a0890ff1c79ce4b498109c8f357e21"
  },
  {
    "url": "0.1/packages/index.html",
    "revision": "b6ead5ae4e3231a918a745d41e599207"
  },
  {
    "url": "0.1/packages/layouts.html",
    "revision": "dd6c2563d2fb9506981db90a5d11ce83"
  },
  {
    "url": "0.1/packages/localization.html",
    "revision": "a5a86847db57f9cd6a47f2f5b76fada8"
  },
  {
    "url": "0.1/packages/routes.html",
    "revision": "e3f63f7693e2cabe9690d750047ac5dc"
  },
  {
    "url": "0.1/packages/store-data-through-repositories.html",
    "revision": "ca6c247174fe247e2b49d001caf2bd20"
  },
  {
    "url": "0.1/packages/validation.html",
    "revision": "1e0b19d62ca99216ad7171485c80f924"
  },
  {
    "url": "0.1/packages/views.html",
    "revision": "8da48d106a6e20f88bce469f24ee2d7b"
  },
  {
    "url": "0.1/plugins/add-side-menu.html",
    "revision": "c16470e12d3ab8877f18900043d58219"
  },
  {
    "url": "0.1/plugins/create-export-profile.html",
    "revision": "30912da4b7a628e18f4063986fc384de"
  },
  {
    "url": "0.1/plugins/create-import-profile.html",
    "revision": "58768d4a5c71fbc1279a3f5e9c39405b"
  },
  {
    "url": "0.1/plugins/create-plugin.html",
    "revision": "3613f3afc4954ce230e6ae7b03c0b576"
  },
  {
    "url": "0.1/plugins/index.html",
    "revision": "d199e40488dd5fef6159416e8c7e1194"
  },
  {
    "url": "0.1/plugins/plugin-deployment.html",
    "revision": "d576eb436061f2caaab4b5378bd75b7a"
  },
  {
    "url": "0.1/prologue/contribution-guide.html",
    "revision": "079c59073a817cdcee9b9c92a68e6f99"
  },
  {
    "url": "0.1/prologue/index.html",
    "revision": "b6cffd26e946133d4022b00e1c9e4e06"
  },
  {
    "url": "404.html",
    "revision": "ea8a791af4681dd959267e11a4f544fd"
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
    "url": "assets/js/1.f8495b64.js",
    "revision": "d246938aea37c88a4c3ca0fe511bbd2d"
  },
  {
    "url": "assets/js/10.29f9cac8.js",
    "revision": "8ca61f6b390c8d4ab255d8fca3e4794b"
  },
  {
    "url": "assets/js/100.c388b258.js",
    "revision": "6b85a9fd429cfef0eb9d7a8024ab3348"
  },
  {
    "url": "assets/js/101.765206ea.js",
    "revision": "27caecb423156f09d0cb83f2ec615e44"
  },
  {
    "url": "assets/js/102.621be7d2.js",
    "revision": "8079fa30c06c41708282c946890dbb31"
  },
  {
    "url": "assets/js/103.80c39aaa.js",
    "revision": "2940cbc46a54ae5f54ec915850c35483"
  },
  {
    "url": "assets/js/104.1645f6bc.js",
    "revision": "cd6f10a6d438d67cbc08438570b7d0f9"
  },
  {
    "url": "assets/js/105.35c5eb69.js",
    "revision": "9b7df7bbd5a91e4cde13fdea477505c4"
  },
  {
    "url": "assets/js/106.fdd22fda.js",
    "revision": "2c548e690240af120a36b5b76a77e4de"
  },
  {
    "url": "assets/js/107.f702d497.js",
    "revision": "322dee6343ccafc78b9f88d2e9ef715e"
  },
  {
    "url": "assets/js/108.3d7c38a1.js",
    "revision": "1140da981c2e9e8172e1660ccff328ae"
  },
  {
    "url": "assets/js/109.fe6087d8.js",
    "revision": "0bd702e177392c51bfc22b5c0671178b"
  },
  {
    "url": "assets/js/11.db93b1c9.js",
    "revision": "06fa1e7a685354bbd664454855ee6e8f"
  },
  {
    "url": "assets/js/110.26ffb828.js",
    "revision": "e8eeb59d5c9b55f50837b6b540b36432"
  },
  {
    "url": "assets/js/111.d95e9860.js",
    "revision": "47e1dd164f32f9dc68b3eee10f0702f1"
  },
  {
    "url": "assets/js/112.e7e381a1.js",
    "revision": "fe6af548313d1ace681be30b9ab24bef"
  },
  {
    "url": "assets/js/113.a9304c3c.js",
    "revision": "ec2701fff1808e52d1b41b0d6c3d5dd3"
  },
  {
    "url": "assets/js/114.332bb996.js",
    "revision": "612d6ee6a4cfb494d7ea92746612405d"
  },
  {
    "url": "assets/js/115.08f8bc49.js",
    "revision": "45ab1c4d21732f05752189d74f534fd8"
  },
  {
    "url": "assets/js/116.5c6bedfa.js",
    "revision": "57224c0c4fb9ae0be7d3e754e16e9456"
  },
  {
    "url": "assets/js/117.94fed5b7.js",
    "revision": "0f8c2969d7ef58668364a6020078b3d8"
  },
  {
    "url": "assets/js/118.7a0fd6a8.js",
    "revision": "8ee098b86b1fca78fc4f4f8a731a098e"
  },
  {
    "url": "assets/js/119.1f9fbdfb.js",
    "revision": "7756bf2c40180bb88ed2a916051bef4e"
  },
  {
    "url": "assets/js/12.5edcac46.js",
    "revision": "6b67fee6a23e066f3b6b9c5373d6db7c"
  },
  {
    "url": "assets/js/120.37625e75.js",
    "revision": "db4263e42104ff3d44c79aeaf5b66d90"
  },
  {
    "url": "assets/js/121.bf0aa318.js",
    "revision": "adc4247b02ece6e7f1789e2c302e776e"
  },
  {
    "url": "assets/js/122.a293cdf5.js",
    "revision": "4206c843ba69cb627d9e081e98e9624e"
  },
  {
    "url": "assets/js/123.41a05bf7.js",
    "revision": "c5b9985a457d16369f57a20c97d82d50"
  },
  {
    "url": "assets/js/124.9b32583d.js",
    "revision": "1b99d77338c6fb1b7679b1e41d686bff"
  },
  {
    "url": "assets/js/125.4f48edd0.js",
    "revision": "fc0119606f600ed7d17406cf41aef346"
  },
  {
    "url": "assets/js/126.e23db901.js",
    "revision": "7e644555e8adf61ebe41f39acf2db324"
  },
  {
    "url": "assets/js/127.f29daeb0.js",
    "revision": "c9cc6d5de8c3119c8a4805ad6fff3b1a"
  },
  {
    "url": "assets/js/128.3479ae91.js",
    "revision": "3be0e3b29b760aade306d6ee3121be38"
  },
  {
    "url": "assets/js/129.c0b9bf78.js",
    "revision": "c7207c86870cbfcf4af517414be9e41a"
  },
  {
    "url": "assets/js/13.9910f6d2.js",
    "revision": "c24df7b842202f811baa6b69b1815d7c"
  },
  {
    "url": "assets/js/130.933e1643.js",
    "revision": "01c2dad87d7ec6c5339a5afc2619677f"
  },
  {
    "url": "assets/js/131.0e19158b.js",
    "revision": "bf289e1e8176054c768f17c9ad91fedb"
  },
  {
    "url": "assets/js/132.5c0eee10.js",
    "revision": "b6e1299b8433105bc97be78f4e640778"
  },
  {
    "url": "assets/js/133.3e651b87.js",
    "revision": "9c0e3d06a3da5d15270bf5091cd3bcdd"
  },
  {
    "url": "assets/js/134.3a890305.js",
    "revision": "dd5e9c2c60cafba0fa3d356979279a61"
  },
  {
    "url": "assets/js/135.71b31525.js",
    "revision": "850c5351b427e1c0317cc33b57939f91"
  },
  {
    "url": "assets/js/136.67813f17.js",
    "revision": "cb5df3e95e5fab6adab8dfdc34e93520"
  },
  {
    "url": "assets/js/137.94684d48.js",
    "revision": "f4b9f134f3889316faccf18a21821f20"
  },
  {
    "url": "assets/js/138.32843026.js",
    "revision": "0d52e9326901d049f423cc7e1d0b210a"
  },
  {
    "url": "assets/js/139.9154edee.js",
    "revision": "e3d8d11a08caf7ecef9542c35ac72b74"
  },
  {
    "url": "assets/js/14.37f9804c.js",
    "revision": "22753e3a211e9c119366efb200302d49"
  },
  {
    "url": "assets/js/140.23a8b5b5.js",
    "revision": "7a62feb5d516680db88621d2d9127994"
  },
  {
    "url": "assets/js/141.d9c3ad9b.js",
    "revision": "34660efcd16d966e3f94906958210895"
  },
  {
    "url": "assets/js/142.a51bda32.js",
    "revision": "8e0429c24f964000a85c03f4b31564ca"
  },
  {
    "url": "assets/js/143.3a6c6ad2.js",
    "revision": "e25978ee8ce01f6282c15b5b72341cb3"
  },
  {
    "url": "assets/js/144.c2cffed5.js",
    "revision": "358b011f1e6d33fd425ce4a766806b58"
  },
  {
    "url": "assets/js/145.3ffef85a.js",
    "revision": "c34ae48af4002c7d94a98049e201217e"
  },
  {
    "url": "assets/js/146.e3c66b5d.js",
    "revision": "e4af9770c9385f9ade7c0ae02d524e9d"
  },
  {
    "url": "assets/js/147.2e8ed01a.js",
    "revision": "8f0803a5be6d89696851fb6a0cbe3d19"
  },
  {
    "url": "assets/js/15.c16f4f8d.js",
    "revision": "805e5b06605c2d0ec757a3abf00dfb4b"
  },
  {
    "url": "assets/js/16.f8c1742f.js",
    "revision": "d6e919fb48599844016e27b47589d3f8"
  },
  {
    "url": "assets/js/17.a39e9b63.js",
    "revision": "bcfd6732c73a38567d2cd03acc28ce32"
  },
  {
    "url": "assets/js/18.6dd34d71.js",
    "revision": "4f74bc06c3a61efc24beadafbb239dbe"
  },
  {
    "url": "assets/js/19.038c1c8e.js",
    "revision": "ced535e7f08051882df769b42e7ce621"
  },
  {
    "url": "assets/js/2.169647b3.js",
    "revision": "d15a1e42e0c4544335be612152b0716d"
  },
  {
    "url": "assets/js/20.2a31218d.js",
    "revision": "4d23b90762b4607b63959677c2bad206"
  },
  {
    "url": "assets/js/21.56b916bb.js",
    "revision": "24a60af12ab0a313a8d76e5e6db48f64"
  },
  {
    "url": "assets/js/22.b5baa3f2.js",
    "revision": "8f457ff370a64d8ad7c5c859be93aee4"
  },
  {
    "url": "assets/js/23.74a86ec1.js",
    "revision": "b4a3890e05fd3124f6268498e0d98133"
  },
  {
    "url": "assets/js/24.60589c9f.js",
    "revision": "1695a68517e17a771795bf1abd4ccdb8"
  },
  {
    "url": "assets/js/25.3c10c129.js",
    "revision": "02bcc85b2614288a017609a9a3ae832e"
  },
  {
    "url": "assets/js/26.48591139.js",
    "revision": "ee6d4bada9b081308fd0372009af8297"
  },
  {
    "url": "assets/js/27.8812bf4c.js",
    "revision": "84d36bd2eccb705e4fe9c5062488d6dd"
  },
  {
    "url": "assets/js/28.39c44e60.js",
    "revision": "d98988cd010ae2c2c8629875c4770841"
  },
  {
    "url": "assets/js/29.5cc25e87.js",
    "revision": "57f00d7f7c65d293d7613aa25e3c2d18"
  },
  {
    "url": "assets/js/3.fbe1d52a.js",
    "revision": "01259b849e67127f7ea69dc3e06e7616"
  },
  {
    "url": "assets/js/30.e8c19de6.js",
    "revision": "9096df807ef8a165b72577b39e3e856a"
  },
  {
    "url": "assets/js/31.f1b089a9.js",
    "revision": "cbd637b1075542b7d32392c0b5b807ee"
  },
  {
    "url": "assets/js/32.87845571.js",
    "revision": "88a763af55ff953584e46435aab5f8f9"
  },
  {
    "url": "assets/js/33.8b68b0c0.js",
    "revision": "822867cb2cf5c690c2190d3fb63999e7"
  },
  {
    "url": "assets/js/34.6742d340.js",
    "revision": "7e81ff71744748784a18c11af5f54c68"
  },
  {
    "url": "assets/js/35.eb35d643.js",
    "revision": "6fe2527e8356cfd648c8f642ce8e9c5d"
  },
  {
    "url": "assets/js/36.6764e3c8.js",
    "revision": "67ae8a53f2e0314f2d9e770bef6f9a36"
  },
  {
    "url": "assets/js/37.43f99950.js",
    "revision": "4fea387458092f21be80d49a079d5c7e"
  },
  {
    "url": "assets/js/38.b144f071.js",
    "revision": "9bc856b28721dd9247da4445a362c192"
  },
  {
    "url": "assets/js/39.c2689f22.js",
    "revision": "63704bc665bcb26d657fe26a9539ccf1"
  },
  {
    "url": "assets/js/4.d7021c11.js",
    "revision": "55b8592142aeb9b43de90b65a0a5dcd3"
  },
  {
    "url": "assets/js/40.7887b9bc.js",
    "revision": "c7221b7b839f604e621346f4a9aa4fd3"
  },
  {
    "url": "assets/js/41.e4795a61.js",
    "revision": "633b046a1ec86212901e3ab544f527f8"
  },
  {
    "url": "assets/js/42.3925bf76.js",
    "revision": "0c8eb9882270ffeb96b9a24e9a8418f2"
  },
  {
    "url": "assets/js/43.08c7f2f5.js",
    "revision": "0f34d3067cc9690d5649c001bef25e1f"
  },
  {
    "url": "assets/js/44.07e2de7f.js",
    "revision": "6969b84114ca671b10df12bc852c5292"
  },
  {
    "url": "assets/js/45.d4dfabb2.js",
    "revision": "1daf9506a88fe1696061a5b187905d15"
  },
  {
    "url": "assets/js/46.0d51e3eb.js",
    "revision": "267606046dd8d51f8ee651f97a2855fc"
  },
  {
    "url": "assets/js/47.877ed837.js",
    "revision": "ceaba6932469e5499e5b0e0466335d48"
  },
  {
    "url": "assets/js/48.17b89544.js",
    "revision": "f87c7694582c3aec6e20cc354f0915c7"
  },
  {
    "url": "assets/js/49.71c81734.js",
    "revision": "e20854232ba9049294bc9ee6bbe001ec"
  },
  {
    "url": "assets/js/5.39da4bdb.js",
    "revision": "665b1028727cd674d1b8759cf177c089"
  },
  {
    "url": "assets/js/50.ff5ca92e.js",
    "revision": "ca3da17b23ac45474969593cccd52db9"
  },
  {
    "url": "assets/js/51.d5efea1a.js",
    "revision": "23af6a199e5d3f8d57bada3fbb31e354"
  },
  {
    "url": "assets/js/52.cd9c9c46.js",
    "revision": "059610fbec49c6b3da96d155f5a79da2"
  },
  {
    "url": "assets/js/53.aaac4b09.js",
    "revision": "776b79b28a2f6e520ba386b0252b717c"
  },
  {
    "url": "assets/js/54.4ba8d48a.js",
    "revision": "634a8b3dbfd2bfba308661ee1d10038c"
  },
  {
    "url": "assets/js/55.9eaeec88.js",
    "revision": "5ad1f6c0627cace52d19df9a6deac5e7"
  },
  {
    "url": "assets/js/56.6afcfffd.js",
    "revision": "e20879cf99278ca7e5986012ec5ec019"
  },
  {
    "url": "assets/js/57.568f0641.js",
    "revision": "fe623eeddbb52269b7f54184be033160"
  },
  {
    "url": "assets/js/58.2358956b.js",
    "revision": "1772799a8f1571aab94f4fa06780f86d"
  },
  {
    "url": "assets/js/59.bc1f1954.js",
    "revision": "b82803ccdb5f420b49b3811419b28c06"
  },
  {
    "url": "assets/js/60.d57048eb.js",
    "revision": "482e4ff560730886fc13abcd8c98c072"
  },
  {
    "url": "assets/js/61.79f365b5.js",
    "revision": "571f9c03215b4d4facfb826383e7ff1b"
  },
  {
    "url": "assets/js/62.7b130956.js",
    "revision": "5906a134f6ec4ebd5648e617258e9f4f"
  },
  {
    "url": "assets/js/63.e0e68dfc.js",
    "revision": "a2de08d883ec69c7b007e70dcaa7f924"
  },
  {
    "url": "assets/js/64.b446f0a5.js",
    "revision": "2c456002a765d3da8357936947cec590"
  },
  {
    "url": "assets/js/65.71b73888.js",
    "revision": "ebcc16ffae40b487032e39b2ac2c9930"
  },
  {
    "url": "assets/js/66.4ce13dd8.js",
    "revision": "b416a29f2370f2ca39d64438445dacd7"
  },
  {
    "url": "assets/js/67.def86bad.js",
    "revision": "ea62bc4f59ca7fc69b863653a39bcecc"
  },
  {
    "url": "assets/js/68.a2920b0e.js",
    "revision": "f89aea1e9cdce03d73890bd2c567d675"
  },
  {
    "url": "assets/js/69.cbc63f7a.js",
    "revision": "c74057e2d2507a5fbb765733d72b9ec3"
  },
  {
    "url": "assets/js/70.6c21b66b.js",
    "revision": "c36e9751d7410fe03af57f19e3b5f862"
  },
  {
    "url": "assets/js/71.bfe44ae2.js",
    "revision": "57e304b11101611f9979f1ad50f41e59"
  },
  {
    "url": "assets/js/72.d467a365.js",
    "revision": "781ef958329d311432cd3dafd6470a22"
  },
  {
    "url": "assets/js/73.783d58a5.js",
    "revision": "dc839c634da7c90b36a1d53a1e2924ba"
  },
  {
    "url": "assets/js/74.dc6f2683.js",
    "revision": "fc8ac7a2fcc3ae8876bcc32e19b66862"
  },
  {
    "url": "assets/js/75.b25cc992.js",
    "revision": "4d8dc1a65b8d2ecd2ceea5521aff6791"
  },
  {
    "url": "assets/js/76.e827ee13.js",
    "revision": "d9f8e615c564bb5081953f8724cc6592"
  },
  {
    "url": "assets/js/77.b8a4e4fd.js",
    "revision": "02d091e3150ff4a6f784979eafbf093c"
  },
  {
    "url": "assets/js/78.3d9e2b55.js",
    "revision": "b0594efdb79b22c18b4aa8c9bfe1865d"
  },
  {
    "url": "assets/js/79.f750e662.js",
    "revision": "a224b31fe172380ac99c5f2cd135eece"
  },
  {
    "url": "assets/js/8.a5cd020c.js",
    "revision": "bc5ac0eac88f4e0457d331fdee0d471f"
  },
  {
    "url": "assets/js/80.19da8fd6.js",
    "revision": "ee206b99dafc4780ead323a65d3d4331"
  },
  {
    "url": "assets/js/81.31676bf1.js",
    "revision": "4ecbc598a74f71ca889280741d1ea83c"
  },
  {
    "url": "assets/js/82.38172b9d.js",
    "revision": "56de0a494fb7a6d705b3481a8ebedb1d"
  },
  {
    "url": "assets/js/83.6cd0adfe.js",
    "revision": "f1d158ceff85b89d0f5cc1d96079c7a0"
  },
  {
    "url": "assets/js/84.28152a8e.js",
    "revision": "bfc10bb26736203b02fe3874c89e5f60"
  },
  {
    "url": "assets/js/85.c8c9081e.js",
    "revision": "fe934c91f2239572b0e701b726381187"
  },
  {
    "url": "assets/js/86.bbaa4eb4.js",
    "revision": "1e9ed1f4b9f7109eb025a86dbb97a664"
  },
  {
    "url": "assets/js/87.2fcd636e.js",
    "revision": "f1ae37f4ae5ff7bf7d48e861b37c8579"
  },
  {
    "url": "assets/js/88.beb3fef2.js",
    "revision": "9f3980cb32024754b35cba430c5e6155"
  },
  {
    "url": "assets/js/89.c00e59fc.js",
    "revision": "1d2d9344f71e412729064c5136b05720"
  },
  {
    "url": "assets/js/9.83d071c5.js",
    "revision": "478b3b3734a098492a8cfc14761c0130"
  },
  {
    "url": "assets/js/90.79e2ab14.js",
    "revision": "7a159ab756a1c80ecb5b5dfadb2b3810"
  },
  {
    "url": "assets/js/91.e05efe39.js",
    "revision": "7eb5537413b4decede44ae5e42901975"
  },
  {
    "url": "assets/js/92.27d215c6.js",
    "revision": "639da14e90f5d98611a773ab8d200c51"
  },
  {
    "url": "assets/js/93.5f6427ce.js",
    "revision": "4d9f16e69777e5c3576ec780d6c41b08"
  },
  {
    "url": "assets/js/94.2bd00e61.js",
    "revision": "714db1d6f6c036289cecbde833bda5ba"
  },
  {
    "url": "assets/js/95.a9cf666b.js",
    "revision": "7f1173c9485b403b2cb5bd9ddb027122"
  },
  {
    "url": "assets/js/96.7e394adc.js",
    "revision": "cba022e3329e44aa7f66de6e1e830e03"
  },
  {
    "url": "assets/js/97.e8303c13.js",
    "revision": "189e497053dab72b7977e7496947eb69"
  },
  {
    "url": "assets/js/98.17bb68a8.js",
    "revision": "43688304aae8abc1e0e4da7b4c9e0db2"
  },
  {
    "url": "assets/js/99.e5fa5a83.js",
    "revision": "bb02e27464dec25ea2233b5ff820c7c0"
  },
  {
    "url": "assets/js/app.3bb419fa.js",
    "revision": "7808c1428b3c1e843e9c3b4c20cea51e"
  },
  {
    "url": "assets/js/vendors~docsearch.992c13e1.js",
    "revision": "e3f6a35ad9d78a6678af8afb901dcc00"
  },
  {
    "url": "index.html",
    "revision": "1c8d88fbb31bce1424b6bfe9e9b97c4b"
  },
  {
    "url": "logo.png",
    "revision": "b6fe2a7e1a8fcc87485babdbcb598c31"
  },
  {
    "url": "master/advanced/create-data-import.html",
    "revision": "e12dd11ac129781dd15df151aa29c59a"
  },
  {
    "url": "master/advanced/create-product-type.html",
    "revision": "2748880393859953e423003aaf1d3bf6"
  },
  {
    "url": "master/advanced/events.html",
    "revision": "8c3da94551e5da81e6f0d65336f795f5"
  },
  {
    "url": "master/advanced/helpers.html",
    "revision": "0205ccdd2df03adac67874a5eb3be500"
  },
  {
    "url": "master/advanced/index.html",
    "revision": "b9d259f544ab719064903271cbc197e7"
  },
  {
    "url": "master/advanced/indexing-products-to-elasticsearch.html",
    "revision": "5eb1fecf420696996697bd02c61a7375"
  },
  {
    "url": "master/advanced/override-core-model.html",
    "revision": "635c91745d810c72d1f84a31d4ef3721"
  },
  {
    "url": "master/advanced/render-event.html",
    "revision": "65b487e296c9a6bb6d9da306bf85cb5c"
  },
  {
    "url": "master/advanced/security-practice.html",
    "revision": "3fc7530934b21621a7cc36236b12b808"
  },
  {
    "url": "master/api/attribute_families.html",
    "revision": "d8517bf7bc2b0d6014dbc7ec4f471769"
  },
  {
    "url": "master/api/attribute_groups.html",
    "revision": "565d0fff6f57206c5d075d94c5e91773"
  },
  {
    "url": "master/api/attribute_options.html",
    "revision": "e4a5bca77d35a0206e039d9c32a56c55"
  },
  {
    "url": "master/api/attribute.html",
    "revision": "66c497db2d58354e19e0f7ebabc6536a"
  },
  {
    "url": "master/api/authenticate.html",
    "revision": "1cb5a8c5d0f39d26ff06a73da8bd828b"
  },
  {
    "url": "master/api/category_field_options.html",
    "revision": "81cf3a8ca1a1a95298c30004ea9dc53c"
  },
  {
    "url": "master/api/category_fields.html",
    "revision": "be648dc8b9b7bcd5151772711466361f"
  },
  {
    "url": "master/api/category.html",
    "revision": "5de01acb702832b0bb67bf62cb0d5836"
  },
  {
    "url": "master/api/channel.html",
    "revision": "230d3701728e70d115c676e562f29715"
  },
  {
    "url": "master/api/configurable_products.html",
    "revision": "bcfeee150a62f6d0ea6b690472e20c6e"
  },
  {
    "url": "master/api/configuration.html",
    "revision": "ad77619f2c45b3ed7826903ca0b74593"
  },
  {
    "url": "master/api/currency.html",
    "revision": "2c098bd70206a7eb4aafc650385d51a8"
  },
  {
    "url": "master/api/explanation.html",
    "revision": "96635dbd97be7ebe9c2881c6360b6ec0"
  },
  {
    "url": "master/api/getting-started-with-the-api.html",
    "revision": "0875d115728ce344f9ac66cd9eaff992"
  },
  {
    "url": "master/api/index.html",
    "revision": "a0211a44531d860c45717ce31a03678c"
  },
  {
    "url": "master/api/locales.html",
    "revision": "ae9f656141c006a5a412d79777faa22e"
  },
  {
    "url": "master/api/media.html",
    "revision": "a3f8c140d0cee666863d25999aa9707f"
  },
  {
    "url": "master/api/postman_collection.html",
    "revision": "85d61d40e396b996465a7c1c0fc89c8b"
  },
  {
    "url": "master/api/product.html",
    "revision": "c07825be22961da9bd09ededb9dee2dd"
  },
  {
    "url": "master/architecture/frontend.html",
    "revision": "7e1cf477a01d6d2458609da3e39e76eb"
  },
  {
    "url": "master/architecture/index.html",
    "revision": "2052869643426da505365dc42625b81d"
  },
  {
    "url": "master/architecture/modular-design.html",
    "revision": "0722740fe30e53473c9a4d8dc4107207"
  },
  {
    "url": "master/architecture/packages.html",
    "revision": "93ffec5e5c53bdb613591ff71a6c2910"
  },
  {
    "url": "master/architecture/repository-pattern.html",
    "revision": "0b413b5b7ea3b43301634256aea8085a"
  },
  {
    "url": "master/deploy/index.html",
    "revision": "c3941c82f2c56f59ec703f2c92d080e1"
  },
  {
    "url": "master/introduction/index.html",
    "revision": "69a408746744adb452a49be7b86f9dad"
  },
  {
    "url": "master/introduction/installation.html",
    "revision": "dc69b26fe538e3e5f61b2e049f9f70dd"
  },
  {
    "url": "master/introduction/requirements.html",
    "revision": "c99a2c3033705d0db87d7d0d12078515"
  },
  {
    "url": "master/packages/add-menu-in-admin.html",
    "revision": "eb13eeffa868ef22706a7f0c45f9011d"
  },
  {
    "url": "master/packages/blade-components.html",
    "revision": "ef36a5c7bf68d0e6cdb77794ce213145"
  },
  {
    "url": "master/packages/bundling-assets.html",
    "revision": "3667e6dae21d480770394db746e190de"
  },
  {
    "url": "master/packages/controllers.html",
    "revision": "c5f154315c3c18aad1bf44eb13d40eb1"
  },
  {
    "url": "master/packages/create-acl.html",
    "revision": "6fc3da671788a6289b473658a58b3975"
  },
  {
    "url": "master/packages/create-migrations.html",
    "revision": "ee45897c861b815ae3aa8236dfd94b6c"
  },
  {
    "url": "master/packages/create-models.html",
    "revision": "96804aafddd796151876e29681c52514"
  },
  {
    "url": "master/packages/create-package.html",
    "revision": "76b2c9180755ba36642b28d1fa273906"
  },
  {
    "url": "master/packages/data-transfer.html",
    "revision": "9e315e92db5b52e6307c6d1393293fc0"
  },
  {
    "url": "master/packages/datagrid.html",
    "revision": "9ac5375624571a2ee32e4c1af8240787"
  },
  {
    "url": "master/packages/history.html",
    "revision": "dbda29053026c289cbb6dfab8fdd1c51"
  },
  {
    "url": "master/packages/index.html",
    "revision": "d895e1652a7bf61a09420603ee54dd82"
  },
  {
    "url": "master/packages/layouts.html",
    "revision": "0f491e815e614bce2cbe5125087c5407"
  },
  {
    "url": "master/packages/localization.html",
    "revision": "43156b1156a6e8e7d79ccfed57430dba"
  },
  {
    "url": "master/packages/routes.html",
    "revision": "e80710a995db3a7d23035dbd82920b6e"
  },
  {
    "url": "master/packages/store-data-through-repositories.html",
    "revision": "1af443a1608a84061b88a53f24df68e1"
  },
  {
    "url": "master/packages/validation.html",
    "revision": "71f6a2e581470543a1ed113cac787764"
  },
  {
    "url": "master/packages/views.html",
    "revision": "a5a84c2eac832bbe452322185d564818"
  },
  {
    "url": "master/plugins/add-side-menu.html",
    "revision": "f5f1daac124ab5aebc460832359ea750"
  },
  {
    "url": "master/plugins/create-export-profile.html",
    "revision": "14183c8acff1a1e23edca896761c3168"
  },
  {
    "url": "master/plugins/create-import-profile.html",
    "revision": "da4d2fa1dfdc0d2d258226e38199f881"
  },
  {
    "url": "master/plugins/create-plugin.html",
    "revision": "706101a93ef661b8c65fc914fc087745"
  },
  {
    "url": "master/plugins/index.html",
    "revision": "9a7312f455932c05794bd449e568a632"
  },
  {
    "url": "master/plugins/plugin-deployment.html",
    "revision": "8c45c290bc4956b11bb277c29ab0206a"
  },
  {
    "url": "master/prologue/contribution-guide.html",
    "revision": "341b33bc50a1ae26d8721084b0a255f0"
  },
  {
    "url": "master/prologue/index.html",
    "revision": "6ee3bc12b23f23bc0581c47fa1cb49b6"
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
