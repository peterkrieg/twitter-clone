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
	var $tweetBlueprint = $mainContent.find('div.tweet:first');


	//__________________________Checks for Local Storage, for data persisting__________________________
	if(typeof localStorage.tweets!=='undefined'){
		// IFFE to avoid variable problems
		(function(){
			tweets = JSON.parse(localStorage.tweets);
			console.log(tweets);
			// loops through tweets stored in local storage, appends each to DOM
			for(var i=0; i<tweets.length; i++){
				var tweet = tweets[i];
				var $tweetClone = fillClone(tweet.text, tweet.time, tweet.name, tweet.username, tweet.imgURL);
				$mainContent.find('#stream').prepend($tweetClone);
			}
			$('[data-toggle="tooltip"]').tooltip();
		}()); // end of IFFE, invokes immediately
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


	//__________________________Create Random User__________________________
	// when create Random user button clicked, run random user function
	$dashboard.find('.createRandom').on('click', createRandomUser);

	function createRandomUser(e){
		e.preventDefault();
		$.ajax({
			method: 'GET',
			url: 'https://randomuser.me/api/',
			dataType: 'json',
		}).then(function(data){ 
				// data comes back JSON, so don't need to use JSON.parse
				var userObj = data.results[0].user;
				var name = userObj.name.title+' '+userObj.name.first+' '+userObj.name.last;
				var username = userObj.username;
				var imgURL = userObj.picture.medium;
				// now fill in the dashboard again with random user
				$dashboard.find('.fullname').text(name);
				$dashboard.find('.username').text(username);
				// can't chain $dashboard.find('img').attr('src', imgURL) why doesn't this work? have to break into 2 steps
				var $picture = $dashboard.find('img');
				$picture.attr('src', imgURL);
				// run bootstrap tooltips, make sure works again with updated DOM
				$('[data-toggle="tooltip"]').tooltip();
			});
	}


	//__________________________Fill Clone Function__________________________
	function fillClone(text, time, name, username, imgURL){
		var $tweetClone = $tweetBlueprint.clone();
		$tweetClone.find('.tweet-text').text(text);
		$tweetClone.find('.time span').attr('data-livestamp', time);
		$tweetClone.find('strong.fullname').text(name);
		$tweetClone.find('span.username').text(username);
		var $picture = $tweetClone.find('img.avatar:first');
		$picture.attr('src', imgURL);
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
		var imgURL = $dashboard.find('img').attr('src');
		var fullname = $dashboard.find('.fullname').text();
		var username = $dashboard.find('.username').text();
		// can fill in with picture, username, name, later
		var $newTweet = fillClone(newTweetText, tweetTimeSec, fullname, username, imgURL);
		$mainContent.find('#stream').prepend($newTweet);
		$newTweet.hide().fadeIn(500);
		// updating local Storage, every time tweet is posted
		updateLocalStorage(newTweetText, tweetTimeSec, fullname, username, imgURL);

		// running bootstrap tooltips again, with new stuff in DOM
		$('[data-toggle="tooltip"]').tooltip();
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


	//__________________________Expanding info about Tweet Click__________________________
	$('#stream').on('click', '.tweet', function(e){
		e.preventDefault();
		$(this).find('.statsreply-wrapper').slideToggle(400);
	}).on('click', '.tweet-actions, .reply, .stats', function(e){
		e.stopPropagation(); // need to stop propagation, if click is these elements
	});









});

