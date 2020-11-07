(function(win, doc) {

  //***** VARIABLES GLOBALES*/
  //coordenadasUbicacion y puntoUbicacion seran las variables utilizadas para indicar 
  // la ubicacion(en punto y coordenada) seteada por el usuario
  var modoVisualizacion=1 // 1-Modo establecimientos /2- modo radios escolares
  var coordenadasUbicacion=null
  var puntoUbicacion=null
  var registranteId = null
  var tipoRadio = null

  //***** FIN VARIABLES GLOBALES*/
    
  //***** FUNCIONALIDAD BOTONES*/
  $('#confirmacionUbicacion').click(function() {
    confirmarUbicacion()
    
  });

  $( "#selectNiveles" ).change(function(event) {    
    filtrarMapaEstablecimientos(event.target.value)
  });

  //***** FIN FUNCIONALIDAD BOTONES*/


  //***** MAPA*/

  var olview = new ol.View({
  
    projection: 'EPSG:3857',
    center: ol.proj.transform([-69.652898,-38.684755], 'EPSG:4326','EPSG:3857'),
  
   // extent: ol.proj.transformExtent([ -68.43040,-38.84773,-67.78496,-39.03732], 'EPSG:4326','EPSG:3857'),
    zoom: 7,
    minZoom: 2,
    maxZoom: 20,
  }),
  

  
  baseLayer = new ol.layer.Tile({
    type: "base",
    
    preload: Infinity,
    title: 'Google Maps',
    visible: true,
    crossOrigin: "Anonymous",
    wrapX: false,
    source: new ol.source.XYZ({
      url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      attributions: 'Datos del mapa &copy; 2020 <img src="https://lh3.googleusercontent.com/PoTrayfCHVcgWMLP9wryR37V2VUjVX8AQZEnGChDGu5MMHQLH2w_Fs4MlT4SsEF-Hq4Qca-J7yIpr3Q-u1mkOtnn1VoeKV7IL2ae=h128" width=10px > <a href="http://www.google.com/">Google Satellite</a> <a href="https://www.google.com/intl/es-419_ar/help/terms_maps">Terminos de Uso</a>',
      crossOrigin: "Anonymous",
    }),
  }),
  map = new ol.Map({
    target: doc.getElementById('map'),
    view: olview,
    layers: [baseLayer /**, wmsLayer */],
  }),
  popup = new ol.Overlay.Popup();

//Instantiate with some options and add the Control
/* var geocoder = new Geocoder('nominatim', {
  provider: 'bing',
  key:'AuB_TgCn4vLZq_rFH8btGAYIZiigOwKplCqBqSuG7Shjew1oUPzyeoENK_oEsaKf',
  targetType: 'text-input',    
  lang: 'es',
  placeholder: 'Calle, Altura y Localidad a Buscar ...',
  sufix: 'Neuquen, Confluencia',
  limit: 15,
  keepOpen: false
  
}); */

//map.addControl(geocoder);
map.addOverlay(popup);




labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 1)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255, 0, 0, 1)',
      width: 3
    })
  })
});

countryStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.2)'
  }),
  stroke: new ol.style.Stroke({
    color : 'rgba(255,0,0,1.0)',
    width : 4,
    lineDash: [4,8],
    lineDashOffset: 6

  })
});

var style = [countryStyle, labelStyle];

  
  
function cargarCapaRadios(){

 
  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({    
      url:'http://geoeducacion.neuquen.gov.ar/proxy/http://geoeducacion.neuquen.gov.ar/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&' +
      'typename=establecimientos_edu:ra_nqn_tec&outputFormat=application/json&srsname=EPSG:3857&',
      serverType: 'geoserver',
      crossOrigin: 'anonymous', 
      // If you want to use a static file, change the previous row to
    //  url: 'data/radios_tecnica.json',
      format: new ol.format.GeoJSON()
    }),
    style: function(feature) {
  
      var geometry = feature.getGeometry();
      if (geometry.getType() == 'MultiPolygon') {
        // Only render label for the widest polygon of a multipolygon
        var polygons = geometry.getPolygons();
        var widest = 0;
        for (var i = 0, ii = polygons.length; i < ii; ++i) {
          var polygon = polygons[i];
          var width = ol.extent.getWidth(polygon.getExtent());
          if (width > widest) {
            widest = width;
            geometry = polygon;
          }
        }
      }
      
      // Check if default label position fits in the view and move it inside if necessary
      geometry = geometry.getInteriorPoint();
      var size = map.getSize();
      var extent = map.getView().calculateExtent([size[0]-12,size[1]-12]);
      var textAlign = 'center';
      var coordinates = geometry.getCoordinates();
      if (!geometry.intersectsExtent(extent)) {
        geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
        // Align text if at either side
        var x = geometry.getCoordinates()[0];
        if (x > coordinates[0]) {
          textAlign = 'left';
        }
        if (x < coordinates[0]) {
          textAlign = 'right';
        }
      }
  
      labelStyle.setGeometry(geometry);
      labelStyle.getText().setText(feature.get('ESTABLECIM').replace(' ','\n'));
      labelStyle.getText().setTextAlign(textAlign);
      return style;
    },
    declutter: true,
    renderBuffer: 1  // If left at default value labels will appear when countries not visible
  });
  
  map.addLayer(vectorLayer); 
}





map.on('singleclick', function (evt) {  

  if(modoVisualizacion==2){
    let coordenadas = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
    marcarPunto(evt.coordinate,coordenadas)   
  }
  else{
    let feature = getFeature(evt.pixel)
   
    if (feature) {
      var content = `<p>${feature.values_.NOMBRE} </p><p>${feature.values_.MOD_OFERTA}</p>`;
      popup.show(evt.coordinate, content);
    }
  }
   
});

//Listen when an address is chosen
/* geocoder.on('addresschosen', function(evt) {  
  console.log(evt)
  window.setTimeout(function() {
    
    popup.show(evt.coordinate, evt.address.formatted);
    let feature = getFeature(map.getPixelFromCoordinate(evt.coordinate))
     if (feature) $('#mi_escuela').html(`${feature.get('ESTABLECIM')}`);

    $('#mi_direccion').html(`${evt.address.details.name}`);
    map.getView().setZoom(20);
  }, 2000);
}); */

function getFeature(pixel){
  var feature = map.forEachFeatureAtPixel(pixel,
    function(feature, layer) {            
        return feature;      
    });

    return feature
}

 //***** FIN MAPA*/

 //***** FUNCIONES DE CONTROL DE LA APP */

 // funcion para obtener los parametros enviados por url
var getUrlParameter = function getUrlParameter(sParam) {
  const url = window.location;
  const urlObject = new URL(url);
  const param = urlObject.searchParams.get(sParam)
  return param 
};

/* Seteo de ubicacion en mapa segun direccion provista por el usuario*/
function marcarDireccionInicial(){
  //1- obtenemos los datos enviados en la url
  var localidadReferencia = getUrlParameter('localidad');
  var direccionReferencia = getUrlParameter('direccion');
   tipoRadio = getUrlParameter('tipoRadio');  // D -> 'Domicilio' -- T -> 'Trabajo'
  registranteId = getUrlParameter('registranteId');

  if (direccionReferencia===null){
    $('#mi_direccion').html(`Información no suministrada`);
    return
  }

  if(tipoRadio=='D'){
    $('#tipoDireccion').html('de domicilio');
  }else{
    $('#tipoDireccion').html('laboral');
    $('#tipoDireccionTitulo').html('laboral');
  }
  
  
  $('#mi_direccion').html(`${direccionReferencia}, ${localidadReferencia}`);

  //2. utilizamos georeverse para determinar la latitud y longitud de la localizacion dada
  const urlQuery = new URL("https://dev.virtualearth.net/REST/v1/Locations");
  urlQuery.searchParams.append("countryRegion", "Argentina");
  urlQuery.searchParams.append("adminDistrict", "Neuquén");
  urlQuery.searchParams.append("locality", localidadReferencia);
  urlQuery.searchParams.append("addressLine", direccionReferencia);
  urlQuery.searchParams.append("Key", "AuB_TgCn4vLZq_rFH8btGAYIZiigOwKplCqBqSuG7Shjew1oUPzyeoENK_oEsaKf");
  urlQuery.searchParams.append("includeNeighborhood", 0);
  urlQuery.searchParams.append("maxResults", 1);
  urlQuery.searchParams.append("o", "json");  

  //3. ejecutamos la consulta

  fetch(urlQuery.href).then(function(response) {
    return response.json();
  }).then(function(json) { 
    console.log(json)  
    if(json.statusCode==200 && json.resourceSets.length==1 ){
      localizacionRetorno = json.resourceSets[0]      
      if(localizacionRetorno.resources[0].address.adminDistrict=='Neuquén'){
        coordenadasRetorno = localizacionRetorno.resources[0].point.coordinates
        coordenadasLonLat=[coordenadasRetorno[1],coordenadasRetorno[0]]
        var point = ol.proj.fromLonLat(coordenadasLonLat)
        marcarPunto(point,coordenadasLonLat)
        map.getView().setCenter(ol.proj.transform(coordenadasLonLat, 'EPSG:4326','EPSG:3857'));
        map.getView().setZoom(15);   
        direccionNoReferenciada(false)
      }else{
        // la dirección indicada no ha podido ser referenciada
        direccionNoReferenciada(true)
      }
      
    }else{
      //mostrar leyenda de que la direccion no ha podido ser referenciada
      direccionNoReferenciada(true)
    }
  
  })
  
}

function direccionNoReferenciada(flag){
  if(flag){
    $('#informacionNoReferenciada').show()
  }else{    
    $('#informacionNoReferenciada').hide()
  }
 
}

function marcarPunto(point,coordenadas){
  coordenadasUbicacion = coordenadas 
  puntoUbicacion =   point
  popup.show( point, '<h1> <img src="assets/home.ico" style="height:25px"> <b> Mi domicilio</b></h1>');
}

function  confirmarUbicacion(){
  if(coordenadasUbicacion!==null){
    let feature = getFeature(map.getPixelFromCoordinate(puntoUbicacion))
    if (feature){     
      $('#json').html(JSON.stringify(generarInformacionRetorno(feature)));
    }
  }else{
    alert('Debe indicar/marcar en el mapa el punto donde se encuentra ubicado su domicilio')
  }
  
}

function generarInformacionRetorno(feature){ 
  let xmlhttp = new XMLHttpRequest();

  // generamos el objeto con los datos de radios y las coordenadas de la ubicación a enviar
  let informacionDireccionRadios = {"Coordenadas":{"Latitud":coordenadasUbicacion[0],"Longitud":coordenadasUbicacion[1],"Radios":[{"CUE":"CUEXXXX","Nombre":feature.get('ESTABLECIM'),"Nivel":"ST","TipoRadio":tipoRadio,},]}}

  let sr =`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cer="CertiRegu">
  <soapenv:Header/>
  <soapenv:Body>
     <cer:WSRadiosAlumnos.Execute>
        <cer:Registranteid>${registranteId}</cer:Registranteid>
        <cer:Varcharjson>${JSON.stringify(informacionDireccionRadios)}</cer:Varcharjson>
     </cer:WSRadiosAlumnos.Execute>
  </soapenv:Body>
</soapenv:Envelope>`; 

 // ocultamos el mensaje de operación exitosa y activamos el loading
$('#confirmarUbicacionMensaje').hide()    
$('#confirmarUbicacionMensajeError').hide()       
$('#confirmacionUbicacion').addClass( "is-loading" )

xmlhttp.open('POST', 'https://regular.neuquen.gob.ar/Inscripciones/servlet/com.certiregu.awsradiosalumnos'); 



xmlhttp.onreadystatechange = function () {  
  if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        // mostramos el mensaje de operación exitosa y desactivamos el loading
        $('#confirmarUbicacionMensaje').show()          
        $('#confirmacionUbicacion').removeClass( "is-loading" )
      }else{
        $('#confirmarUbicacionMensajeError').show()          
        $('#confirmacionUbicacion').removeClass( "is-loading" )
      }
  }
}
// Send the POST request
xmlhttp.setRequestHeader('Content-Type', 'text/xml');
xmlhttp.send(sr);
  
}


  
function iniciarApp(){
  // obtenemos el modo de visualizacion  
  if(getUrlParameter('modo')=='establecimientos'){
    modoVisualizacion=1
    iniciarModoEstablecimiento()

  }else{
    modoVisualizacion=2
    iniciarModoRadios()
    
  }
  
  marcarDireccionInicial()
}

 // Icono utilizado por los establecimientos
 var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
   anchor: [0.5, 1],
   src: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAyVBMVEUAAADnTDznTDvnTDvnTDvAOCrnTDznSzvnTDvAOCvnTDznTDznTDvnTDzAOCrnTDvnTDvnTDvnTDznTDvAOSrnTDznTDzTQjLSQjPnTDzpTDvnSzvAOCrnTDvAOSvAOCvnSzvnTDzAOCvnSzznTDznTDvnTDy/OCvnTDznTDvnTDznSzvmSzvAOCvnTDzAOCvnTDvmTDvAOCq+OCrpTDzkSzrbRjbWRDTMPi+8NinrTT3EOy3gSDjTQjPPQDLHPS/DOiu5NCjHPC5jSfbDAAAAMHRSTlMAKPgE4hr8CfPy4NzUt7SxlnpaVlRPIhYPLgLt6ebOysXAwLmej4iGgGtpYkpAPCBw95QiAAAB50lEQVQ4y42T13aDMAxAbVb2TrO6927lwQhktf//UZWVQ1sIJLnwwBEXWZYwy1Lh/buG5TXu+rzC9nByDQCCbrg+KdUmLUsgW08IqzUp9rgDf5Ds8CJv1KS3mNL3fbGlOdr1Kh1AtFgs15vke7kQGpDO7pYGtJgfbRSxiXxaf7AjgsFfy1/WPu0r73WpwGiu1Fn78bF9JpWKUBTQzYlNQIK5lDcuQ9wbKeeBiTWz3vgUv44TpS4njJhcKpXEuMzpOCN+VE2FmPA9jbxjSrOf6kdG7FvYmkBJ6aYRV0oVYIusfkZ8xeHpUMna+LeYmlShxkG+Zv8GyohLf6aRzzRj9t+YVgWaX1IO08hQyi9tapxmB3huxJUp8q/EVYzB89wQr0y/FwqrHLqoDWsoLsxQr1iWNxp1iCnlRbt9IdELwfDGcrSMKJbGxLx4LenTFsszFSYehwl6aCZhTNPnO6LdBYOGYBVFqwAfDF27+CQIvLUGrTU9lpyFBw9yeA+sCNsRkJ5WQjg2K+QFcrywEjoCBHVpe3VYGZyk9NQCLxXte/jHvc1K4XXKSNQ520PPtIhcr8f2MXPShNiavTyn4jM7wK0g75YdYgTE6KA465nN9GbsILwhoMHZETx53hM7Brtet9lRDAYFwR80rG+sfAnbpQAAAABJRU5ErkJggg==`
   }))
 });


function filtrarMapaEstablecimientos(nivel){
  map.getLayers().forEach(layer=>{    
     if(layer instanceof ol.layer.Vector){
      let source =layer.getSource()
      source.forEachFeature(feature=>{ 
        if( feature.values_.MOD_OFERTA.replace(/ /g,'').toLowerCase() == nivel || nivel =='todos'){         
          feature.setStyle(iconStyle)
        }else{
          feature.setStyle([])
        }
        
        }) 
    } 
  })

}

function iniciarModoEstablecimiento(){

  // ocultamos los elementos del front-end que no irian
  $('#tituloModoRadios').hide()
  
  $('#ubicacionModoRadios').hide()
  
 // cargamos el mapa
 
 
   var vector = new ol.layer.Vector({
     source: new ol.source.Vector({
       format: new ol.format.GeoJSON(),
       url: 'http://geoeducacion.neuquen.gov.ar/proxy/http://geoeducacion.neuquen.gov.ar/geoserver/establecimientos_edu/wfs?=&service=wfs&request=GetFeature&typeNames=establecimientos_edu:Estab_agosto&outputFormat=json&srsName=EPSG:3857'
     
     }),
     style:  iconStyle
 
   })

   map.addLayer(vector);

   //habilitamos el filtro de establecimientos
 
 
}

function iniciarModoRadios(){
  // ocultamos los elementos del front-end que no irian
  $('#tituloModoEstablecimientos').hide()
  $('#nivelesModoEstablecimientos').hide()
  // cargamos la capa de radios
  cargarCapaRadios()
}
 

iniciarApp()


})(window, document);

