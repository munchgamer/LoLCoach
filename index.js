/*******************************************************************************



*******************************************************************************/



var lolcoach = {
	constants : {
		THROTTLE : 1500,
		API_URI : function(){
			return "https://prod.api.pvp.net/api/lol/"+lolcoach.currentProfile.region+"/v1.3/";
		}
	},
	vars : {
		// a collection of member variables the lolcoach uses.
		lastQueueTime : 0
	}, 
	profiles : {}, // a map of profiles entered and saved in the localstorage.  
	currentProfile : {}, // a pointer to the profile currently being viewed and worked with.
	queue : [], // the processing queue.  We use a queue here to respect the call limits of the riot API.
	
	init : function(){
		var profiles = localStorage.getItem('lolcoach.profiles')
		if(profiles){
			lolcoach.u.showSection('selectProfile');
			lolcoach.profiles = profiles;
		} else {
			lolcoach.u.showSection('setupProfile');
		}
		lolcoach.processQueue();
	},
	
	processQueue : function(){
		var now = lolcoach.u.now()
		if(now - lolcoach.vars.lastQueueTime > lolcoach.constants.THROTTLE && lolcoach.queue.length){
			lolcoach.vars.lastQueueTime = now;
			var qo = lolcoach.queue.splice(0,1)[0];
			if(typeof qo === "function"){
				qo();
			} else if (typeof qo === "object" ){
				if(typeof qo.call === "function"){
					qo.call(qo);
				}
			}
			
			if(!qo.blocking){
				lolcoach.processQueue();
			}
		} else {
			setTimeout(function(){lolcoach.processQueue();},Math.min(lolcoach.constants.THROTTLE -(now - lolcoach.vars.lastQueueTime), 250));
		}
	},
	
	u : {
		now : function(){
			return new Date().getTime();
		},
		showSection : function(section){
			$('.bodySection').hide();
			$('#'+section).show();
		},
		showLoading : function(){
			$('#loader').show();
		},
		hideLoading : function(){
			$('#loader').hide();
		},
		createProfile : function(summonerName, apiKey, region){
			var profileId = summonerName+"|"+region;
			if(lolcoach.profiles[profileId]){
				alert('That profile already exists!');
			} else {
				lolcoach.profiles[profileId] = {
					summonerName : summonerName,
					apiKey : apiKey,
					region : region
				}
				lolcoach.u.selectProfile(profileId);
				lolcoach.queue.push({
					call : lolcoach.calls.summoner.summonerByName,
					summonerNames : summonerName,
					blocking : true,
					callback : function(json){
						lolcoach.profiles[profileId].summonerDto = json[summonerName.toLowerCase()];
					}
				});
			}
		},
		selectProfile : function(profileId){
			if(lolcoach.profiles[profileId]){
				lolcoach.currentProfile = lolcoach.profiles[profileId];
				lolcoach.u.showSection('displayProfile');
			} else {
				alert('That profile does not exist');
			}
		},
		makeCall : function(uri, callback, blocking){
			callback = callback || function(json){};
			$.getJSON(uri+"?api_key="+lolcoach.currentProfile.apiKey,{
				async : true,
				contentType : "application/json",
				dataType : "json"
			}).success(function(json){
				console.dir(json);
				callback(json);
				if(blocking){
					console.log('continuing from blocking queue event');
					lolcoach.processQueue();
				}
			});
		}
	},
	calls : {
		champion : {
			champion : function(params){ //freeToPlay
				
			}
		},
		game : {
			recent : function(params){ //summonerId
			
			}
		},
		league : {
			challenger : function(params){}, //
			entry : function(params){}, //summonerId
			league : function(params){}, //summonerId
		},
		staticData : {
			//ALL PARAMS FOR THESE CALLS ARE OPTIONAL.  NOT INCLUDING THE Id WILL RETURN A LIST OF ALL OF THE SPECIFIED TYPE (champion, item, rune, etc...)
			champion : function(params){}, //id
			item : function(params){}, //id
			mastery : function(params){}, //id
			realm : function(params){}, //
			rune : function(params){}, //id
			summonerSpell : function(params){}, //id
		},
		stats : {
			summary : function(params){}, //summonerId
			ranked : function(params){}, //summonerId
		},
		summoner : {
			masteries : function(params){}, //summonerIds
			runes : function(params){}, //summonerIds
			summonerByName : function(params){
				//summonerNames
				var uri = lolcoach.constants.API_URI();
				uri += "summoner/by-name/"+params.summonerNames;
				lolcoach.u.makeCall(uri, params.callback, params.blocking);
			}, 
			summonerName : function(params){}, //summonerIds
			summoner : function(params){}, //summonerIds
		},
		team : {
			teamBySummoner : function(params){}, //summonerId
			team : function(params){}, //teamIds
		}
	},
	
	
}