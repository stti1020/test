(function() {
    'use strict';

    angular
        .module('app')
        .directive('imageUpload', imageUpload);

    imageUpload.$inject = ['$window'];
    
    function imageUpload ($window) {

        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'app/directives/templates/imageUpload.html'
        };
        return directive;

        function link(scope, element, attrs) {

            var imageUploader = {
                imageFile: null,
                image: new Image(),
                scale: 1,
                click: false,
                baseX: 0,
                baseY: 0,
                lastPointX: 0,
                lastPointY: 0,
                windowHeight: 0,
                windowWidth: 0,
                cutoutWidth: 0,
                canvasCtx: document.getElementById("panel").getContext("2d"),

                /**
                 * Initialisierungsmethode, wird beim laden der Seite aufgerufen und startet die Listener.
                 * Gibt entsprechende Fehlermeldungen bei Verstoß der Dateigröße oder des Dateityps aus.
                 */
                init: function () {
                    document.getElementById("uploadCanvas").onclick = this.uploadCanvasAsImage.bind(this);
                    document.getElementById("scaleSlider").onmousemove = this.updateScale.bind(this);

                    document.getElementById("file").onchange = function (event) {
                        this.imageFile = event.target.files[0];
                        document.getElementById('scaleSlider').value = 1;
                        this.baseX = 0;
                        this.baseY = 0;
                        this.lastPointX = 0;
                        this.lastPointY = 0;
                        this.imageFile = event.target.files[0];
                        
                        if (this.imageFile === null) {
                            return swal("Keine Datei ausgewählt!", "", "error");
                        } else if (this.imageFile.type !== "image/jpeg" && this.imageFile.type !== "image/png" && this.imageFile.type !== "image/gif" && this.imageFile.type !== "image/bmp") {
                            this.imageFile = null;
                            return swal("Falscher Dateityp! Bilder muss einer der Dateitypen: jpeg, png, gif, bmp sein!", "", "error");
                        } else if (this.imageFile.size >= 4194304) {
                            return swal("Dateigröße muss kleiner 4mb sein!!", "", "error");
                        }
                        document.getElementById("canvasContainer").className = "";

                        var reader = new FileReader();
                        reader.onload = function (event) {
                            var img = new Image();
                            img.onload = function () {
                                this.drawImageOnCanvas(img);
                                this.canvasCtx.canvas.onmousedown = this.onMouseDown.bind(this);
                                this.canvasCtx.canvas.onmousemove = this.onMouseMove.bind(this);
                                this.canvasCtx.canvas.onmouseup = this.onMouseUp.bind(this);
                            }.bind(this);
                            img.src = event.target.result;
                        }.bind(this);
                        reader.readAsDataURL(this.imageFile);
                    }.bind(this);
                },

                

                /**
                 * Malt das hochgeladene Bild in das Canvas.
                 */
                drawImageOnCanvas: function (img) {
                    this.image = img;
                    this.canvasCtx.canvas.width = img.width;
                    this.canvasCtx.canvas.height = img.height;
                    this.canvasCtx.drawImage(img, 0, 0);
                    this.drawCutout();
                },

                /**
                 * Bei Zoom oder Verschieben des Ausschnitts zeichnet diese Methode das Bild neu.
                 */
                drawimage: function (x, y) {
                    var w = this.canvasCtx.canvas.width,
                        h = this.canvasCtx.canvas.height;
                    this.canvasCtx.clearRect(0, 0, w, h);
                    this.baseX = this.baseX + (x - this.lastPointX);
                    this.baseY = this.baseY + (y - this.lastPointY);
                    this.lastPointX = x;
                    this.lastPointY = y;
                    this.canvasCtx.drawImage(this.image, this.baseX, this.baseY, Math.floor(this.image.width * this.scale), Math.floor(this.image.height * this.scale));
                    this.drawCutout();
                },


                /**
                * Methode die den grauen Rand in das Canvas einzeichnet.
                * Die Größe des Ausschnitts beträgt immer 8% der Bildweite.
                */
                drawCutout: function () {
                    this.cutoutWidth = 0.08 * this.canvasCtx.canvas.width;
                    this.windowWidth = this.canvasCtx.canvas.width - 2 * this.cutoutWidth;
                    this.windowHeight = this.canvasCtx.canvas.height - 2 * this.cutoutWidth;

                    this.canvasCtx.fillStyle = 'rgba(128, 128, 128, 0.7)';
                    this.canvasCtx.beginPath();
                    this.canvasCtx.rect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
                    this.canvasCtx.moveTo(this.cutoutWidth, this.cutoutWidth);
                    this.canvasCtx.lineTo(this.cutoutWidth, this.windowHeight + this.cutoutWidth);
                    this.canvasCtx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth + this.windowHeight);
                    this.canvasCtx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth);
                    this.canvasCtx.closePath();
                    this.canvasCtx.fill();
                },

                /**
                * Bei Klick auf das Bild im Canvas merkt sich diese Methode die letzten Koordinaten.
                */
                onMouseDown: function (e) {
                    e.preventDefault();
                    var loc = this.windowToCanvas(e.clientX, e.clientY);
                    this.click = true;
                    this.lastPointX = loc.x;
                    this.lastPointY = loc.y;
                },

                /**
                * Methode die nach Verschiebung des Bildes die neuen Koordinaten berechnet und die drawImage Methode aufruft.
                */
                onMouseMove: function (e) {
                    e.preventDefault();
                    if (this.click) {
                        var loc = this.windowToCanvas(e.clientX, e.clientY);
                        this.drawimage(loc.x, loc.y);
                    }
                },

                /**
                * Setzt die lokale Variable click wieder auf den boolschen Wert false.
                */
                onMouseUp: function (e) {
                    e.preventDefault();
                    this.click = false;
                },

                /**
                * Umrechnung der HTML Koordinaten in Canvas Koordinaten
                */
                windowToCanvas: function (x, y) {
                    var canvas = this.canvasCtx.canvas;
                    var bbox = canvas.getBoundingClientRect();
                    return {
                        x: x - bbox.left * (canvas.width / bbox.width),
                        y: y - bbox.top * (canvas.height / bbox.height)
                    };
                },

                /**
                * Bei Veränderung des Zomm Levels wird diese Methode aufgerufen, diese lässt das Bild mit dem entsprechenden Zoom Level neu zeichnen.
                */
                updateScale: function (e) {
                    console.log('updateScale');
                    console.log(e);
                    this.scale = e.target.value;
                    this.drawimage(this.lastPointX, this.lastPointY);
                },

                /**
                 *  Malt das endgültige Bild nochmals, konvertiert das Base64 kodierte Bild in ein Binary File.
                 * Ruft je nach angegeben Mode die entsprechenden Methoden der jeweiligen Controller auf
                 */
                canvasToBlob: function (canvas) {

                    canvas.width = this.windowWidth;
                    canvas.height = this.windowHeight;
                    this.canvasCtx.drawImage(this.image, this.baseX - this.cutoutWidth, this.baseY - this.cutoutWidth, Math.floor(this.image.width * this.scale), Math.floor(this.image.height * this.scale));
                    var picture = canvas.toDataURL();
                    var numberOfPictureInBase64Beginn = picture.search(",");

                    //Hier kommt nur der Base64 String raus
                    picture = picture.substring(numberOfPictureInBase64Beginn + 1, picture.length);

                    if (attrs.mode === 'profile') {
                        scope.profileCtrl.saveProfilePicture(picture);
                    } else if (attrs.mode === 'updateVehicle') {
                        scope.updateVehicleCtrl.createPicture(picture);
                    } else {
                        scope.createVehicleCtrl.createPicture(picture);
                    }
                },

                /**
                  * Add extra parmeter, in case of Canvas upload.
                  */
                uploadCanvasAsImage: function () {
                    this.canvasToBlob(this.canvasCtx.canvas);
                },
            }

            /**
             * Initialisierung der Direktiven Funktionalität
             */
            imageUploader.init();

            /**
             * Setzt das hochgeladene Bild zurück und lässt Imagecutting Feld und Zoomleiste wieder zurück
             */
            scope.discardChanges = function () {
                document.getElementById("file").value = null;
                document.getElementById("canvasContainer").className = "hidden";
            };
        }
    }

})();