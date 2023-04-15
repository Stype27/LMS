 // BOOKS, MEMBERS, CATALOGUE
 
 // Toggle blur & popup function (books.html/members.html)
 function toggle() {
    let blur = $('#blur');
    blur.toggleClass('active');
    let popup = $('#popup');
    popup.toggleClass('active');
}


// Populate popup form fields with corresponding values of a selected book (books.html)
function editBook(id, title, author, genre, year, stock) {
    $("#form_id").val(id);
    $("#form_title").val(title);
    $("#form_author").val(author);
    $("#form_genre").val(genre);
    $("#form_year").val(year);
    $("#form_stock").val(stock);
}


// Dynamic search with AJAX (books.html)
function searchBook() {
    let query = $('#search').val();
    let field = $('#field').val();

    $.get('/books', {'query': query, 'field': field}, function(data) {
        let table = $('#books tbody');
        table.empty();

        // Reload template if query empty
        if (!query) {
            window.location.reload();
        } else {
            // Iterate over data and populate rows
            data.forEach(function(book) {
                let row = $('<tr></tr>');
                row.append($('<td></td>').text(book.id));
                row.append($('<td></td>').text(book.title));
                row.append($('<td></td>').text(book.author));
                row.append($('<td></td>').text(book.genre));
                row.append($('<td></td>').text(book.year));
                row.append($('<td></td>').text(book.stock));
                
                // Form, input and button elements
                let form = $('<form></form>').attr('action', '/books').attr('method', 'POST').on('click', function(e) {
                    if (!confirm('Completely remove \'' + book.title + '\' by ' + book.author + ' (book ID: ' + book.id + ') and all of its stock from library database?')) {
                        // Prevent form submission if user cancels
                        e.preventDefault();
                    }
                });
                let input = $('<input>').attr("name", 'id').attr('value', book.id).hide();
                let button = $('<button></button>').text('Remove').addClass('button').attr('name', 'button').attr('value','remove');
                
                // Append form along with input and button elements to a row
                row.append($('<td></td>').append(form.append(input).append(button)));

                // Toggle and editBook functions appended to a table row along with Edit button and its class
                row.append($('<td></td>').append($('<button></button>').text('Edit').addClass('button btn-edit').click(function() {
                    toggle();
                    editBook(book.id, book.title, book.author, book.genre, book.year, book.stock);
                })));

                // Add row to a table
                table.append(row);
            });
        }
    });
}


// Dynamic search with AJAX using json response from books endpoint (catalogue.html)
function searchCatalogue() {
    let query = $('#search').val();
    let field = $('#field').val();
    $.get('/books', {'query': query, 'field': field}, function(data) {
        let table = $('#books tbody');
        table.empty();

        // Reload template if query empty
        if (query === '') {
            window.location.reload();
        } else {
            // Iterate over data and populate rows
            data.forEach(function(book) {
                let row = $('<tr></tr>');
                row.append($('<td></td>').text(book.id));
                row.append($('<td></td>').text(book.title));
                row.append($('<td></td>').text(book.author));
                row.append($('<td></td>').text(book.genre));
                row.append($('<td></td>').text(book.year));
                row.append($('<td></td>').text(book.stock));
                row.append($('<td></td>').text(book.available));
                table.append(row);
            });
        }
    });
}


// Populate popup form fields with corresponding values of a selected member (members.html)
function editMember(member_id, name, email, address, phone) {
    $("#form_id").val(member_id);
    $("#form_name").val(name);
    $("#form_email").val(email);
    $("#form_address").val(address);
    $("#form_phone").val(phone);
}


// Dynamic search with AJAX (members.html)
function searchMember() {
    let query = $('#search').val(); 
    let field = $('#field').val();
    $.get('/members', {'query': query, 'field': field}, function(data) {
        let table = $('#members tbody');
        table.empty();

        // Reload template if query empty
        if (!query) {
            window.location.reload();
        } else {
            // Iterate over data and populate rows
            data.forEach(function(member) {
                let row = $('<tr></tr>');
                row.append($('<td></td>').text(member.member_id));
                row.append($('<td></td>').text(member.name));
                row.append($('<td></td>').text(member.email));
                row.append($('<td></td>').text(member.address));
                row.append($('<td></td>').text(member.phone));
                
                // Form, input and button elements
                let form = $('<form></form>').attr('action', '/members').attr('method', 'POST').on('click', function(e) {
                    if (!confirm("Completely remove member " + member.name + " (member ID: " + member.member_id + ") and all their details from library database?")) {
                        // Prevent form submission if user cancels
                        e.preventDefault();
                    }
                });
                let input = $('<input>').attr("name", 'id').attr('value', member.member_id).hide();                
                let button = $('<button></button>').text('Remove').addClass('button').attr('name', 'button').attr('value','remove');
                
                // Append form along with input and button elements to a row
                row.append($('<td></td>').append(form.append(input).append(button)));

                // Toggle and editMember functions appended along with Edit button and its class
                row.append($('<td></td>').append($('<button></button>').text('Edit').addClass('button btn-edit').click(function() {
                    toggle();
                    editMember(member.member_id, member.name, member.email, member.address, member.phone);
                })));

                // Add row to a table
                table.append(row);
            });
        }
    });
}


// CHECKOUT

function checkoutMemberSearch() {
    let query = $('#searchMember').val();
    // Query empty
    if (!query) {                         
        $('.collapse').hide();         // Hide collapsable element
        $('#member tbody').empty();    // Clear table's body element
        $('#searchMember').focus();    // Focus back (caret) on input element
        return                            
    }
    $.get('/checkout', {'queryMember': query}, function(data) {
        let found = false;
        // Assign a row element and its class to a row variable
        let row = $('<tr></tr>').addClass('row-member-ch');
        // Show collapsable element
        $('.collapse').show();
        // Iterate over data response (array of objects)
        data.forEach(function(element) {
            // Query exists in data
            if(query == element.member_id) {
                       
                // Populate rows with members details and add cancel button
                row.append($('<td id="memberId"></td>').text(element.member_id));
                row.append($('<td></td>').text(element.name));
                row.append($('<td></td>').text(element.email));
                row.append($('<td></td>').text(element.address));
                row.append($('<td></td>').text(element.phone));
                // Also used in script below to check max amount of books that can be issued to a member (6):
                row.append($('<td id="borrowed"></td>').text(element.borrowed));
                // Cancel button
                row.append($('<td></td>').html('<button class="btn-cancel-member" id="cancelMember">Cancel</button>'));
                // Add hidden input element with member id value to the form element at the bottom of the template
                $('#checkout').append($('<input name="memberId" hidden>').attr('value', element.member_id));

                // Add to/replace existing content of tbody element (so only one member will show at time) 
                $('#member tbody').html(row);
                // Set found variable to true
                found = true; 
                // Move focus (caret) to searchBook input element
                $('#searchBook').focus();
            }
        });  
        // Query doesn't exists in data
        if (!found) {
            $('.collapse').hide();
            $('#member tbody').empty();
            $('#searchMember').val('');
            alert('Member ID does not exist in library database');
            $('#searchMember').focus();
            // If book in collapseable element already searched for, clear that element and search value
            $('#book tbody').empty();
            $('#searchBook').val('');
        }
        // Remove member (clear table's body element) if cancel selected
        $('#cancelMember').click(function() {
            $('.collapse').hide();
            $('#member tbody').empty();
            $('#searchMember').val('');
            $('#searchMember').focus();
            // If book in collapseable element already searched for, clear that element and search value
            $('#book tbody').empty();
            $('#searchBook').val('');
            // Clear any added books in collapseable element
            $('#addedBooks tbody').empty();
        });
    });
}


function checkoutBookSearch() {
    let query = $('#searchBook').val();
    // Query empty
    if (!query) {                         
        $('#book tbody').empty();    // Clear table's body element
        $('#searchBook').focus();    // Focus back (caret) on input element
        return                            
    }
    $.get('/checkout', {'queryBook': query}, function(data) {
        let found = false;
        // Assign a row element and its class to a row variable
        let row = $('<tr></tr>');
        
        // Iterate over data response (array of objects)
        data.forEach(function(element) {
            // Query exists in data
            if(query == element.id) {
                       
                // Populate rows with book details and add cancel and add book buttons
                row.append($('<td></td>').text(element.id));
                row.append($('<td></td>').text(element.title));
                row.append($('<td></td>').text(element.author));
                row.append($('<td></td>').text(element.genre));
                row.append($('<td></td>').text(element.year));
                row.append($('<td class="available"></td>').text(element.available));
                row.append($('<td></td>').html('<button class="btn-book" id="addBook">Add Book</button>'));
                row.append($('<td></td>').html('<button class="btn-book" id="cancelBook">Cancel</button>'));
                // Add to/replace existing content of tbody element (so only one book will show at time) 
                $('#book tbody').html(row);
                // Set found variable to true
                found = true; 
                
                // Add books block
                $('#addBook').click(function() {
                    let alreadyAdded = false;
                    // Loop through each row in the table to check if book has already been added
                    $('#addedBooks tbody tr').each(function() {                        
                        if ($(this).find('.check-Id').text() == element.id) {
                            alreadyAdded = true;
                            // As soon as book match found break out of the loop
                            return false; 
                        }
                    });
                    // Book already added
                    if (alreadyAdded) {
                        alert('Book already added');
                    // Book current stock == 0
                    } else if($('.available').text() <= 0) {
                        alert('Book currently unavailable')
                    } else {
                        // Add book to table
                        let rowAdded = $('<tr></tr>').addClass('row-data');
                        rowAdded.append($('<td class="check-Id"></td>').text(element.id));
                        rowAdded.append($('<td></td>').text(element.title));
                        rowAdded.append($('<td></td>').text(element.author));
                        rowAdded.append($('<td></td>').text(element.genre));
                        rowAdded.append($('<td></td>').text(element.year));
                        rowAdded.append($('<td></td>').html('<button class="btn-remove-book">Remove</button>'));                        
                        $('#addedBooks tbody').append(rowAdded);
                        // Add hidden input elements with book id values to the form element
                        $('#checkout').append($('<input name="bookId" hidden>').attr('value', element.id));
                        // Clear search result and move focus back to search 
                        $('#book tbody').empty();
                        $('#searchBook').val('');
                        $('#searchBook').focus();
                    }
                });
            }
        });
        // Remove added book by emptying the closest row to remove button
        $('#addedBooks tbody').on('click', '.btn-remove-book', function() {
            $(this).closest('tr').remove(); 
        });

        // Query doesn't exists in data
        if (!found) {
            $('#book tbody').empty();
            $('#searchBook').val('');
            alert('Book ID does not exist in library database');
        }
        // Cancel book search (clear table's body element) if cancel selected
        $('#cancelBook').click(function() {
            $('#book tbody').empty();
            $('#searchBook').val('');
            $('#searchBook').focus();
        }); 
    });
}


// Check different parameters before submiting
$(document).ready(function() { 
    $('#checkout').submit(function(event) {         
        
        // Number of rows (added books)
        let counter = $('.check-Id').length;

        // No books added
        if(counter == 0) {
            // Show alert and prevent submission
            alert('No books added yet');
            event.preventDefault();

        // Member can not have more than 6 books at a time. Books that are previously borrowed but not returned yet are taken into account
        } else if((parseInt($('#borrowed').text()) + counter) > 6) {
            alert('Maximum number of books a member can hold at a time is 6');
            event.preventDefault();
        }
        // Else prompt for confirmation
        else {
            // If ok selected -> submit and let backend do the rest
            if(confirm('Confirm checkout')) {
            
            }
            // If cancel selected prevent submission
            else {
                event.preventDefault();
            }
        }
    });
});


// INDEX (BOOK RETURNS)

$(document).ready(function() {
    
    $('.row-data-index').click(function () {

        // Clear table body element and remove all hidden input elements (in case they were already populated from previous click)
        $('#borrowed tbody').empty();
        $('#inputMemId').remove();
        $('.inputAll').remove();
        

        // Get child's value (member id) of a row clicked on
        let memId = $(this).find('.memId').text();

        // Ajax post request (endpoint response: books and transactions lists)
        $.post('/', dataType="json", function(data) {
            
            let borrowedBooks = []
            // Iterate over transactions and push all book's ids that a certain member borrowed into a list
            data[1].forEach(function(transaction) {
                if(memId == transaction.borrower_id && transaction.type == 'borrow') {
                    borrowedBooks.push(transaction.book_id);
                }                
            });
            // Iterate over borrowedBooks list and compare its ids with list of books ids
            borrowedBooks.forEach(function(id) {
                data[0].forEach(function(books) {
                    if(id == books.id) {
                        let row = $('<tr></tr>').addClass('row-return');
                        row.append($('<td></td>').text(books.id));
                        row.append($('<td></td>').text(books.title));
                        row.append($('<td></td>').text(books.author));
                        row.append($('<td></td>').text(books.genre));
                        row.append($('<td></td>').text(books.year));

                        // Initialize form, input and button variables
                        let form = $('<form></form>').attr('action', '/').attr('method', 'POST').on('click', function(e) {
                            if (!confirm("Return book " + books.title + "?")) {
                                // Prevent form submission if user cancels
                                e.preventDefault();
                            }
                        });
                        let inputBook = $('<input>').attr("name", 'id').attr('value', books.id).hide(); 
                        let inputMember = $('<input>').attr("name", 'memberId').attr('value', memId).hide();
                        let button = $('<button></button>').text('Return').addClass('btn-return-book');
                        
                        // Append form along with inputs and button elements to a row
                        row.append($('<td></td>').append(form.append(inputBook).append(inputMember).append(button)));

                        // Add row to a tbody element
                        $('#borrowed tbody').append(row);

                        // Add input element(s) to a form (id="returnAll") with borrowed book(s) id(s)
                        $('#returnAll').append(($('<input>')).attr('class','inputAll').attr('name', 'all_ids').attr('value', books.id).hide());  
                    }
                });
            }); 
            // Add input elements to a form (id="returnAll") with values member Id and list of all borrowed books ids
            $('#returnAll').append(($('<input>')).attr('id','inputMemId').attr('name', 'memberId').attr('value', memId).hide());
                     
        });        
    });
});