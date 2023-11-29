function Validator(formSelector) {
    var _this = this;
    /**
     * Quy ước
     * - Nếu có lỗi thì return `error message`
     * - Nếu không có lỗi thì return `undefined`
     */
    // chứa tất cả validate với các rule
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function (min) {
            return function (value) {
                if (value.length != 0) {
                    return value.length >= min ? undefined : `Vui lòng nhập tối thiếu ${min} kí tự`;
                }
                return undefined;
            };
        },
        confirm: function (value, confirmValue) {
            // return function (value) {
            return value == confirmValue ? undefined : 'Mật khẩu không khớp';
            // };
        },
    };

    var form = document.querySelector(formSelector);
    // chứa tất cả rule trong các input của form
    var formRules = {};
    if (form) {
        var inputs = form.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            // mảng các rule tương ứng với 1 thẻ input
            var rules = input.getAttribute('rules').split(' ');
            for (var rule of rules) {
                var ruleFunc = validatorRules[rule];
                if (rule.includes(':')) {
                    // ví dụ: ruleDetail = ['min', 6];
                    var ruleDetail = rule.split(':');
                    ruleFunc = validatorRules[ruleDetail[0]](ruleDetail[1]);
                }

                // vì lần đầu tiên formRules[input.name] sẽ k phải là mảng nên phải gán giá trị
                // những lần sau ta sẽ tiến hành push
                if (!Array.isArray(formRules[input.name])) formRules[input.name] = [ruleFunc];
                else formRules[input.name].push(ruleFunc);
            }

            // event cho input
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // handle form submit
        form.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;

            var inputs = form.querySelectorAll('[name][rules]');
            for (var input of inputs) {
                if (handleValidate({ target: input })) isValid = false;
            }

            if (isValid) {
                if (typeof _this.onSubmit === 'function') {
                    var inputs = form.querySelectorAll('[name]');
                    var formValues = Array.from(inputs).reduce(function (values, input) {
                        switch (input.type) {
                            case 'radio':
                                // chọn radio cùng name và được checked
                                values[input.name] = form.querySelector(
                                    'input[name="' + input.name + '"]:checked',
                                ).value;
                                break;
                            case 'checkbox':
                                if (input.matches(':checked')) {
                                    if (!Array.isArray(values[input.name])) values[input.name] = [input.value];
                                    else values[input.name].push(input.value);
                                } else {
                                    if (!Array.isArray(values[input.name])) values[input.name] = '';
                                    return values;
                                }
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    _this.onSubmit(formValues);
                } else form.submit();
            }
        };

        function handleValidate(event) {
            // event.target trả về Element đã xảy ra sự kiện đó
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            // is invalid
            if (errorMessage) {
                event.target.classList.add('is-invalid');
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    var formMessage = formGroup.querySelector('.invalid-feedback');
                    if (formMessage) formMessage.innerText = errorMessage;
                }
            }
            return errorMessage;
        }

        function handleClearError(event) {
            // clear error
            if (event.target.classList.contains('is-invalid')) {
                event.target.classList.remove('is-invalid');
                var formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    var formMessage = formGroup.querySelector('.invalid-feedback');
                    if (formMessage) formMessage.innerText = '';
                }
            }

            // is valid
            var rules = formRules[event.target.name];
            var errorMessage;
            rules.find(function (rule) {
                errorMessage = rule(event.target.value);
                return errorMessage;
            });

            if (!errorMessage) event.target.classList.add('is-valid');
        }
    }

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) return element.parentElement;
            element = element.parentElement;
        }
    }
}
