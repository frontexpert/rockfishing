rockFishing.directives.directive('wavesview', function(){
	return {
		restrict: 'E',
		link: function(scope, element, attrs){
			var waves = scope.item.waves;
			var rowCount = 0;
			var wavesCount = waves.length;
			// calculate how many rows in waves
			if(wavesCount > 0){
				rowCount = Math.ceil(wavesCount / 4);
			}
			
			var rowIndex;
			var waveIndex = 0;
			var columnLimit = 0;
			var template = "";
			for(rowIndex = 0; rowIndex < rowCount; ++rowIndex){
				template = template + "<div class='row tidesContainer'>";
				for(columnLimit = 0, waveIndex; columnLimit<4 && waveIndex<wavesCount; ++columnLimit, ++waveIndex) {
					template = template + "<div class='col-25'>";
					template = template + "<p class='miniParagraph'>"+waves[waveIndex].height+"</p>";
					template = template + "<p class='miniParagraph weatherTime'>"+waves[waveIndex].time+"</p>";
					template = template + "</div>";
				}
				template = template + "</div>";
				if(rowIndex < rowCount -1){
					template = template + "<hr class='weatherDivider'/>";
				}
			}
			
			element.replaceWith(template);
		}
	}
});