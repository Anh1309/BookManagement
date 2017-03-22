$(function () {
    $('.datepicker').datepicker();

    $('#bookList').DataTable({
        lengthChange: false,
        pageLength: 50,
        processing: true,
        serverSide: true,
        searching: false,
//        "scrollX": true,
        "info": false,
        "autoWidth": true,
        ajax: {
            url: '/book/book-list',
            type: 'POST'
        },
        columns: [
            {
                'target': 0,
                'data': 'book.id',
                render: function (data) {
                    return '<input type="checkbox" class="checkbox-book" data-id="' + data + '">';
                }
            },
            {'data': 'book.name'},
            {'data': 'user.username'},
            {'data': 'category.name'},
            {
                "data": 'book.public_date',
                "render": function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return (month) + "/" + date.getDate() + "/" + date.getFullYear();
                }
            },
            {'data': 'book.description'}

        ],
        "aoColumnDefs": [
            {'bSortable': false, 'aTargets': ['nosort']}
        ]
    });

    $('#categoryList').DataTable({
        lengthChange: false,
        pageLength: 50,
        processing: true,
        serverSide: true,
        searching: false,
//        "scrollX": true,
        "info": false,
        "autoWidth": true,
        ajax: {
            url: '/category/category-list',
            type: 'POST'
        },
        columns: [
            {
                'data': 'id',
                render: function (data) {
                    return '<input type="checkbox" class="checkbox-category" data-id="' + data + '">';
                }
            },
            {'data': 'name'}

        ],
        "aoColumnDefs": [
            {'bSortable': false, 'aTargets': ['nosort']}
        ]
    });
    
    $('#userList').DataTable({
        lengthChange: false,
        pageLength: 50,
        processing: true,
        serverSide: true,
        searching: false,
//        "scrollX": true,
        "info": false,
        "autoWidth": true,
        ajax: {
            url: '/user/user-list',
            type: 'POST'
        },
        columns: [
            {
                'data': 'id',
                render: function (data) {
                    return '<input type="checkbox" class="checkbox-user" data-id="' + data + '">';
                }
            },
            {
                data: 'username'
            },
            {
                data: 'email'
            }
        ],
        "aoColumnDefs": [
            {'bSortable': false, 'aTargets': ['nosort']}
        ]
    })
    $('#publicDateNow').click(function () {
        $('#publicDate').val(getDate());
    });
    var getDate = function () {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        return (month) + "/" + (day) + "/" + now.getFullYear();
    };
    $("#deleteCategory-button").click(function () {
        var b = 0;
        $(".checkbox-category").each(function () {
            if (this.checked) {
                b++;
            }
        });
        if (b === 0) {
            $(this).attr('data-target', "#deleteCategory-box2");
        } else {
            $(this).attr('data-target', "#deleteCategory-box1");
            var d = 0;
            $('#listCategoryId').val('');
            $('.checkbox-category').each(function () {
                if (this.checked) {
                    var id = $(this).data('id');
                    $('#listCategoryId').val($('#listCategoryId').val() + id + ';');
                    d++;
                }
            });
            $('#countCategory').val(d);

        }
    });
    $('.refreshButton').click(function () {
        location.reload(true);
    });
    $("#selectAllCategory").click(function () {
        $(".checkbox-category").each(function () {
            this.checked = true;
        });
    });
    $("#unselectAllCategory").click(function () {
        $(".checkbox-category").each(function () {
            this.checked = false;
        });
    });

    $("#deleteBook-button").click(function () {
        var b = 0;
        $(".checkbox-book").each(function () {
            if (this.checked) {
                b++;
            }
        });
        if (b === 0) {
            $(this).attr('data-target', "#deleteBook-box2");
        } else {
            $(this).attr('data-target', "#deleteBook-box1");
            var d = 0;
            $('#listBookId').val('');
            $('.checkbox-book').each(function () {
                if (this.checked) {
                    var id = $(this).data('id');
                    $('#listBookId').val($('#listBookId').val() + id + ';');
                    d++;
                }
            });
            $('#countBook').val(d);
        }
    });
    $("#selectAllBook").click(function () {
        $(".checkbox-book").each(function () {
            this.checked = true;
        });
    });
    $("#unselectAllBook").click(function () {
        $(".checkbox-book").each(function () {
            this.checked = false;
        });
    });
    
    $("#deleteUser-button").click(function () {
        var b = 0;
        $(".checkbox-user").each(function () {
            if (this.checked) {
                b++;
            }
        });
        if (b === 0) {
            $(this).attr('data-target', "#deleteUser-box2");
        } else {
            $(this).attr('data-target', "#deleteUser-box1");
            var d = 0;
            $('#listUserId').val('');
            $('.checkbox-user').each(function () {
                if (this.checked) {
                    var id = $(this).data('id');
                    $('#listUserId').val($('#listUserId').val() + id + ';');
                    d++;
                }
            });
            $('#countUser').val(d);
        }
    });
    $("#selectAllUser").click(function () {
        $(".checkbox-user").each(function () {
            this.checked = true;
        });
    });
    $("#unselectAllUser").click(function () {
        $(".checkbox-user").each(function () {
            this.checked = false;
        });
    });

    $('#formAddBook').validate({
        rules: {
            name: {
                required: true,
                maxlength: 200
            },
            public_date: {
                required: true
            }
        },
        messages: {
            name: {
                required: 'Please enter the book name',
                maxlength: 'Book name must consist of maximum 200 characters'
            },
            public_date: {
                required: 'Please choose the public date'
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });

    $('#formAddCategory').validate({
        rules: {
            name: {
                required: true,
                maxlength: 200
            }
        },
        messages: {
            name: {
                required: "Please enter the category name",
                maxlength: 'Category name must consist of maximum 200 characters'
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
    $('#formRegisterUser').validate({
        rules: {
            username: {
                required: true,
                maxlength: 200
            },
            email: {
                required: true,
                maxlength: 200,
                email: true
            },
            password: {
                required: true,
                maxlength: 200
            },
            confirmPassword: {
                required: true,
                equalTo: '#password'
            }
        },
        messages: {
            username: {
                required: 'Please enter your username',
                maxlength: 'Username must consist of maximum 200 characters'
            },
            email: {
                required: 'Please enter your email',
                maxlength: 'Email must consist of maximum 200 characters',
                email: 'Email incorrect'
            },
            password: {
                required: 'Please enter your password',
                maxlength: 'Password must consist of maximum 200 characters'
            },
            confirmPassword: {
                required: 'Please confirm your password',
                equalTo: 'Retype-Password must match with password'
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
    
    $('#formLogin').validate({
        rules: {
            email: 'required',
            password: 'required'
        },
        messages: {
            email: 'Please enter your email',
            password: 'Please enter your password'
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            // Add the `help-block` class to the error element
            error.addClass("help-block");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.parent("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest(".form-group").removeClass("has-error");
        }
    });
    
    $('#changeUsername').click(function() {
        $('#formChangeUsername').show();
        $('#formChangeEmail').hide();
        $('#formChangePassword').hide();
        $('#changeEmail').show();
        $(this).hide();
    });
    
    $('#cancelChangeUsername').click(function(){
        $('#formChangeUsername').hide();
        $('#changeUsername').show();
    });
    
    $('#changeEmail').click(function() {
        $('#formChangeEmail').show();
        $('#formChangeUsername').hide();
        $('#formChangePassword').hide();
        $('#changeUsername').show();
        $(this).hide();
    });
    
    $('#cancelChangeEmail').click(function() {
        $('#formChangeEmail').hide();
        $('#changeEmail').show();
    });
    $('#changePassword').click(function(){
        $('#formChangePassword').show();
        $('#formChangeEmail').hide();
        $('#formChangeUsername').hide();
        $('#changeUsername').show();
        $('#changeEmail').show();
    });
    $('#cancelChangePassword').click(function(){
        $('#formChangePassword').hide();
    })

});

