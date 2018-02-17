    $(function() {
        $.contextMenu({
            selector: '.employee', 
            callback: function(key, options) {
                var m = "clicked: " + key;
                window.console && console.log(m) || alert(m); 
            },
            items: {
                "edit": {name: "Update Accounting Element", icon: "edit"}
            }
        });

        $('.employee').on('click', function(e){
            console.log('clicked', this);
        })    
    });