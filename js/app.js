$(function(){
	// array that will hold object for each corresponding tweet.  
	var tweets = [];   
	// initializing bootstrap tooltips
	$('[data-toggle="tooltip"]').tooltip();

	//__________________________Variables-Tried to minimize jQuery Searches__________________________
	var $dashboard = $('#dashboard');
	var $mainContent = $('#main');
	var username = $dashboard.find('p.username').text();
	var $writeTweet = $dashboard.find('textarea.tweet-compose');
	var $charCount = $dashboard.find('#char-count');
	var $tweetBtn = $dashboard.find('#tweet-submit');
	var $yourPic = $dashboard.find('img');
	// console.log($yourPic);
	var $tweetBlueprint = $mainContent.find('div.tweet:first');



	// check first to see if local storage exists, for data persisting
	// if no local storage, does nothing
	if(typeof localStorage.tweets!=='undefined'){
		tweets = JSON.parse(localStorage.tweets);
		// attaches them to DOM
		for(var i=0; i<tweets.length; i++){
			var currTweet = tweets[i];
			var $tweetClone = fillClone(currTweet.text, currTweet.time);
			$mainContent.find('#stream').prepend($tweetClone);
		}
		$('[data-toggle="tooltip"]').tooltip();
	}


	//__________________________Focus/blur of textarea__________________________
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
	

	//____________________________typing event on form.  ____________________________
	// need to use keyup, not keydown, to calculate length of tweet right
	// keydown/keypress is instant key is pressed down, event happens before length increases
	// so keydown/keypress always calculate one character too few
	$writeTweet.on('keyup', function(){
		var tweetLength = $writeTweet.val().length;
		if(tweetLength>=130){
			$charCount.addClass('longTweet');
		}
		else{
			$charCount.removeClass('longTweet');
		}
		// also have maxlength attribute of textarea set to 200
		if(tweetLength>140){
			$charCount.text(0);
			$tweetBtn.prop('disabled', true);
		}
		else{
			$charCount.text(140-tweetLength);
			$tweetBtn.prop('disabled', false);
		}
	});

	//__________________________Fill Clone Function__________________________
	function fillClone(text, time, name, username, imgURL){
		var $tweetClone = $tweetBlueprint.clone();
		$tweetClone.find('.tweet-text').text(text);
		$tweetClone.find('.time span').attr('data-livestamp', time);
		// $tweetClone.find('strong.fullname').text(name);
		// $tweetClone.find('strong.username').text(username);
		// $tweetClone.find('img.avatar').attr('src', imgURL);
		return $tweetClone;
	}

	//___________________________Posting Tweet Function__________________________

	function postTweet(e){
		console.log('posted tweet');
		e.preventDefault();
		// get newTweet text from text in textarea
		var newTweetText = $writeTweet.val();
		// then clear text area, reset charcount
		$writeTweet.val('');
		$charCount.text(140);
		// adding timestap to work with live timestamp
		var tweetTimeSec = e.timeStamp/1000;
		// can fill in with picture, username, name, later
		var $newTweet = fillClone(newTweetText, tweetTimeSec);
		$mainContent.find('#stream').prepend($newTweet);
		$newTweet.hide().fadeIn(500);

		// updating local Storage, every time tweet is posted
		updateLocalStorage(newTweetText, tweetTimeSec);

		// running bootstrap tooltips again, with new stuff in DOM
		$('[data-toggle="tooltip"]').tooltip();
	}

	//__________________________Update Local Storage Function__________________________

	function updateLocalStorage(text, time, name, username, imgURL){
		newTweetObj = {
			text: text,
			time: time,
			name: name,
			username: username,
			imgURL: imgURL
		};
		tweets.push(newTweetObj);
		localStorage.tweets = JSON.stringify(tweets);
	}


//__________________________Event Handlers: click tweet button, enter key__________________________
$tweetBtn.on('click', postTweet);

	// enter button submits tweet as well
	$('body').on('keypress', function(e){
		// if enter key is pressed, and tweet form is in focus
		if(e.keyCode===13 && $writeTweet.is(':focus')){
			postTweet(e);
		}
	});

	//__________________________Expanding info about Tweet Click__________________________
	$('#stream').on('click', '.tweet', function(e){
		e.preventDefault();
		$(this).find('.statsreply-wrapper').slideToggle(400);
	}).on('click', '.tweet-actions, .reply, .stats', function(e){
		e.stopPropagation(); // need to stop propagation, if click is these elements
	});





















});

