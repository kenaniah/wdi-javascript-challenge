/**
 * Configure the default routes for the app
 */
var routes = {
	"#/": "main",
	"#/about": "about", 
	"#/page-2": "page-2"
}

/**
 * Initialize route handling
 */
$(window).on("hashchange", function(event){
	
	//Hide all pages
	$(".js-page").addClass("hidden");
	
	//Mark all links as inactive
	$("NAV A").removeClass("active");
	
	//Be sure to blur whatever was focused
	$(":focus").blur();
	
	//Render the page or redirect to the index route
	if(routes[location.hash]){
		
		//Show the selected page
		var $page = $("#" + routes[location.hash]);
		$page.removeClass("hidden");
		$("NAV A[href='" + location.hash + "']").addClass("active");
		
		//Perform autofocusing
		$page.find("[autofocus]").focus();
		
	}else{
		
		//Redirect to the index route
		location.hash = "#/"
	}
	
});

//Ensure the proper route is rendered on load
$(function(){
	$(window).trigger("hashchange");
})