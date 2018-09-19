function parseHoldingRegisters(registers) {
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
            console.error("Untyped register", register)
        }
	})
	.map(function(parsed) {
		return '<li class="list-group-item"><label style="display:block;">'
			+ '<h6>' + parsed.register.name + '<small>' + parsed.register.description + ' (Default: ' + parsed.register.default + ')</small></h6>'
			+ parsed.html + '</label></li>';
	})
	.join('\n');
	
	function parseValue(register) {
		const value = register.value;
		const min = register.min;
		const max = register.max;
		return { register: register,
				html:'<input data-name="' + register.name + '" type="range" min="' + min + '" max="' + max + '" value="' + value + '"/> <output></output>'};
	}

	function parseHours(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value * 1000);
		return { register: register,
				html:'<p>' + 
			'days: ' + dhs.d +
			' hours: ' + dhs.h +
			'</p>'};
	}

	function parseMinutes(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value * 60);
		return { register: register,
				html:'<p>' + 
			'days: ' + dhs.d +
			' hours: ' + dhs.h +
			' minutes: ' + dhs.m +
			'</p>'};
	}

	function parseSeconds(register) {
		const dhs = secondsToDaysHoursMinutesSeconds(register.value);
		return { register: register,
				html:'<p>' + 
			'days: ' + dhs.d +
			' hours: ' + dhs.h +
			' minutes: ' + dhs.m +
			' seconds: ' + dhs.s +
			'</p>'};
	}

	function parseBool(register) {
		const value = register.value;
		const min = register.min;
		const max = register.max;
		return { register: register,
				html:'OFF <input data-name="' + register.name + '" type="range" min="0" max="1" step="1" value="' + value + '"/> ON'};
	}

	function parsePercentage(register) {
		const value = register.value;
		const min = register.min;
		const max = register.max;
		return { register: register,
				html:'<input data-name="' + register.name + '" type="range" min="' + min + '" max="' + max + '" step="1" value="' + value + '"/> <output></output>%'};
	}

	function parseTemperature(register) {
		const value = register.value;
		const min = register.min;
		const max = register.max;
		return { register: register,
				html:'<input data-name="' + register.name + '" type="range" min="' + min + '" max="' + max + '" step="0.5" value="' + value + '"/> <output></output>°C</label>'};
	}
}
