﻿window.bootbox = window.bootbox || (function init($, undefined) {
    "use strict";
    var templates = {
        dialog: "<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>",
        header: "<div class='modal-header'><h4 class='modal-title'></h4></div>",
        footer: "<div class='modal-footer'></div>",
        closeButton: "<button type='button' class='bootbox-close-button close'>&times;</button>",
        form: "<form class='bootbox-form'></form>",
        inputs: {
            text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
            email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
            select: "<select class='bootbox-input bootbox-input-select form-control'></select>",
            checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>"
        }
    };
    var appendTo = $(document.body);
    var defaults = {
        locale: "zh_CN",
        backdrop: true,
        animate: true,
        className: null,
        closeButton: true,
        show: true
    };
    var exports = {};
    function _t(key) {
        var locale = locales[defaults.locale];
        return locale ? locale[key] : locales.en[key]
    }
    function processCallback(e, dialog, callback) {
        e.preventDefault();
        var preserveDialog = $.isFunction(callback) && callback(e) === false;
        if (!preserveDialog) {
            dialog.modal("hide")
        }
    }
    function getKeyLength(obj) {
        var k, t = 0;
        for (k in obj) {
            t++
        }
        return t
    }
    function each(collection, iterator) {
        var index = 0;
        $.each(collection,
        function (key, value) {
            iterator(key, value, index++)
        })
    }
    function sanitize(options) {
        var buttons;
        var total;
        if (typeof options !== "object") {
            throw new Error("Please supply an object of options");
        }
        if (!options.message) {
            throw new Error("Please specify a message");
        }
        options = $.extend({},
        defaults, options);
        if (!options.buttons) {
            options.buttons = {}
        }
        options.backdrop = options.backdrop ? "static" : false;
        buttons = options.buttons;
        total = getKeyLength(buttons);
        each(buttons,
        function (key, button, index) {
            if ($.isFunction(button)) {
                button = buttons[key] = {
                    callback: button
                }
            }
            if ($.type(button) !== "object") {
                throw new Error("button with key " + key + " must be an object");
            }
            if (!button.label) {
                button.label = key
            }
            if (!button.className) {
                if (total <= 2 && index === total - 1) {
                    button.className = "btn-primary"
                } else {
                    button.className = "btn-default"
                }
            }
        });
        return options
    }
    function mapArguments(args, properties) {
        var argn = args.length;
        var options = {};
        if (argn < 1 || argn > 2) {
            throw new Error("Invalid argument length");
        }
        if (argn === 2 || typeof args[0] === "string") {
            options[properties[0]] = args[0];
            options[properties[1]] = args[1]
        } else {
            options = args[0]
        }
        return options
    }
    function mergeArguments(defaults, args, properties) {
        return $.extend(true, {},
        defaults, mapArguments(args, properties))
    }
    function mergeDialogOptions(className, labels, properties, args) {
        var baseOptions = {
            className: "bootbox-" + className,
            buttons: createLabels.apply(null, labels)
        };
        return validateButtons(mergeArguments(baseOptions, args, properties), labels)
    }
    function createLabels() {
        var buttons = {};
        for (var i = 0,
        j = arguments.length; i < j; i++) {
            var argument = arguments[i];
            var key = argument.toLowerCase();
            var value = argument.toUpperCase();
            buttons[key] = {
                label: _t(value)
            }
        }
        return buttons
    }
    function validateButtons(options, buttons) {
        var allowedButtons = {};
        each(buttons,
        function (key, value) {
            allowedButtons[value] = true
        });
        each(options.buttons,
        function (key) {
            if (allowedButtons[key] === undefined) {
                throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")");
            }
        });
        return options
    }
    exports.alert = function () {
        var options;
        options = mergeDialogOptions("alert", ["ok"], ["message", "callback"], arguments);
        if (options.callback && !$.isFunction(options.callback)) {
            throw new Error("alert requires callback property to be a function when provided");
        }
        options.buttons.ok.callback = options.onEscape = function () {
            if ($.isFunction(options.callback)) {
                return options.callback()
            }
            return true
        };
        return exports.dialog(options)
    };
    exports.confirm = function () {
        var options;
        options = mergeDialogOptions("confirm", ["cancel", "confirm"], ["message", "callback"], arguments);
        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback(false)
        };
        options.buttons.confirm.callback = function () {
            console.log(options.callback)
            return options.callback(true)
        };
        if (!$.isFunction(options.callback)) {
            throw new Error("confirm requires a callback");
        }
        return exports.dialog(options)
    };
    exports.prompt = function () {
        var options;
        var defaults;
        var dialog;
        var form;
        var input;
        var shouldShow;
        var inputOptions;
        form = $(templates.form);
        defaults = {
            className: "bootbox-prompt",
            buttons: createLabels("cancel", "confirm"),
            value: "",
            inputType: "text",
        };
        options = validateButtons(mergeArguments(defaults, arguments, ["title", "callback"]), ["cancel", "confirm"]);
        shouldShow = (options.show === undefined) ? true : options.show;
        options.message = form;
        options.buttons.cancel.callback = options.onEscape = function () {
            return options.callback(null)
        };
        options.buttons.confirm.callback = function () {
            var value;
            switch (options.inputType) {
                case "text":
                case "email":
                case "select":
                    value = input.val();
                    break;
                case "checkbox":
                    var checkedItems = input.find("input:checked");
                    value = [];
                    each(checkedItems,
                    function (_, item) {
                        value.push($(item).val())
                    });
                    break
            }
            return options.callback(value)
        };
        options.show = false;
        if (!options.title) {
            throw new Error("prompt requires a title");
        }
        if (!$.isFunction(options.callback)) {
            throw new Error("prompt requires a callback");
        }
        if (!templates.inputs[options.inputType]) {
            throw new Error("invalid prompt type");
        }
        input = $(templates.inputs[options.inputType]);
        switch (options.inputType) {
            case "text":
            case "email":
                input.val(options.value);
                break;
            case "select":
                var groups = {};
                inputOptions = options.inputOptions || [];
                if (!inputOptions.length) {
                    throw new Error("prompt with select requires options");
                }
                each(inputOptions,
                function (_, option) {
                    var elem = input;
                    if (option.value === undefined || option.text === undefined) {
                        throw new Error("given options in wrong format");
                    }
                    if (option.group) {
                        if (!groups[option.group]) {
                            groups[option.group] = $("<optgroup/>").attr("label", option.group)
                        }
                        elem = groups[option.group]
                    }
                    elem.append("<option value='" + option.value + "'>" + option.text + "</option>")
                });
                each(groups,
                function (_, group) {
                    input.append(group)
                });
                input.val(options.value);
                break;
            case "checkbox":
                var values = $.isArray(options.value) ? options.value : [options.value];
                inputOptions = options.inputOptions || [];
                if (!inputOptions.length) {
                    throw new Error("prompt with checkbox requires options");
                }
                if (!inputOptions[0].value || !inputOptions[0].text) {
                    throw new Error("given options in wrong format");
                }
                input = $("<div/>");
                each(inputOptions,
                function (_, option) {
                    var checkbox = $(templates.inputs[options.inputType]);
                    checkbox.find("input").attr("value", option.value);
                    checkbox.find("label").append(option.text);
                    each(values,
                    function (_, value) {
                        if (value === option.value) {
                            checkbox.find("input").prop("checked", true)
                        }
                    });
                    input.append(checkbox)
                });
                break
        }
        if (options.placeholder) {
            input.attr("placeholder", options.placeholder)
        }
        form.append(input);
        form.on("submit",
        function (e) {
            e.preventDefault();
            dialog.find(".btn-primary").click()
        });
        dialog = exports.dialog(options);
        dialog.off("shown.bs.modal");
        dialog.on("shown.bs.modal",
        function () {
            input.focus()
        });
        if (shouldShow === true) {
            dialog.modal("show")
        }
        return dialog
    };
    exports.dialog = function (options) {
        options = sanitize(options);
        var dialog = $(templates.dialog);
        var body = dialog.find(".modal-body");
        var buttons = options.buttons;
        var buttonStr = "";
        var callbacks = {
            onEscape: options.onEscape
        };
        each(buttons,
        function (key, button) {
            buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
            callbacks[key] = button.callback
        });
        body.find(".bootbox-body").html(options.message);
        if (options.animate === true) {
            dialog.addClass("fade")
        }
        if (options.className) {
            dialog.addClass(options.className)
        }
        if (options.title) {
            body.before(templates.header)
        }
        if (options.closeButton) {
            var closeButton = $(templates.closeButton);
            if (options.title) {
                dialog.find(".modal-header").prepend(closeButton)
            } else {
                closeButton.css("margin-top", "-10px").prependTo(body)
            }
        }
        if (options.title) {
            dialog.find(".modal-title").html(options.title)
        }
        if (buttonStr.length) {
            body.after(templates.footer);
            dialog.find(".modal-footer").html(buttonStr)
        }
        dialog.on("hidden.bs.modal",
        function (e) {
            if (e.target === this) {
                dialog.remove()
            }
        });
        dialog.on("shown.bs.modal",
        function () {
            dialog.find(".btn-primary:first").focus()
        });
        dialog.on("escape.close.bb",
        function (e) {
            if (callbacks.onEscape) {
                processCallback(e, dialog, callbacks.onEscape)
            }
        });
        dialog.on("click", ".modal-footer button",
        function (e) {
            var callbackKey = $(this).data("bb-handler");
            processCallback(e, dialog, callbacks[callbackKey])
        });
        dialog.on("click", ".bootbox-close-button",
        function (e) {
            processCallback(e, dialog, callbacks.onEscape)
        });
        dialog.on("keyup",
        function (e) {
            if (e.which === 27) {
                dialog.trigger("escape.close.bb")
            }
        });
        appendTo.append(dialog);
        dialog.modal({
            backdrop: options.backdrop,
            keyboard: false,
            show: false
        });
        if (options.show) {
            dialog.modal("show")
        }
        return dialog
    };
    exports.setDefaults = function () {
        var values = {};
        if (arguments.length === 2) {
            values[arguments[0]] = arguments[1]
        } else {
            values = arguments[0]
        }
        $.extend(defaults, values)
    };
    exports.hideAll = function () {
        $(".bootbox").modal("hide")
    };
    var locales = {
        zh_CN: {
            OK: "确认",
            CANCEL: "取消",
            CONFIRM: "确认"
        }
    };
    exports.init = function (_$) {
        window.bootbox = init(_$ || $)
    };
    return exports
}(window.jQuery));