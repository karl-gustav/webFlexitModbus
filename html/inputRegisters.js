function parseInputRegisters(registers) {
    const showAll = document.getElementById('showAllCheckbox').checked;
    return Object.keys(registers)
    .filter(function(key) {
        if (showAll) {
            return true;
        }
        return mostUsed.indexOf(key) >= 0;
    })
    .map(function(key) {
        register = registers[key];
		if (register.unit === '') {
			return parseValue(register);
		} else if (register.unit === 'h') {
			return parseHours(register);
		} else if (register.unit === 'min') {
			return parseMinutes(register);
		} else if (register.unit === 's') {
			return parseSeconds(register);
		} else if (register.unit === 'bool') {
			return parseBool(register);
		} else if (register.unit === '%') {
			return parsePercentage(register);
		} else if (register.unit === '1°C') {
			return parseTemperature(register);
		} else {
            console.error("Untyped register", register);
        }
	})
	.map(function(parsed) {
		return '<li class="list-group-item">'
			+ '<h6>' + parsed.register.name + '<small>' + parsed.register.description + '</small></h6>'
			+ parsed.html + '</li>';
	})
	.join('\n');

	function parseValue(register) {
		return { register: register,
				html: '<p>' + register.value + '</p>' };
	}

	function parseHours(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value * 1000);
		return { register: register,
				html:'<p>' + 
					'days: ' + dhs.d +
					' hours: ' + dhs.h +
					'</p>' }
	}

	function parseMinutes(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value * 60);
		return { register: register,
				html:'<p>' + 
			'days: ' + dhs.d +
			' hours: ' + dhs.h +
			' minutes: ' + dhs.m +
			'</p>'}
	}

	function parseSeconds(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value);
		return { register: register,
				html:'<p>' + 
			'days: ' + dhs.d +
			' hours: ' + dhs.h +
			' minutes: ' + dhs.m +
			' seconds: ' + dhs.s +
			'</p>'}
	}

	function parseBool(register) {
		return { register: register,
				html:'<p>' + ( register.value ? 'ON' : 'OFF' ) + '</p>'}
	}

	function parsePercentage(register) {
		p = register.value
		return { register: register,
				html:'<div class="progress">' +
		  		'<div class="progress-bar" role="progressbar" style="width: ' + p + '%;" aria-valuenow="' + 25 + '" aria-valuemin="0" aria-valuemax="100">' + p + '%</div>' +
			'</div>'}
	}

	function parseTemperature(register) {
		return { register: register,
				html:'<p>' + register.value + '°C</p>'}
	}}
