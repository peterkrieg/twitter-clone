$(function(){
	
	// trying to limit number of jQuery searches $(''), read somewhere
	var $dashboard = $('#dashboard');
	var $mainContent = $('#main');
	var username = $dashboard.find('p.username').text();
	var $writeTweet = $dashboard.find('textarea.tweet-compose');
	var $charCount = $dashboard.find('#char-count');
	var $tweetBtn = $dashboard.find('#tweet-submit');
	var $yourPic = $dashboard.find('img');
	var $tweetBlueprint = $mainContent.find('div.tweet:first');
	console.log($tweetBlueprint);




	$writeTweet.on('focus', function(){
		$(this).parent().addClass('active');
		$(this).next().css('opacity', 1);
	});
	$writeTweet.on('blur', function(){
		// if you remove class active, it wont' display button at all
		// so when you click button, it can't fire a click event
		// the instant textarea blurs, it removes
		// must be better way than this..
		$(this).next().css('opacity', 0);
	});
	

	//____________________________typing event____________________________

	$writeTweet.on('keyup', function(){
		var tweetLength = $writeTweet.val().length;

		if(tweetLength>=130){
			$charCount.addClass('longTweet');
		}
		else{
			$charCount.removeClass('longTweet');
		}

		// also have maxlength attribute of textarea set to 200
		// to see alternative way
		if(tweetLength>140){
			$charCount.text(0);
			$tweetBtn.prop('disabled', true);
		}
		else{
			$charCount.text(140-tweetLength);
			$tweetBtn.prop('disabled', false);
		}
	});

	//___________________________Posting Tweet event__________________________

	function postTweet(e){
		console.log(e);
		// alert('what');
		e.preventDefault();
		// get newTweet text from text in textarea
		var newTweetText = $writeTweet.val();
		// then clear text area, reset charcount
		$writeTweet.val('');
		$charCount.text(140);
		// copy tweet blueprint, to create new tweet
		var $newTweet = $tweetBlueprint.clone();
		// overwrite blueprint new Tweet with tweet text, name, f
		$newTweet.find('.tweet-text').text(newTweetText);
		$newTweet.find('.fullname').text(username);
		// potential to replace 2 pictures on tweet div
		$yourPicClone = $yourPic.clone();
		$newTweet.find('.avatar').replaceWith($yourPicClone);
		// add new tweet, right at start of stream
		$mainContent.find('#stream').prepend($newTweet);
		$newTweet.hide().fadeIn(500);
	}


	$tweetBtn.on('click', postTweet);


	//__________________________Clicking Tweet event__________________________

	$('#stream').on('click', '.tweet', function(e){
		// if()
		e.preventDefault();
		$(this).find('.statsreply-wrapper').slideToggle(500);
	}).on('click', '.tweet-actions, .reply, .stats', function(e){
		e.stopPropagation();
	});





	// $('#stream').on('click', '.tweet-actions', function(e){

	// });































});

