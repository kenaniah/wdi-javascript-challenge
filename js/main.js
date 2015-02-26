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
	$(".js-page").hide();
	
	//Mark all links as inactive
	$("NAV A").removeClass("active");
	
	//Be sure to blur whatever was focused
	$(":focus").blur();
	
	//Render the page or redirect to the index route
	if(routes[location.hash]){
		
		//Show the selected page
		var $page = $("#" + routes[location.hash]);
		$page.show();
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
		history.replaceState(null, null, "#/");
		$(window).trigger("hashchange");
		
	}
	
});

/**
 * Onload
 */
$(function(){
	
	//Compile the Handlebars template
	var results_template = Handlebars.compile($("#results-template").html());
	
	//Ensure a valid route is rendered on load
	$(window).trigger("hashchange");
	
	//Handle search form submissions
	$("#search-form").submit(function(){
		
		var params = $(this).serialize();
		
		//Push the state if not already the same URL
		if(window.location.search != "?" + params){
			history.pushState(null, null, "?" + params + location.hash);
			//console.debug("history state pushed");
		}
		
		//Track the last search
		$(this).data('last-query', params);
		
		//Fade in the spinner
		$(".js-results").hide();
		$(".img-spinner").fadeIn();
		
		//Perform the AJAX request
		$.ajax("http://www.omdbapi.com/?" + params + "&plot=full&r=json", {
			dataType: "json",
			success: function(response){
				
				//console.debug(response);
				
				//Transformations
				if(response['Poster'] == "N/A") response['Poster'] = null;
				
				if(response['Response'] == "True"){
					$(".js-results").html(results_template(response));
				}else{
					$(".js-results").html("<h2>Nothing Found :-(</h2>");
				}
				
				$(".img-spinner").hide();
				$(".js-results").fadeIn();
			}
		});
		
		//Ensure the default browser action does not fire
		return false;
		
	});
	
	//Override the reset button
	$("INPUT[type='reset']").click(function(){
		window.location.search = "";
	});
	
});