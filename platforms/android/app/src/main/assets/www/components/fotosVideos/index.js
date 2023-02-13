'use strict';

app.fotoVideo = kendo.observable({
    init: function() {},
    onShow: function() { 
        try {
            
        
        var datos = JSON.parse(localStorage.getItem("fotosviedeosALI"));
        document.getElementById("numOT_2").value = datos.chasis;
        document.getElementById("playVideo").innerHTML = "";
        verArchivosOT_2(document.getElementById('numOT_2').value);
        if (localStorage.getItem("ls_itemVI") == undefined) {
            verArchivosOT_2(document.getElementById('numOT_2').value);
            localStorage.setItem("ls_itemVI", "VI");
        }
        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
            "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
            "<p><center>" +
            "<a id='btnvideoChofer0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
            "<a id='btnvideoChofer1' class='w3-btn primary' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
           // "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
            "</center></p>";
        }
        else {
            document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
            "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
            "<p><center>" +
            "<a id='btnvideoChofer0' class='w3-btn' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i></a>" +
            "<a id='btnvideoChofer1' class='w3-btn' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i></a>" +
            "<a id='btnvideoChofer2' class='w3-btn' aria-label='Video' onclick='captureAudio();'><i id='icnvideoChofer2' class='fa fa-microphone' aria-hidden='true'></i></a>" +
            "</center></p>";
        }
        llamarColorTexto(".w3-text-red");
        llamarNuevoestilo("btnvideoChofer");
        llamarNuevoestiloIconB("icnvideoChofer");
    } catch (error) {
       alert(error);     
    }
     },
    afterShow: function() {}
});
app.localization.registerView('fotoVideo');

function uploadVideo(mediaFile) {

    try {

        document.getElementById("divOTVideosCont").innerHTML = "";
        document.getElementById("videosOT").innerHTML = "";

        var mediaPlayer = "";

        var ft = new FileTransfer();
        var path = mediaFile.fullPath;
        var name = mediaFile.name;

        var videoURI = path;

        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //Enero is 0

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

        var arrExtension = videoURI.split(".");

        var camposOT = parametrosOTCompleto();
        var pathServidorOT = camposOT["descripcion-2"] + "\\" + document.getElementById("numOT_2").value + "_" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        localStorage.getItem("ls_usagencia").toLocaleString();

//alert(pathServidorOT);
        var fileVideo = document.getElementById('numOT_2').value + "_Recepcion_" + JSON.parse(localStorage.getItem("fotosviedeosALI")).punto_venta + "_" +
        yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[1];

        fileVideo = fileVideo + "|" + fileVideo + "|" + pathServidorOT;

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;
        options.mimeType = "video/mp4";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        // Variable del archivo
        var ft = new FileTransfer();
        try {
            ft.onprogress = function (progressEvent) {
                if (progressEvent.llengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    document.getElementById("videosOT").innerHTML = "";
                    document.getElementById("statusDom").innerHTML = "<br/><center><i class='fa fa-cog fa-spin fa-lg'></i><br/><b>" + perc + "% guardando...</b></center>";
    
                } else {
                    if (document.getElementById("statusDom").innerHTML == "") {
                        document.getElementById("statusDom").innerHTML = "guardando";
                    } else {
                        document.getElementById("statusDom").innerHTML += ".";
                    }
                }
            };
        } catch (error) {
            alert(error);
        }
        // Presenta el porcentaje de subida de la imagen
        

        // Ejecuta el proceso de subida de la imagen       
        // http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo

        //  var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        //var UrlSube = "http://200.63.221.180:8089/concesionario" + "/Services/TL/Taller.svc/guardaArchivoEntrega";
//alert(UrlSube);

        ft.upload(videoURI, UrlSube,
            function (result) {


                document.getElementById("statusDom").innerHTML = "";

                //// Eliminar video
                //window.resolveLocalFileSystemURL(path.replace("/" + name, ""),
                //    function (dir) {
                //        dir.getFile(name, { create: false }, function (fileEntry) {
                //            fileEntry.remove(function () {


                //            }, function (error) {
                //              //  alert("Error removing file: " + error.code);
                //            }, function () {
                //               // alert("The file doesn't exist");
                //            });
                //        });
                //    });

                // verArchivosOT(document.getElementById('numOT_2').value);
                verArchivosOT_2(document.getElementById('numOT_2').value);


                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                    document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a id='btnvideoChofer0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
                    "<a id='btnvideoChofer1' class='w3-btn primary' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                   // "<a class='w3-btn primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
                    "</center></p>";
                }
                else {
                    document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a id='btnvideoChofer0' class='w3-btn' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i></a>" +
                    "<a id='btnvideoChofer1' class='w3-btn' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i></a>" +
                    "<a id='btnvideoChofer2' class='w3-btn' aria-label='Video' onclick='captureAudio();'><i id='icnvideoChofer2' class='fa fa-microphone' aria-hidden='true'></i></a>" +
                    "</center></p>";
                }
                llamarColorTexto(".we-text-red");
                llamarNuevoestilo("btnvideoChofer");
                llamarNuevoestiloIconB("icnvideoChofer");
                kendo.ui.progress($("#fotoVideoScreen"), false);


            },
        function (error) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
        },
        options);
    }
    catch (e) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
    }
}

function verArchivosOT(numOT) {
    
        kendo.ui.progress($("#fotoVideoScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************
    
            try {
    
                if (localStorage.getItem("ls_mailFileOT") != undefined) {
                    localStorage.removeItem("ls_mailFileOT");
                }
    
                document.getElementById("divOTVideosCont").innerHTML = "";
    
                var jsonData = JSON.stringify({ 'strOT': numOT });
                var ArchivoOT = "";
                var arrImgOT = [];
                var arrVidOT = [];
                var vidPorcentaje = 80;
                var vidAlto = (screen.width * 50) / 100;
                var vidAncho = (screen.width * 80) / 100;
    
                $.ajax({
                    type: "POST",
                    url: "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/verArchivo",
                    data: jsonData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (xhr, status, error) {
                        kendo.ui.progress($("#fotoVideoScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", xhr.responseText);
                        return;
    
                        //alert the error if needed
                        // alert("Sorry there is an error: " + xhr.responseText);
                    },
                    success: function (responseData) {
    
                        ArchivoOT = responseData.d;
    
                        if (ArchivoOT.includes("*") == true) {
                            var arrfileGral = ArchivoOT.split("*");
                            for (var c1 = 0; c1 < arrfileGral.length; c1++) {
                                if (arrfileGral[c1].includes(".") == true) {
                                    arrVidOT.push("http://ecuainfo78-002-site3.btempurl.com/repositorio/" + numOT + "/" + arrfileGral[c1]);
                                }
                            }
    
                            var mailFileOT = "<br />Archivos registrados:<br />";
                            var pathFiles;
                            var htmlVideo = "";
                            if (arrVidOT.length > 0) {
                                for (var c2 = 0; c2 < arrVidOT.length; c2++) {
    
                                    pathFiles = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + document.getElementById('numOT_2').value + "/" + arrfileGral[c2];
    
                                    if (c2 == 0) {
                                        htmlVideo += "<br/><p><table><tr><td>" +
                                         "<select id='select_file' onchange='playVideoOT(this.value);' class='w3-input w3-border textos'>" +
                                         "<option value='0'>- Seleccione el Archivo -</option>";
                                    }
                                    
                                    //if (arrfileGral[c2].includes(".mp4") && arrfileGral[c2].includes("_")) {
                                    //    var arr1 = arrfileGral[c2].split("_");
                                    //    htmlVideo += "<option value='" + pathFiles + "'>" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + " </option>";
    
                                    //    mailFileOT += "<a href='" + pathFiles + "'>" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + "</a><br />";
                                    //}
                                    //else {
                                    //    htmlVideo += "<option value='" + pathFiles + "'>" + arrfileGral[c2] + " </option>";
    
                                    //    mailFileOT += "<a href='" + pathFiles + "'>" + arrfileGral[c2] + "</a><br />";
                                    //}
    
                                    var arr1 = arrfileGral[c2].split("_");
    
                                    htmlVideo += "<option value='" + pathFiles + "'>" + arr1[0] + "_" + arr1[1] + "_" + arr1[2] + "_" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + "</option>";
                                    mailFileOT += "<a href='" + pathFiles + "'>" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + "</a><br />";
                                   if (c2 == arrVidOT.length - 1) {
                                        htmlVideo += "</select> </td></tr></table></p><br />";
                                    }
                                }
                            }
    
                            document.getElementById("divOTVideosCont").innerHTML = htmlVideo;
    
                            // Storage archivos OT
                            localStorage.setItem("ls_mailFileOT", mailFileOT);
    
    
                        }
                        else {
                            localStorage.setItem("ls_mailFileOT", "<br/><p><b>No tiene archivos registrados</b></p><br />");
    
                            document.getElementById("divOTVideosCont").innerHTML = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                        }
    
                        kendo.ui.progress($("#fotoVideoScreen"), false);
                    }
                });
            }
            catch (eFile) {
                kendo.ui.progress($("#fotoVideoScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eFile);
            }
    
            //  kendo.ui.progress($("#lector_barrasScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);
    
}

function verArchivosOT_2(numOT) {

    kendo.ui.progress($("#fotoVideoScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

        try {
            if (localStorage.getItem("ls_mailFileOT") != undefined) {
                localStorage.removeItem("ls_mailFileOT");
            }

            document.getElementById("divOTVideosCont").innerHTML = "";

            var pathVer_ot = "";
            if (parametrosOTCompleto() == "error") {
                kendo.ui.progress($("#fotoVideoScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen Parametros ingresados");
                return;
            }
            else {

                var camposOT = parametrosOTCompleto();
                pathVer_ot = camposOT["campo01"];


                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> pathVer_ot</center>", pathVer_ot);


                var pathVinEV = camposOT["descripcion-2"] + "\\" + numOT + "_" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
                localStorage.getItem("ls_usagencia").toLocaleString();
                var jsonData = JSON.stringify({ 'pathVinEV': pathVinEV });
                var ArchivoOT = "";
                var arrImgOT = [];
                var arrVidOT = [];
                var vidPorcentaje = 80;
                var vidAlto = (screen.width * 50) / 100;
                var vidAncho = (screen.width * 80) / 100;

                //   var UrlVerArc = "http://localhost:4044/Services/TL/Taller.svc/verArchivoEntrega";

                var UrlVerArc = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/verArchivoEntrega";

                $.ajax({
                    type: "POST",
                    url: UrlVerArc,
                    data: jsonData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (xhr, status, error) {
                        kendo.ui.progress($("#fotoVideoScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", xhr.responseText);
                        return;
                    },
                    success: function (responseData) {

                        ArchivoOT = inspeccionar(responseData).replace("string verArchivoEntregaResult : ", "");
                        var htmlVideoEV = "";
                        var mailFileOT = "<br />Archivos registrados:<br />";

                        if (ArchivoOT.includes("*") == true) {
                            var arrfileGral = ArchivoOT.split("*");

                            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> arrfileGral</center>", inspeccionar(arrfileGral));
                            if (arrfileGral.length > 0) {
                                for (var c1 = 0; c1 < arrfileGral.length; c1++) {

                                    if (arrfileGral[c1].includes(".") == true) {

                                        //   var pathFilesEV = localStorage.getItem("ls_url2").toLocaleString() + "/Services/Repositorio/" + numOT + "/" + arrfileGral[c1];
                                        /* var pathFilesEV = "http://200.63.221.180:8089/concesionario/entrega_vehiculos" + "/" + numOT + "_" +
                                        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
                                        localStorage.getItem("ls_usagencia").toLocaleString() + "/" + arrfileGral[c1]; */
                                        var pathFilesEV = pathVer_ot + "/" + numOT + "_" +
                                        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
                                        localStorage.getItem("ls_usagencia").toLocaleString() + "/" + arrfileGral[c1];
                                        arrVidOT.push(pathFilesEV);

                                        if (c1 == 0) {
                                            htmlVideoEV += "<br/><table><tr><td><p>" +
                                             "<select id='select_file' onchange='playVideoOT(this.value);' class='w3-input w3-border textos'>" +
                                             "<option value='0'>- Seleccione el Archivo -</option>";
                                        }

                                        //htmlVideoEV += "<option value='" + pathFilesEV + "'>" + arrfileGral[c1] + "</option>";

                                        // RRP: 2018-08-03 Presenta todos los archivos a excepcion "PDF"
                                        //if (arrfileGral[c1].includes(".pdf") != true || arrfileGral[c1].includes("_firm") != true || arrfileGral[c1].includes(".txt") != true) {
                                        //    htmlVideoEV += "<option value='" + pathFilesEV + "'>" + arrfileGral[c1] + "</option>";
                                        //}



                                        if (arrfileGral[c1].includes(".pdf") == false && arrfileGral[c1].includes("_firm") == false && arrfileGral[c1].includes(".txt") == false) {

                                            htmlVideoEV += "<option value='" + pathFilesEV + "'>" + arrfileGral[c1] + "</option>";
                                        }

                                        mailFileOT += "<a href='" + pathFilesEV + "'>" + arrfileGral[c1] + "</a><br />";
                                        if (c1 == arrfileGral.length - 1) {
                                            htmlVideoEV += "</select></p></td></tr></table><br />";
                                        }
                                    }
                                }
                            }
                            else {
                                htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                            }

                            // Storage archivos OT
                            localStorage.setItem("ls_mailFileOT", mailFileOT);
                        }
                        else {
                            htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                        }
                        document.getElementById("divOTVideosCont").innerHTML = htmlVideoEV;

                        kendo.ui.progress($("#fotoVideoScreen"), false);
                    }
                });
            }
        }
        catch (eFile) {
            kendo.ui.progress($("#fotoVideoScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eFile);
            return;
        }

        //  kendo.ui.progress($("#lector_barrasScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}

function playVideoOT(idVideo) {

    //  http://186.71.68.154:8089/test/Services/Repositorio/

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlVerArc</center>", idVideo);

    if (idVideo == "0") {
        document.getElementById("playVideo").innerHTML = "";
    }
    else {
        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        //  var playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + document.getElementById('numOT_2').value + "/" + idVideo;
        var playIdVideo = idVideo;

        if (idVideo.includes("mp4") || idVideo.includes("MP4")) {
            //var arrVd = idVideo.split("_");
            //playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + arrVd[3] + "/" + idVideo;
            document.getElementById("playVideo").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                "' controls Autoplay=autoplay><source src='" + playIdVideo + "' type='video/mp4'></video></p></center><br />";
        }
        else if (idVideo.includes("jpg") || idVideo.includes("JPG")) {
            document.getElementById("playVideo").innerHTML = "<center><p><br /><img src='" + playIdVideo + "' width='" + vidAncho + "' /></p></center><br />";
        }
        else {
            document.getElementById("playVideo").innerHTML = "<center><p><br /><audio controls autoplay><source src='" + playIdVideo + "' type='audio/mpeg'>La aplicacion no soporta este formato</audio></p></center><br />";
        }
    }
}

function uploadVideo_2(mediaFile) {
    try {

        //document.getElementById("listaVideo_ev").innerHTML = "";
        //document.getElementById("playVideo_ev").innerHTML = "";

        var ft = new FileTransfer();
        var path = mediaFile.fullPath;
        var name = mediaFile.name;

        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //Enero is 0

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second:"numeric" });
        hhmm = hhmm.replace(":","");
        var arrExtension = mediaFile.split(".");
        try {
            var camposOT = parametrosOTCompleto();
        var pathServidor = camposOT["descripcion-2"] + "\\" + document.getElementById("numOT_2").value + "_" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        localStorage.getItem("ls_usagencia").toLocaleString();
        var nombreArchivoEV = document.getElementById("numOT_2").value + "_Recepcion_" + JSON.parse(localStorage.getItem("fotosviedeosALI")).punto_venta  
                            + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];
    var fileVideo = mediaFile + "|" + nombreArchivoEV + "|" + pathServidor;
        } catch (error) {
           alert(error);
        }
        /* C:\inetpub\wwwroot\biss.web\concesionario\entrega_vehiculos\KNACB81CGK5234911_UIO_UIO
        AEKIA_UIO_UIO_KNACB81CGK5234911_20190729_093445 */
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> fileVideo</center>", fileVideo);
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        //   var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        // MAYORISTA:  var UrlSube = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        
      //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlSube</center>", UrlSube);


        kendo.ui.progress($("#fotoVideoScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            ft.upload(mediaFile, UrlSube,
                       function (result) {

                           verArchivosOT_2(document.getElementById('numOT_2').value);

                          // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> result</center>", result);

                           //  verArchivosEV(document.getElementById("ev_vin").value);

                           //var vidAlto = (screen.width * 50) / 100;
                           //var vidAncho = (screen.width * 80) / 100;

                           //if (mediaFile.includes("mp4")) {
                           //    document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                           //        "' controls Autoplay=autoplay><source src='" + mediaFile + "' type='video/mp4'></video></p></center><br />";
                           //}
                           //else if (mediaFile.includes("jpg")) {
                           //    document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><img src='" + mediaFile + "' width='" + vidAncho + "' /></p></center><br />";
                           //}

                           //document.getElementById('fileOT_ev').value = "OK";

                           if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                               document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                               "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                               "<p><center>" +
                               "<a id='btnvideoChofer0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
                               "<a id='btnvideoChofer1' class='w3-btn primary' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                              // "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
                               "</center></p>";
                           }
                           else {
                               document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                               "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                               "<p><center>" +
                               "<a id='btnvideoChofer0' class='w3-btn' aria-label='Video' onclick='captureVideo();'><i id='icnvideoChofer0' class='fa fa-video-camera' aria-hidden='true'></i></a>" +
                               "<a id='btnvideoChofer1' class='w3-btn' aria-label='Video' onclick='captureImagen();'><i id='icnvideoChofer1' class='fa fa-camera' aria-hidden='true'></i></a>" +
                               "<a id='btnvideoChofer2' class='w3-btn' aria-label='Video' onclick='captureAudio();'><i id='icnvideoChofer2' class='fa fa-microphone' aria-hidden='true'></i></a>" +
                               "</center></p>";
                           }
                           llamarColorTexto(".w3-text-red");
                           llamarNuevoestilo("btnvideoChofer");
                           llamarNuevoestiloIconB("icnvideoChofer");
                           kendo.ui.progress($("#fotoVideoScreen"), false);

                       },
                   function (error) {
                       //   document.getElementById('fileOT_ev').value = "";
                       kendo.ui.progress($("#fotoVideoScreen"), false);
                       window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
                   },
           options);

            kendo.ui.progress($("#fotoVideoScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (e) {
        //  document.getElementById('fileOT_ev').value = "";
        kendo.ui.progress($("#fotoVideoScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return;
    }
}

function successvideo(entry) {
    // alert("Removal succeeded");
}

function failvideo(error) {
    // alert("Error removing file: " + error.code);
}

function onSuccess(msg) {
    window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ENVIADO</center>", "La Orden de Trabajo <b>" + document.getElementById("numOT_2").value + "</b></br>fue enviada correctamente");

}

function onError(msg) {
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el envio<br />" + msg);
}

function parametrosOTCompleto() {
    try {

        var accResp = "";

        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_CHOFERES;;PATH";
        //var Url = "http://200.63.221.180:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS";
         // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> Url</center>", Url);
        var respPar;

        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.ParametroEmpGetResult).tmpParamEmp;
                    respPar = accResp[0];
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(accResp[0]));
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

function captureVideo() {

    //  navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1 });

    navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1, quality: 0, duration: 20 });
}

function captureError(error) {
    kendo.ui.progress($("#fotoVideoScreen"), false);
}

function captureSuccess(mediaFiles) {
    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
   .done(function () {
       var i, len;
       for (i = 0, len = mediaFiles.length; i < len; i += 1) {
           uploadVideo(mediaFiles[i]);
       }
   })
   .fail(function () {
       kendo.ui.progress($("#fotoVideoScreen"), false);
   });
   llamarColorBotonGeneral(".k-primary");
}

function captureSuccessImg(mediaFiles) {

    //     uploadVideo_2(mediaFiles);

    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
       .done(function () {
           uploadVideo_2(mediaFiles);
       })
       .fail(function () {
           kendo.ui.progress($("#fotoVideoScreen"), false);
       });
       llamarColorBotonGeneral(".k-primary");
}

function captureSuccessImg2(mediaFiles) {
    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
       .done(function () {
           uploadVideo_3(mediaFiles);
       })
       .fail(function () {
           kendo.ui.progress($("#fotoVideoScreen"), false);
       });
       llamarColorBotonGeneral(".k-primary");
}

function captureImagen2() {
    ///*captura imagen*/
    navigator.camera.getPicture(captureSuccessImg2, captureError, {
        quality: 100,
        targetWidth: 800,
        targetHeight: 800,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
    });
}

function captureImagen() {
    ///*captura imagen*/
    navigator.camera.getPicture(captureSuccessImg, captureError, {
        quality: 100,
        targetWidth: 800,
        targetHeight: 800,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
    });
}

function captureAudio() {
    ////  navigator.device.capture.captureAudio(captureSuccess, captureError, { limit: 1 });
    try {
        navigator.device.capture.captureAudio(captureSuccess, function (message) {        
        }, { limit: 1 });
    }
    catch (errorAud) {
        kendo.ui.progress($("#fotoVideoScreen"), false);

        //  alert(errorAud);
    }

}