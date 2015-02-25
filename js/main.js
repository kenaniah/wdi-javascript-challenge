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
$(window).on("hashchange popstate", function(event){
	
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
		
		//Populate the search form
		var params = $.deparam.querystring();
		var $form = $("#search-form");
		if(params['t'] || params['y']){
			
			$form.find("INPUT[name='t']").val(params['t']);
			$form.find("INPUT[name='y']").val(params['y']);
			
			//Resubmit if the form changed
			if($form.data('last-query') != $form.serialize()){
				$form.submit();
			}
			
		}
		
		//Perform autofocusing
		$page.find("[autofocus]").focus();
		
	}else{
		
		//Redirect to the index route
		location.hash = "#/"
	}
	
});

/**
 * Onload
 */
$(function(){
	
	//Ensure a valid route is rendered on load
	$(window).trigger("hashchange");
	
	//Handle search form submissions
	$("#search-form").submit(function(){
		
		console.debug($(this).serialize());
		
		//Push the state if not already the same URL
		var url = "?" + $(this).serialize() + location.hash;
		if(url != window.location.search + location.hash){
			history.pushState(null, null, url);
			console.debug("history state pushed");
		}
		
		//Track the last search
		$(this).data('last-query', $(this).serialize());
		
		//Ensure the default browser action does not fire
		return false;
		
	});
	
});