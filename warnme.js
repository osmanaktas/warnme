setTimeout(function () {
    var last = null, warnme = null, warnme_intv = null, marketname = location.href.replace(/.*MarketName=/, ""), socketstatus = false;
    var fixnum = function(num){
	if (typeof num != "number")
		num = parseFloat(num);
	num = num.toFixed(12);
	return num.substr(0,num.indexOf(".") + 9);
    }
    $(document).on('change', '.botalertmute', function () {
        if ($(this).is(":checked"))
            localStorage.setItem("warnme_alertmute", 1);
        else
            localStorage.removeItem("warnme_alertmute");
    });

    $(document).on("click", ".botbut", function () {
        last = Number(document.title.match(/\((.*?)\)/i)[1]);
        var min = $('.botmin').val();
        var max = $('.botmax').val();
        var but = $(this);
        var uyari = function (str) {
            if (!localStorage.getItem("warnme_alertmute")) {
                var cal = new Audio("https://soundbible.com/mp3/fire-truck-air-horn_daniel-simion.mp3");
                cal.addEventListener('canplaythrough', function () {
                    cal.play();
                    alert(str);
                }, false);
            } else
                alert(str);
        }
        
        socketstatus = $('.fa-wifi').hasClass('socket-status-normal');
        if (!(min < last)) {
            alert("Min value is wrong. " + min + "<" + last);
            return;
        }

        if (!(max > last)) {
            alert("Max value is wrong.  " + max + ">" + last);
            return;
        }

        if (!(Number(min) && Number(max))) {
            alert("Wrong values");
            return;
        }


        if (!socketstatus) {
            alert("Connection error. Check internet connection");
            return;
        }

        if (but.attr("aktif") == "0") {
            but.removeAttr("aktif").val("Running").css("color", "green");
            $('.botmin, .botmax').attr("disabled", true);
            console.warn("Warnme running -->  min:" + min + ", max:" + max);
            if (warnme_intv)
                clearInterval(warnme_intv);
            warnme_intv = setInterval(function () {
                if (localStorage.getItem("warnme_alertmute"))
                    $('.botalertmute').prop("checked", true);
                else
                    $('.botalertmute').prop("checked", false);
                last = Number(document.title.match(/\((.*?)\)/i)[1]), msg = marketname + " : " + last, socketstatus = $('.fa-wifi').hasClass('socket-status-normal');
                if (!socketstatus) {
                    but.attr("aktif", "0").val("Stopped").css("color", "red");
                    $('.botmin, .botmax').attr("disabled", false);
                    console.warn("Warnme :  connection error.");
                    uyari("Warnme : Connection error. Check internet connection");
                    clearInterval(warnme_intv);
                }
                if (min >= last || last >= max) {
                    but.attr("aktif", "0").val("Stopped").css("color", "red");
                    $('.botmin, .botmax').attr("disabled", false);
                    console.warn("Warnme :  " + msg + ". Warnme function ended");
                    uyari(msg);
                    clearInterval(warnme_intv);
                }
                console.warn("Warnme");
            }, 300);
        } else {
            console.warn("Warnme :  stopped");
            clearInterval(warnme_intv);
            $('.botmin, .botmax').attr("disabled", false);
            but.attr("aktif", "0").val("Stopped").css("color", "red");
        }
    });
     
    last = Number(document.title.match(/\((.*?)\)/i)[1]);
    var botalertmute_checked = (localStorage.getItem("warnme_alertmute")) ? 'checked="checked"' : '',minval=fixnum(last-(last*0.05)),maxval=fixnum(last+(last*0.05));

    var html = '<table style="width:100%"><tr><td colspan="3" style="text-align:center">WARN ME v1</td></tr><tr>';
    html += '<td>Min : <input style="width:70%" type="text" class="botmin" value="'+minval+'" /></td>';
    html += '<td>Max : <input style="width:70%" type="text" class="botmax" value="'+maxval+'" /></td>';
    html += '<td style="width:70px"><input type="button" class="botbut" value="Stopped" aktif="0" style="color:red" /></td>';
    html += '</tr><tr><td colspan="3">&nbsp;</td></tr><tr><td colspan="2"><label><input type="checkbox" class="botalertmute" ' + botalertmute_checked + ' /> Alert sound muted</label> (<a href="javascript:;" onclick="var cal = new Audio(\'https://soundbible.com/mp3/fire-truck-air-horn_daniel-simion.mp3\'); cal.play();">Test alert sound</a>)</td><td style="text-align:right;width:100px;"><a target="_blank" href="https://github.com/osmanaktas/warnme">Source</a></td>';
    html += '</tr></table>';
    html = '<div class="col-md-12 hidden-sm hidden-xs" style="background: ghostwhite;"><div class="wrapper">' + html + '</div></div>';

    $('.market-stats').append(html);




    // Google GA 

    var trackButtonClick = function (e) { // bunu simdilik kullanmıyoruz
        _gaq.push(['_trackEvent', "event_id", 'clicked']);
    }

    var _AnalyticsCode = 'UA-111551936-1';

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', _AnalyticsCode]);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();

}, 10000);

