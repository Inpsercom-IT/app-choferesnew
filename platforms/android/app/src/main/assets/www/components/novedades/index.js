'use strict';
var nove="";
app.novedade = kendo.observable({
    onShow: function() { 
       nove = parametrosOTRen();
       var htmlrbNove ="<center><table align='center' cellpadding='0' cellspacing='0' width='100%'>";
       for (let index = 0; index < nove.length; index++) {
        htmlrbNove += "<tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td><td><p><input type='checkbox' id='"+index+"' value='" + nove[index] + "'><strong><FONT SIZE=3> " + nove[index] + "</FONT></strong></p></td></tr>";
       }
       htmlrbNove += "<tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td><td><p><button id='btnGuadarNovedades0' onclick='grabarNove();' class='w3-btn'><i id=''icnGuadarNovedades0 class='fa fa-floppy-o' aria-hidden='true'></i> GUARDAR NOVEDADES</button></td></tr></table></center>";
       document.getElementById("divNovedades").innerHTML = htmlrbNove;
       llamarNuevoestilo("btnGuadarNovedades");
       llamarNuevoestiloIconB("icnGuadarNovedades");
     }
});
app.localization.registerView('novedade');

function parametrosOTRen() {
    try {
        var accResp = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/2,"+
        localStorage.getItem("ls_idempresa").toLocaleString()+";VH;CAUSAL_NOVEDAD_TRF_VH;;;";
        var respPar;

        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = data.ParametroEmpGetResult;
                    respPar = accResp.split(';');
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", respPar[0]);
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });

        return respPar;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return "error";
    }
}

function grabarNove() {
    try {
        var dataItemNove = JSON.parse(localStorage.getItem("dataItem"));
        var respuesta = "";
        for (let index = 0; index < nove.length; index++) {
            if (document.getElementById(index).checked) {
                respuesta += document.getElementById(index).value.split(' - ')[0] +"|";
            }
        }
        respuesta = respuesta.substr(0,respuesta.length - 1);
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/5,;" + 
        localStorage.getItem("ls_idempresa").toLocaleString()+ ";" + dataItemNove.chasis + ";" + respuesta;
        alert(Url);
        var respPar="";
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    if (inspeccionar(data).substring(0,1)=="1") {
                        alert("DATOS GUARDADOS");
                        localStorage.setItem("banderaRe","1");
                        kendo.mobile.application.navigate("components/despacharVehiculo/view.html");
                     }else{
                         alert(data.qvh70SmsGetResult.substr(2,data.qvh70SmsGetResult.length));
                     }
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });
    } catch (error) {
        alert(error);
    }
}