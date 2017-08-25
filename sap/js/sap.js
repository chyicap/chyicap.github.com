selected = {};
let eT;

function secantSolver( func, xstart ) {
	var x0 = xstart || 1.1 ;
	var x1 = x0 + ( (x0>0) ? -0.01 : 0.01 ) ;
	var fx0 = func(x0) ;
	var fx1 = func(x1) ;

	var n = 0 ;
	do {
		var x2 = x1 - fx1 * ( x1 - x0 ) / ( fx1 - fx0 ) ;
		x0 = x1 ;
		x1 = x2 ;
		fx0 = fx1 ;
        fx1 = func(x1);
		if( ++n > 10000 ) {
			throw new Error( "Function " + func + " is not converging." ) ;
		}
	// } while(n < 10);
    } while( Math.abs(x1-x0) > 1e-9 && n < 100 ) ;

    if (isNaN(x0) || isNaN(x1)) {
        console.log('난...알 수가 없어');
        return null;
    }

	return x0 ;
}

function mdl(x) {
    // const mc = 72;
    const mc = Number($('#mc').val());
    function alpha(x) {
        return (1/x)*(1/x) + 2*(1/x)*(1/x)*(1/x);
    }
    function beta(x) {
        return (1/x) + 0.3 * (1/x)*(1/x) + Math.log(1-(1/x)) + (3 * (Math.pow((1/x), 1/3) - (1/x)) * (1 + (1/x)) / 4 + (1/x)*(1/x) * Math.log((1/x)) / 2 + (1/x) * (-3 * (Math.pow((1/x), 1/3) - (1/x)) / 4 + 3 * ( 1 - Math.pow((1/x), -2/3) / 3 ) * ( 1 + (1/x)) / 4 -(1/x)/2 - (1/x) * Math.log((1/x)))) / mc;
    }
    return alpha(x) * eT + beta(x);
}

$(document).ready(() => {
    function CalVolume() {
        let totalVolume = 0;
        let e = 0;
        let de = 0;
        let deH = 0;
        let deS = 0;
        $('#selectedMdl').html('');
        Object.keys(selected).forEach((key) => {
            totalVolume += mdlData[key].volume * selected[key];
        });
        if (totalVolume === 0) return;
        $('#totalVolume').html(`Total volume: ${totalVolume}`);
        Object.keys(selected).forEach((key) => {
            const weightOfMdl = mdlData[key].volume * selected[key] / totalVolume;
            e += weightOfMdl * mdlData[key].e;
            de += weightOfMdl * mdlData[key].de;
            deH += weightOfMdl * mdlData[key].deH;
            deS += weightOfMdl * mdlData[key].deS;

            $('#selectedMdl').append(
                `<li>${key}: ${weightOfMdl}</li>`
            )
        });
        let prevSr = null;
        let curSr = null;
        gLabel.splice(0,gLabel.length);
        gData.splice(0,gData.length);

        for (let temp = 273.15; temp <= 373.15; temp += 1) {
            eT = e + (de / (1 + Math.exp(deS - (deH / temp))));
            curSr = secantSolver(mdl);
            if (curSr === null) break;
            if (prevSr === null && Math.abs(prevSr-curSr) >= 10 && false) {
                continue;
            } else {
                prevSr = curSr;
                gLabel.push(`${temp}`);
                gData.push(`${curSr}`);
                // console.log('chart');
                // console.log(temp, curSr);
            }
        }
        eT = e + (de / (1 + Math.exp(deS - (deH / 302.8))));
        chart.update();
        const sr = secantSolver(mdl);
        $('#totalE').html(`Total ε<sup>*</sup>: ${e}`);
        $('#totalDE').html(`Total δε<sup>*</sup>: ${de}`);
        $('#totalDEH').html(`Total δε<sup>H</sup>: ${deH}`);
        $('#totalDES').html(`Total δε<sup>S</sup>: ${deS}`);
        $('#eT').html(`ε tilda: ${eT}`);
        $('#sr').html(sr ? `sr: ${sr}` : '난...알 수가 없어');
    }
    data = {
        'CH3': { volume:13.67, e: -61.6012, de: -51.8462, deH:-12753.7, deS: -44.653},
        'CH2': { volume:10.23, e: -33.6959, de:28.3266, deH:-21894.1, deS:-91.0072 },
        'CH': { volume:6.8, e: -237.466, de:195.359, deH:7213.02, deS:-50.3343 },
        'C': { volume:3.3, e: -209.164, de:173.235, deH:-451933, deS:-1453.64 },
        'Isopropyl': { volume:34.1, e: -46.5288, de:39.8091, deH:2398.52, deS:-1.18258 },
        'Tertiary butyl': { volume:44.35, e: -33.8780, de:29.9307, deH:24861.3, deS:67.7202 },
        'O': { volume:5.5, e: 368.805, de:-302.051, deH:135412, deS:541.486 },
        'COO': { volume:15.2, e: 3.75940, de:-3.19114, deH:-28816.6, deS:-97.4972 },
        'CON': { volume:16, e: 207.239, de:-157.450, deH:40375.5, deS:191.535 },
        'CONH': { volume:13, e: 267.257, de:-219.413, deH:-56960.3, deS:-110.328 },
        'Caprolactam': { volume:67.15, e: 29.2934, de:-11.0805, deH:-33178.4, deS:-73.1455 },
        'Cyclopropyl': { volume:27.26, e: 255.8443, de:47.4383, deH:23696.6, deS:70.2153 },
        'OH': { volume:8, e: 326.768, de:-264.969, deH:318868, deS:1143.19 },
    };
    const localMdlData = localStorage.getItem('mdlData');
    const mdlData = localMdlData ? JSON.parse(localMdlData) : data;

    if (!localMdlData) {
        localStorage.setItem('mdlData', JSON.stringify(data));
    }

    Object.keys(mdlData).forEach((key, index) => {
        data = mdlData[key];
        $('#mdlTable tbody').append(
        `<tr class="clickable-row" data-mdl="${key}">\
<td>${index}</td>\
<td>${key}</td>\
<td><input type="number" value=0 min="0" max="10"/></td>
</tr>`
        );
    });

    $('#mc').change(() => {
        CalVolume();
        chart.update();
    });
    $('#mdlTable tbody input').change(function() {
        const key = $(this).parent().parent().attr('data-mdl');
        const count = Number($(this).val());
        if (count) {
            $(this).parent().parent().addClass('active');
            selected[key] = Number($(this).val());
        } else {
            $(this).parent().parent().removeClass('active');
            delete selected[key];
        }
        CalVolume();
    });
});