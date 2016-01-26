import {classify, mergeOptions} from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.use = function (plugin) {

        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    UIkit.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
    };

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.getComponents = function (element, children) {
        var components = ((element instanceof jQuery ? element[0] : element)[DATA]) || [];

        if (children) {
            $(UIkit.elements, element).each(function () {
                if (this[DATA]) {
                    components.concat(this[DATA]);
                }
            });
        }

        return components;
    }

}

function createClass(name) {
    return new Function('return function ' + classify(name) + ' (options) { this._init(options); }')();
}