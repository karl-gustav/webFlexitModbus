const mostUsed = [
    'SetAirSpeed',
    'SetAirTemperature',
    'HeatExchanger',
    'Heating',
    'OutdoorAirTemp',
    'ReplaceFilterAlarm',
    'SupplyAirTemp'
];

function loadData() {
    atto({url: '/api/holdingregisters'})
        .done(function(dataStr) {
            const holdingRegisters = JSON.parse(dataStr);
            const holdingRegistersElement = document.getElementById('holdingRegisters');
            holdingRegistersElement.innerHTML = parseHoldingRegisters(holdingRegisters);

            const holdingInputs = holdingRegistersElement.querySelectorAll('input');
            for (let i = 0; i < holdingInputs.length; i++) {
                const input = holdingInputs[i];
                const listener = debounce(function(event) {
                    const name = event.target.attributes['data-name'].value;
                    const register = {
                        name: name,
                        value: parseFloat(event.target.value)
                    };
                    event.target.parentNode.querySelector('output').value = event.target.value
                    atto({url: '/api/holdingregisters/' + name, method: "PATCH", data: JSON.stringify(register)})
                    .done(function(response) { console.log("Successfully set the data to", response);})
                    .error(function(err) {alert(err)});
                }, 500);
                input.addEventListener('input', listener, false);
                const output = input.parentNode.querySelector('output');
                if (output) {
                    output.value = input.value;
                }
            }

        })
        .error(function(err) {console.error(err)});

            atto({url: '/api/inputregisters'})
            .done(function(dataStr) {
                const inputregisters = JSON.parse(dataStr);
                const inputRegistersElement = document.getElementById('inputRegisters');
                inputRegistersElement.innerHTML = parseInputRegisters(inputregisters);
            })
            .error(function(err) {console.error(err)});

        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
}

loadData();

document.getElementById('showAllCheckbox').addEventListener('click', function(event) {
    loadData();
});

function secondsToDaysHoursMinutesSeconds(seconds) {
	let delta = seconds;
	const days = Math.floor(delta / 86400);
	delta -= days * 86400;
	const hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;
	const minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;
	const restSeconds = Math.floor(delta % 60);
	return {d: days, h: hours, m: minutes, s: restSeconds};
}