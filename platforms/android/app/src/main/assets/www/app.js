'use strict';
// cel: 340 x 640
localStorage.setItem("ls_dimensionW", screen.width);
localStorage.setItem("ls_dimensionH", screen.height);
verVersion();
var wsPrincipal = "http://200.31.10.92:8092/appk_aekia";  //"http://192.168.0.150:8092/appk_aekia";

    var datos_Cliente, Device_identifier, datos_Vehiculo, urlService, observa, observa1;
(function() {
    var app = {
        data: {},
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        }
    };

    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'components/login/view.html'
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function() {

        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

            allItems.each(function(index) {
                navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
            });

             navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");

    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.showNotification = function(message, time) {
        var autoHideAfter = time ? time : 3000;
        app.notification.find('.notify-pop-up__content').html(message);
        app.notification.fadeIn("slow").delay(autoHideAfter).fadeOut("slow");
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function(viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, culture, cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
                app.showMore.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);
/// end app modules

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp

//===========================================================================================================
// RRP: Herramientas
//===========================================================================================================
function inspeccionar(obj) {
    try {
        var msg = '';
        for (var property in obj) {
            if (typeof obj[property] == 'function') {
                var inicio = obj[property].toString().indexOf('function');
                var fin = obj[property].toString().indexOf(')') + 1;
                var propertyValue = obj[property].toString().substring(inicio, fin);
                msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
            } else if (typeof obj[property] == 'unknown') {
                msg += 'unknown ' + property + ' : unknown ;\n';
            } else {
                msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
            }
        }
        return msg;
    } catch (e) {
        alert(e);
    }
}


/*--------------------------------------------------------------------
Fecha: 05/09/2017
Descripcion: Cierra la sesion actual y setea los controles
Parametros: 
--------------------------------------------------------------------*/
function cerrarSistema() {

    //   resetControls("");

    localStorage.clear();

    document.getElementById('usuFabrica').value = "";
    document.getElementById('usuLogin').value = "";
    document.getElementById('usuPass').value = "";

    kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
    kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false }));

    kendo.bind($("#vwLogin"), kendo.observable({ isVisible: true }));
    kendo.bind($("#vwLogout"), kendo.observable({ isVisible: false }));

    kendo.mobile.application.navigate("components/login/view.html");

}
    /*--------------------------------------------------------------------
    Fecha: 05/09/2017
    Descripcion: Abre vista
    Parametros: vista
    --------------------------------------------------------------------*/
    function abrirPagina(vista) {
        kendo.mobile.application.navigate("components/" + vista + "/view.html");
    }


    /*--------------------------------------------------------------------
    Fecha: 18/08/2017
    Descripcion: Alerta con formato
    Parametros: titulo, contenido
    --------------------------------------------------------------------*/
    function myalert(titulo, contenido) {

        $("<div></div>").kendoAlert({
            title: titulo,
            content: contenido
        }).data("kendoAlert").open();
    }


    function myalert2(contenido, titulo) {
        $("<div></div>").kendoAlert({
            title: titulo,
            content: contenido
        }).data("kendoAlert").open();
    }


    function mens(Mensaje, Tipo) {
        var valorIzq = (Mensaje.length) * 4;
        notificationWidget.setOptions({
            position: {
                top: Math.floor($(window).width() / 2),
                left: Math.floor($(window).width() / 2 - valorIzq),
                bottom: 0,
                right: 0
            },
            font: {
                size: 14,
                bold: true
            }
        });
        notificationWidget.showText(Mensaje, Tipo);
    }

    /*--------------------------------------------------------------------
    Fecha: 11/09/2017
    Descripcion: Carga combo
    Parametros:
        combo: control
        arreglo: array con los items
        seleccion: seleccion default
    --------------------------------------------------------------------*/
    function cargaCbo(combo, arreglo, seleccion) {
        if (seleccion != "") {
            $("#" + combo).kendoComboBox({
                dataSource: arreglo,
                value: seleccion
            });
        }
        else {
            $("#" + combo).kendoComboBox({
                dataSource: arreglo
            });
        }
    }
    function verVersion(){
        try {
            var param = {
                    "dt2": "APPMIKIA"
            };
            var Url = "https://biss.kiaecuador.com.ec/api/MnMrE/VmSMMnE"; //"https://play.google.com/store/apps/details?id="+bundle;
                $.ajax({
                    url: Url,
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data : JSON.stringify(param),
                    //Content-Type: application/json
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success: function (datas) {
                        localStorage.setItem("versionapp", JSON.stringify(datas));
                        var objaux = datas? {
                            dt1:hexToRgb(datas.dt1),
                            dt5:hexToRgb(datas.dt5),
                            dt6:hexToRgb(datas.dt6),
                        }:{};
                        localStorage.setItem("versionappRGB", JSON.stringify(objaux));
                    },
                    error: function (err) { alert(inspeccionar(err)); alert("Error en servicio clientes");
                } 
                });
            
        } catch (e) {
            alert(e);
        }
    }
    function llamarColorTexto(menu){
        var elements = Array.prototype.slice.call(document.querySelectorAll(menu));
        var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
      // Loop over each element....
      if(elements.length)
      elements.forEach(function(el){
               el.style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt1.g+","+rgbnuevo.dt1.b+",1)";
              });   
    }
    function llamarColorBotonGeneral(menu){
        var elements = Array.prototype.slice.call(document.querySelectorAll(menu));
        var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
      // Loop over each element....
      if(elements.length)
      elements.forEach(function(el){
               el.style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
               el.style.color = "#ffffff";
               el.style.borderColor="rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
              });   
    }
    function llamarNuevoestiloIcon(menu){
        
        try {
            var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
        if(document.getElementById(menu+"0")){document.getElementById(menu+"0").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"1")){document.getElementById(menu+"1").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"2")){document.getElementById(menu+"2").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"3")){document.getElementById(menu+"3").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"4")){document.getElementById(menu+"4").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"5")){document.getElementById(menu+"5").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"6").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"7").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"8").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"9").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"10").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    
        } catch (error) {
            //alert(error);
        }
        
    }
    function llamarNuevoestiloIconB(menu){
        
        try {
        if(document.getElementById(menu+"0")){document.getElementById(menu+"0").style.color ="#ffffff";}
        if(document.getElementById(menu+"1")){document.getElementById(menu+"1").style.color = "#ffffff";}
        if(document.getElementById(menu+"2")){document.getElementById(menu+"2").style.color = "#ffffff";}
        if(document.getElementById(menu+"3")){document.getElementById(menu+"3").style.color = "#ffffff";}
        if(document.getElementById(menu+"4")){document.getElementById(menu+"4").style.color = "#ffffff";}
        if(document.getElementById(menu+"5")){document.getElementById(menu+"5").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"6").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"7").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"8").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"9").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){document.getElementById(menu+"10").style.color = "#ffffff";}
    
        } catch (error) {
            //alert(error);
        }
        
    }
    function llamarNuevoestilo(menu){
        try {
            var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
        if(document.getElementById(menu+"0")){
            document.getElementById(menu+"0").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"0").style.color = "#ffffff";}
        if(document.getElementById(menu+"1")){
            document.getElementById(menu+"1").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"1").style.color = "#ffffff";}
        if(document.getElementById(menu+"2")){
            document.getElementById(menu+"2").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"2").style.color = "#ffffff";}
        if(document.getElementById(menu+"3")){
            document.getElementById(menu+"3").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"3").style.color = "#ffffff";}
        if(document.getElementById(menu+"4")){
            document.getElementById(menu+"4").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"4").style.color = "#ffffff";}
        if(document.getElementById(menu+"5")){
            document.getElementById(menu+"5").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"5").style.color = "#ffffff";}
        if(document.getElementById(menu+"6")){
            document.getElementById(menu+"6").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"6").style.color = "#ffffff";}
        if(document.getElementById(menu+"7")){
                document.getElementById(menu+"7").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                document.getElementById(menu+"7").style.color = "#ffffff";}
        if(document.getElementById(menu+"8")){
                    document.getElementById(menu+"8").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                    document.getElementById(menu+"8").style.color = "#ffffff";}
        if(document.getElementById(menu+"9")){
                        document.getElementById(menu+"9").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                        document.getElementById(menu+"9").style.color = "#ffffff";}
        } catch (error) {
            alert(error);
        }
    }
    function llamarNuevoestiloBorde(menu){
        try {
            var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
        if(document.getElementById(menu+"0")){
            document.getElementById(menu+"0").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"0").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
        if(document.getElementById(menu+"1")){
            document.getElementById(menu+"1").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"1").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
        if(document.getElementById(menu+"2")){
            document.getElementById(menu+"2").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"2").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
        if(document.getElementById(menu+"3")){
            document.getElementById(menu+"3").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"3").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
        if(document.getElementById(menu+"4")){
            document.getElementById(menu+"4").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"4").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
        if(document.getElementById(menu+"5")){
            document.getElementById(menu+"5").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"5").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        }
        if(document.getElementById(menu+"6")){
            document.getElementById(menu+"6").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
            document.getElementById(menu+"6").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        }
    
        } catch (error) {
            //alert(error);
        }
        
    }
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }
    //===========================================================================================================
    // END_CUSTOM_CODE_kendoUiMobileApp


