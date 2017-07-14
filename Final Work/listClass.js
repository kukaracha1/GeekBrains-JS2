
function List() {
//private:
    var 
    // items
        items,
    // variables
        pageCount,
        currentPage=1,
        currentUser={ 
            name    : '',
            id      :   -1
            },
        privateFields,
    // links
        directory,
        urlPageGet,
        urlItemGet,
        urlItemSet,
        urlUserGet,
    // form
		form  = $('<form/>'),
		table = $('<table/>' , {
			class : 'table t-hover'
		}),
        headerMenu = $('<div/>' , {
            class   :   'menu'
        }),
		pageSwitcher = $('<div/>' , {
            class   :   'ta-center'
        }),
        bkg = $('<div/>' , {
            class   :   'bkg none'
        }),
        // assembly objects
		wrapper = $('<div/>' , {
			class	: 'list_wrapper col-md-offset-1',
		})
		;        

// functions
    // clean the page & fill it by basics elements
    function clean()
    {
        $(wrapper)
            .empty()
            .append($(bkg))
            .append($(headerMenu));  
        fillHeader();
        return $(wrapper);
    }
    // header menu
    function fillHeader()
    {
        $(headerMenu).empty().append($('<button/>' , {
                class   : 'btn btn-success fleft',
                text    :   'Take by №'
            }).click( function(e){
                e.preventDefault();
                takeBook({
                    taken   :   false
                });
            }))
            .append($('<button/>' , {
                class   : 'btn btn-warning fleft',
                text    :   'Take back by №'
            }).click( function(e){
                e.preventDefault();
                takeBook({
                    taken   :   true
                });            
            }))
            .append($('<button/>' , {
                class   : 'btn btn-primary fright',
                text    :   (( currentUser.id == -1 )? 'My' : 'Library') + ' books'
            }).click( function(e){
                e.preventDefault();

                console.log(currentUser.id);
                if( currentUser.id == -1 )
                {
                    // open my books
                    myBooks(this);
                    // $(this)[0].innerText = 'Library books';
                    // $(this).data()['currentUser.id'] = 2;
                }
                else
                {
                    getPage();
                    $(this)[0].innerText = 'My books';
                    // swiped buttons
                    currentUser.id = -1;                    
                }
            }))
            .append($('<p/>' , {
                class   :   'username fright',
                text    : ((currentUser.id != -1)? 'User: '+currentUser.name  : '')
            }))
            // .append($('<button/>' , {
            //     class   : 'btn btn-primary fright',
            //     text    :   'Library books'
            // }).click( function(e){
            //     e.preventDefault();
            //     getPage();
            // }));

    }

    // set state of book
    function setBook(takeData, callback=null ,fail=null)
    {
        $.ajax( {
                        url     :  directory + urlItemSet,
                        dataType    :   'json',
                        method      :   'GET',
                        data    :   takeData
                    })
                    .done( function(response) {
                        console.log('Everything is allright');
                        // onView(response.id);
                        if (callback!=null)
				            callback(response);
                    })
                    .fail( function(error) {
                        console.log('Error'); console.log(error);
                        if (fail!=null)
                            fail(error);
                    })
    }
    // get book's info
    function getBook(data, callback=null , fail=null)
    {
        $.ajax({
			url : directory + urlItemGet,
			method: 'GET',
			dataType: 'json',
			data: data
		})
		.done(function(response) {
            if (callback!=null)
                callback(response);
        })
        .fail( function(error) {
            console.log('Error'); console.log(error);
            if (fail!=null)
                fail(error);
        })
    }
   
	// get the list of data
	function getPage(page=currentPage , callback=refreshTable)
	{
        if(page != 'id_access')
            currentPage = page;
		$.ajax( {
			url			: directory + urlPageGet,
			method		: 'GET',
			dataType	: 'json',
			data		: 
            // (page!=null)? 
            {
				page	:	page
			} 
            // : {}
		})
		.done(function(response) {
			if (callback!=null)
				callback(response);
		})
		.fail(function(error) {
			console.log('Error'); console.log(error);
		});
	}
    // get user's info
    function getUser(id=currentUser.id , callback=null, fail=null)
    {
         $.ajax({
			url : directory + urlUserGet,
			method: 'GET',
			dataType: 'json',
			data: {
                id  :   id
            }
		})
		.done(function(response) {
            currentUser = response;
            if (callback!=null)
                callback(response);
        })
        .fail( function(error) {
            console.log('Error'); console.log(error);
            if (fail!=null)
                fail(error);
        })       
    }
    // custom prompt window for exchanging data with users
    function prompt( msg, OK=null , Cancel=null)
    {
        // clean();
        function close()
        {
            // $(btn).css('display', 'initial');
            $(form).remove();
            $('.bkg').addClass('none');
        }

        $('.bkg').removeClass('none')
            .click( function(e) {
                e.preventDefault();
                close();
        });

        var form = $('<form/>' , {
                class   :   'form-prompt'
            })
        ;
        
        $(form).append($('<p/>' , { 
                text    :   msg
            }))
            .append($('<input/>' , {
                type    :   'number',
                id      :   'id'
            }))
            .append($('<button/>' , {
                class   :   'btn btn-success',
                text    :   'OK'
                })
                .click( function (e) {
                    e.preventDefault();
                    if($('#id')[0].value == '')
                        $(form).addClass('warning');
                    else
                    {
                    if(OK!=null)
                        OK($('#id')[0].value);
                    close();
                    }    
            }))
            .append($('<button/>' , {
                class   :   'btn btn-danger',
                text    :   'Cancel'
                })
                .click( function (e) {
                    e.preventDefault();
                    close();
                    if(Cancel!=null)
                        Cancel($('#id')[0].value);
                }))      
        $(wrapper).after($(form));
        // focusing on input
        $('#id').focus();

    }

    // "my books" button
    function myBooks(outerBtn)
    {
        prompt('Enter your id:' , function(value) {
                $(outerBtn)[0].innerText = 'Library books';
                getUser(value);
                getPage('id_access' , function(response) {
                    refreshTable(response , value);
                })
        })
    }

    // view choosed book
    function onView(itemId , callback=null){
        clean();
        
        getBook({
             id:   itemId
            },
            function(response) {
                $(form).empty();
                form = $('<form/>');
                
                var state = ( response.taken === false || response.taken === "false" )? 'Available' : ( response.taken === true || response.taken === "true" )? 'Taken' : 'Taken to ' + response.taken;

                $(form)
            // back button
                .append($('<button/>' , {
                    text	:	'Back',
                    class	:	'book_back btn btn-primary'
                }).click(function(e) {
                    e.preventDefault();
                    if (currentUser.id == -1)
                        getPage();
                    else
                    {
                        getPage('id_access' , function(response) {
                            refreshTable(response , currentUser.id);
                        })                        
                    }
                }))
                .append($('<h1/>' , {
                    text    :   response.title,
                    class   :   'ta-center'
                }))
                .append($('<hr/>'))
                .append($('<img/>' , {
                    src    :   directory + 'images/' + response.picture,
                    alt     :    response.title,
                    class   :   'book_cover'
                }))
                .append($('<p/>' , {
                    text    :   'Publisher: ' + response.publisher
                }))
                .append($('<p/>' , {
                    text    :   response.description
                }))
                .append($('<hr/>'))
                .append($('<p/>' , {
                    text    :   'State: ' + state,
                    class   :   'book-state'
                }))
                .append($('<button/>' , {
                    text	:	'Take it ' + ((response.taken)? 'back' : ''),
                    class	:	'btn btn-' + ((response.taken)? 'warning' : 'success')
                }).click(function(e) {
                    e.preventDefault();
                    if(currentUser.id == -1)
                        takeBook(response);
                    else
                        setBook({
                            id      :   response.id,
                            user    :   currentUser.id
                        },
                        function(response) {
                            getPage('id_access' , function(response) {
                                refreshTable(response , currentUser.id);
                            })   
                        });
                }));

                // console.log(form);
                if (callback!=null)
                    callback(form);

                $(wrapper).append($(form));
            });

		
			

    }
    // take/take back a book prompt
    function takeBook(response , msg=null)
    {
        var text = (msg!=null)? msg : 
                    (response.id==null || response.id==undefined)?
                        'Enter book\'s id:'
                        :
                        (response.taken)? 
                            'The book is already taken. Enter your id to take it back:' 
                            : 
                            'The book is not taken yet. Enter your id to take it:'
        ;
        
        prompt(text , function(value) {
            var takeData = {};
            // if we should only get the book's id
            if (response.id==null || response.id==undefined)
            {
                // we should get data of book choosed
                getBook({
                    id  :   value
                },
                function(responseBook) {
                    // check if book is already taken or not

                    if( response.taken == responseBook.taken)
                    {
                        // close();
                        takeBook(responseBook , 'Enter your id:');
                    }
                    else
                    {
                        $(form).addClass('warning');
                         return;
                        // $('#id').title = 'Error input';
                        // $('#id').addClass('warning');
                    }
                })
            }
            else
            {
                // when we got book's id & going to get user id
                takeData.id = response.id;
                takeData.user  = value;

                if(response.taken)
                {
                    // book is taken
                    if (takeData.user != response.taken_by) {
                        $(form).addClass('warning');
                        return;
                    }

                }
                else
                {
                    // book is available
                    // it should be a calendar
                    takeData.take_till = 10;
                }
                console.log(takeData);

                setBook(takeData,
                    function () {
                    close();
                } , 
                    function() {
                    $(form).addClass('warning');
                })
            }
        });

    }
    //filter book's list and return it
    function filterById(items , id){
        filteredItems = [];
        $.each(items , function(index , item) {
            if (item.taken_by == id) 
                filteredItems.push(item);
        })
        return filteredItems;
    }
	// clear and fill the table
	function refreshTable(response , id=null)
	{
        pageCount = response.total_pages;            
        // if we don't need  all books, filter it
        items = (id==null)? response.books : filterById(response.books , id);

        // wrapper
        clean()
        .append($(table))
		.append($(pageSwitcher));


		$(table).empty();
		$.each(items , function(index , item) {
            // create a row
            var tableRow = $('<tr/>', { class: 'table-bordered'});

            // fill the row according to keys of item
            var keys = Object.keys(item);
            // delete keys[key];
            $.each(keys, function(index , key){	
                // exclude specified fields		
                if (privateFields == undefined || privateFields.indexOf(key) == -1)
                {
                    if (item[key] === true || item[key] === false || item[key] === "true" || item[key] === "false")
                    // add icon instead boolean
                        $(tableRow).append( $('<td/>')
                            .append( $('<i/>', { 
                                class: 'fa ' +((item[key] === true || item[key] === "true")? ' fa-check' : 'fa-times')

                            })
                            .click( function(e) {
                                e.preventDefault();
                                onView(item.id);                
                            })
                        ))
                    else
                    // add text
                        $(tableRow).append( $('<td/>' , {
                            text	: item[key]	
                            })
                            .click( function(e) {
                                e.preventDefault();
                                onView(item.id);                
                            }) 
                        );
                }
            });
            $(tableRow).append( $('<td/>' , {
                class   :   'take_btn ta-center'
            })
                .append($('<button/>' , {
                    text	:	'Take it ' + ((item.taken)? 'back' : ''),
                    class	:	'btn btn-' + ((item.taken)? 'warning' : 'success')
                }).click(function(e) {
                    e.preventDefault();
                    if(currentUser.id == -1)
                        takeBook(item);
                    else
                        setBook({
                            id      :   item.id,
                            user    :   currentUser.id
                        },
                        function(response) {
                            // $(this)[0].innerText = 'Take it';
                            // console.log($(btn)[0]);
                            // $(btn).parentElement.remove();
                            $(tableRow).remove();
                        });
                }))
            );
            // add control buttons
            // $(tableRow).append( $('<button/>' , {
            // 		class	: 'btn btn-success',
            // 		text	: 'View'
            // 	}).click(function(e) {
            // 		e.preventDefault();
            // 		onView(item.id);
            // 	})
            // );

            // add row to table
            $(table).append($(tableRow));
		})	

        // page buttons
        $(pageSwitcher).empty();
        if(id==null)
        {
            for(var i=0 ; i<pageCount ; i++)
            {
                $(pageSwitcher).append($('<button/>' , {
                    class   : 'page-'+(i+1)+' btn btn-' + ((i+1==currentPage)? 'warning' : 'primary'),
                    text    :   i+1
                }).click( function(e){
                    e.preventDefault();
                    getPage($(this).text());
                }))
            }

            // show all books
            $(pageSwitcher).append($('<button/>' , {
                    class   : 'page-'+(i+1)+' btn btn-' + ((''==currentPage)? 'warning' : 'primary'),
                    text    :  'All pages'
                }).click( function(e){
                    e.preventDefault();
                    getPage('');
                }))
        }
	}


//public:
    this.setsUrls = function (dir, PageGet, ItemGet,ItemSet , UserGet ) {
       directory = dir + '/';
       urlPageGet = PageGet;
       urlItemGet = ItemGet;
       urlItemSet = ItemSet;
       urlUserGet = UserGet;
    }
    this.setPrivateFields = function () {
        // console.log(arguments);
        privateFields = [];
        // console.log(privateFields);
        for (var i = 0; i < arguments.length; i++) {
            var field = arguments[i];
            privateFields.push(field);
        }
        // console.log(privateFields);
    }
	// return page with table and buttons
	this.getData = function() {
        // console.log($(headerMenu).click);
		getPage();
		return wrapper;
	}    



}