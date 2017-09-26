var date_month_label_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
if (typeof console === "undefined" || typeof console.log === "undefined") {
	console = { log: function() {} };
}
function grab_posts(post_type) {
	// Show loading
	$('#' + post_type + '_content').html('<div class="loading_home"><i class="fa fa-spin fa-refresh"></i></div>');
	
	// Grab data!
	$.ajax({
		url: 'http://api.tumblr.com/v2/blog/tessa23fdn.tumblr.com/posts' +
			'?api_key=i8L917aAsmUuIyAPrpk1kaR7Q40qT0VI0lZ7KXTw5dzeLnEXJB&tag=' + post_type + 
			'&filter=text&callback=?',
		dataType: 'jsonp',
		type: 'GET',
		crossDomain: true,
		success: function(returned_data) {
			var data_loaded = false;
			
			//try {
				var post_array = returned_data.response.posts;
				if (post_array.length > 0) {
					var post_count = 0;
					//$('#' + post_type + '_content').html('<ul></ul>');
					$('#' + post_type + '_content').html('<div class="list-group"></div>');
					for (var i = 0; i < post_array.length; i++) {
						var post_title = '';
						if (typeof post_array[i].title !== 'undefined') {
							post_title = post_array[i].title;
						}
						else if (typeof post_array[i].caption !== 'undefined') {
							post_title = post_array[i].caption;
						}
						else if (typeof post_array[i].body !== 'undefined') {
							post_title = post_array[i].body;
						}

						if (post_title != '') {
							if (post_title.length > 100) {
								post_title = post_title.substring(0, 100) + '...';
							}

							var date_string = '';

							if (post_type == 'news') {
								//var d = Date.parse(post_array[i].date);
								var d = new Date( parseInt( post_array[i].timestamp ) * 1000);

								date_string = '<p class="list-group-item-text">' + 
								date_month_label_array[ parseInt( d.getMonth() ) ] + ' ' + d.getDate() + ', ' + d.getFullYear() + 
								'</p>';
							}

							//$('#' + post_type + '_content ul').append(
							//	'<li><a href="/post/' + post_array[i].id + '">' + post_title + '</a></li>'
							//);

							$('#' + post_type + '_content div.list-group').append(
								'<a href="/post/' + post_array[i].id + '" class="list-group-item">' + 
									date_string + '<h4 class="list-group-item-heading">' + post_title + '</h4></a>'
							);

							/*
							<div class="list-group">
							  <a href="#" class="list-group-item active">
							    <h4 class="list-group-item-heading">List group item heading</h4>
							    <p class="list-group-item-text">...</p>
							  </a>
							</div>
							*/

							data_loaded = true;
							post_count++;
						}

						if (post_count >= 5) {
							break;
						}
					}
				}
			//}
			//catch (err) {
			//	console.log(err);
			//}

			if ( ! data_loaded) {
				$('#' + post_type + '_content').html('Unable to load posts.');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			$('#' + post_type + '_content').html('Unable to load posts.');
		}
	});
}
$(document).ready(function() {
	grab_posts('news');
	grab_posts('events');
});