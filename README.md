## Kunlun


[![NPM version][npm-image]][npm-url]

`Kunlun` is a library that provides:
* User friendly and more helpful methods in addition to [WD](https://github.com/admc/wd)
* Appium logging control through environment variable `DEBUG`
* Sauce Labs helper method
* Bootstrap your appium page object test structure

Quick example: 
* Instead of
```
- find an element by some selector
- write your own logic to wait for it to be available
- click on it
```
you can just call `clickEl()` with Appium-plus. Default selector type is 'accessibility id', you can overwrite it with 'name', 'xpath', '-ios uiautomation', etc

* Print out Appium client side logging while running the test, just append `DEBUG=true` in command line

`This package is still under construction, more are coming.`

---

## License
Licensed under the [MIT](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/appium-plus.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/appium-plus
[github-tag]: http://img.shields.io/github/tag/chenchaoyi/appium-plus.svg?style=flat-square
[github-url]: https://github.com/chenchaoyi/appium-plus/tags
[david-image]: http://img.shields.io/david/chenchaoyi/appium-plus.svg?style=flat-square
[david-url]: https://david-dm.org/chenchaoyi/appium-plus
[license-image]: http://img.shields.io/npm/l/appium-plus.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[downloads-image]: http://img.shields.io/npm/dm/appium-plus.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/appium-plus
[gittip-image]: https://img.shields.io/gittip/chenchaoyi.svg?style=flat-square
[gittip-url]: https://www.gittip.com/chenchaoyi/
