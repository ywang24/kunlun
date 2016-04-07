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
you can just call `clickEl()` with Kunlun.

Default selector type is `accessibility id`, you can overwrite it with `xpath`, `-ios uiautomation`, etc

* Print out Appium client side logging while running the test, just append `DEBUG=true` in command line

`This package is still under construction, more are coming.`

---

## API ##

#### `waitTillAvailable(selector, by)`
Wait until specific element is displayed

#### `waitTillNotAvailable(selector, by)`
Wait until specific element is NOT displayed

#### `clickEl(selector, by)`
Click on selected element after waiting for it to display

#### `getEls(selector, by)`
Search for multiple elements after waiting for any of them to display

#### `getEl(selector, by)`
Search for element after waiting for any of them to display

#### `hasEl(selector, by)`
Check if an element exists

#### `getElAttribute(attr, selector, by)`
Get the value of an element's attribute after waiting for it to display

#### `bindModule(module)`
Bind functions from customized page object modules to AppiumDriver object

#### `resetModules()`
Clean up customized page object modules functions

#### `goBack()`
Click on built-in Back button

#### `cancelLastMove()`
Click on built-in Cancel button

## License
Licensed under the [MIT](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/kunlun.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/kunlun
[github-tag]: http://img.shields.io/github/tag/chenchaoyi/kunlun.svg?style=flat-square
[github-url]: https://github.com/chenchaoyi/kunlun/tags
[david-image]: http://img.shields.io/david/chenchaoyi/kunlun.svg?style=flat-square
[david-url]: https://david-dm.org/chenchaoyi/kunlun
[license-image]: http://img.shields.io/npm/l/kunlun.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[downloads-image]: http://img.shields.io/npm/dm/kunlun.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/kunlun
