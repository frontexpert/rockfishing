rockFishing.services.factory('ContactsService', function($q) {
	var formatContact = function(contact) {
		return {
			"displayName" : contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || "Mystery Person",
			"phones" : contact.phoneNumbers || []
		};
	};
	
	var pickContact = function() {
		var deferred = $q.defer();

		if (navigator && navigator.contacts) {
			navigator.contacts.pickContact(function(contact){
				console.log('The following contact has been selected:' + JSON.stringify(contact));
				deferred.resolve(formatContact(contact));
			},function(err){
				console.log('Error: ' + err);
				deferred.reject(err);
			});
		}
		
		return deferred.promise;
	};
	
	return { 
		pickContact : pickContact
	};
});