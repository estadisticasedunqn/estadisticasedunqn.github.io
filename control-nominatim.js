(function(win, doc) {

  //coordenadasUbicacion y puntoUbicacion seran las variables utilizadas para indicar 
  // la ubicacion(en punto y coordenada) seteada por el usuario
  var coordenadasUbicacion=null
  var puntoUbicacion=null

    
  $('#confirmacionUbicacion').click(function() {
    confirmarUbicacion()
    
  });

  var olview = new ol.View({
  
    projection: 'EPSG:3857',
    center: ol.proj.transform([-68.10752,-38.94265], 'EPSG:4326','EPSG:3857'),
  
    extent: ol.proj.transformExtent([ -68.43040,-38.84773,-67.78496,-39.03732], 'EPSG:4326','EPSG:3857'),
    zoom: 12.5,
    minZoom: 2,
    maxZoom: 20,
  }),
  
  //Establecimientos Educativos    
   wmsSource = new ol.source.ImageWMS({
    url: 'http://geoeducacion.neuquen.gov.ar/proxy/http://geoeducacion.neuquen.gov.ar/geoserver/establecimientos_edu/wms',
    params: {'LAYERS': 'establecimientos_edu:com_sec_tec_y_agrop',
             'STYLES': 'establecimientos_edu:com_sec_tec_y_agrop_etiqueta'
             },
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  }),

   wmsLayer = new ol.layer.Image({
    source: wmsSource
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
    layers: [baseLayer, wmsLayer],
  }),
  popup = new ol.Overlay.Popup();

//Instantiate with some options and add the Control
var geocoder = new Geocoder('nominatim', {
  provider: 'bing',
  key:'AuB_TgCn4vLZq_rFH8btGAYIZiigOwKplCqBqSuG7Shjew1oUPzyeoENK_oEsaKf',
  targetType: 'text-input',    
  lang: 'es',
  placeholder: 'Calle, Altura y Localidad a Buscar ...',
  sufix: 'Neuquen, Confluencia',
  limit: 15,
  keepOpen: false
  
});

//map.addControl(geocoder);
map.addOverlay(popup);



/***** Codigo para obtener la localizacion por gps******/
 /* Obtenemos la localizacion actual en caso de existir */
 /* if (navigator.geolocation) {
  // console.log("El navegador si acepta geolocalización")
   obtener_posicion_actual();
 }
 else {
   // console.log("El navegador no acepta geolocalización")
 } */

 /* function obtener_posicion_actual() {
  
   var options = {
     enableHighAccuracy: true,
     timeout: 5000,
     maximumAge: 0
   };
    navigator.geolocation.getCurrentPosition(procesar_posicion, procesar_error, options);

 }


 function procesar_posicion(posicion) {
   var latitud = posicion.coords.latitude;
   var longitud = posicion.coords.longitude;
   var precision = posicion.coords.accuracy;
   
   // console.log("Latitud: " + latitud)
   // console.log("Longitud: " + longitud)
   // console.log("Precisión: " + precision)

   var iconFeature = new ol.Feature({
     geometry: new ol.geom.Point(ol.proj.fromLonLat([longitud,latitud])),
     name: 'Ubicacion'
     
   }); */


   

  // var iconStyle = new ol.style.Style({
   //  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
     /*   anchor: [0.5, 46],
       anchorXUnits: 'fraction',
       anchorYUnits: 'pixels',
       src: 'assets/home.ico',
       scale: .10 
     }))
   });

   iconFeature.setStyle(iconStyle);

   var vectorSource = new ol.source.Vector({
     features: [iconFeature]
   });

   var vectorLayer = new ol.layer.Vector({
     source: vectorSource
   });
   
   map.addLayer( vectorLayer);

  
 }

 function procesar_error(error) {
      
   // Analizar el error que se envió desde el API
   // console.log(error);
   
 } */
/***** Fin Codigo para obtener la localizacion por gps******/


var vectorSource = new ol.source.Vector({
});
var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});
map.addLayer(vectorLayer);



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

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    /* url:'http://geoeducacion.neuquen.gov.ar/proxy/http://geoeducacion.neuquen.gov.ar/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&' +
    'typename=establecimientos_edu:ra_nqn_tec&outputFormat=application/json&srsname=EPSG:3857&',
    serverType: 'geoserver',
    crossOrigin: 'anonymous', */
    // If you want to use a static file, change the previous row to
    url: 'data/radios_tecnica.json',
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


map.on('singleclick', function (evt) {  
   let coordenadas = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
   marcarPunto(evt.coordinate,coordenadas)   

  /* let feature = getFeature(evt.pixel)
   
  if (feature) {
      
      var geometry = feature.getGeometry();
      var coord = geometry.getCoordinates();
      // console.log(geometry)
      let coordTransform = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326') 
    //  var content = '<h3>' + feature.get('ESTABLECIM') + '</h3>';
     var content = '<h4>' + feature.get('ETIQUETA') + '</h4>';
     // content += '<h5>' + coordTransform + '</h5>';
   //   simpleReverseGeocoding(coordTransform[0],coordTransform[1])
   //   $('#mi_escuela').html(`${feature.get('ESTABLECIM')}`);
      
      popup.show(evt.coordinate, content);
      
  } */

   
});

//Listen when an address is chosen
geocoder.on('addresschosen', function(evt) {  
  console.log(evt)
  window.setTimeout(function() {
    
    popup.show(evt.coordinate, evt.address.formatted);
    let feature = getFeature(map.getPixelFromCoordinate(evt.coordinate))
     if (feature) $('#mi_escuela').html(`${feature.get('ESTABLECIM')}`);

    // console.log('By Geocoder:')
    // console.log(evt.coordinate)
    // console.log(evt.address.formatted)
    // console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'))  
    // console.log(ol.proj.fromLonLat(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')))
    
    $('#mi_direccion').html(`${evt.address.details.name}`);
    map.getView().setZoom(20);
  }, 2000);
});

function simpleReverseGeocoding(lon, lat) {

   fetch('https://dev.virtualearth.net/REST/v1/Locations/'+lat+','+lon+'?includeEntityTypes=address&key=AuB_TgCn4vLZq_rFH8btGAYIZiigOwKplCqBqSuG7Shjew1oUPzyeoENK_oEsaKf').then(function(response) {

    return response.json();
  }).then(function(json) {   
   $('#mi_direccion').html(`${json.resourceSets[0].resources[0].address.addressLine||''}, ${json.resourceSets[0].resources[0].address.adminDistrict2||''}, ${json.resourceSets[0].resources[0].address.adminDistrict||''}`);   
  }) 
 
}


function getFeature(pixel){
  var feature = map.forEachFeatureAtPixel(pixel,
    function(feature, layer) {      
      if (feature.id_.includes('ra_nqn')){
        return feature;
      }
    });

    return feature
}


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

  if (direccionReferencia===null){
    $('#mi_direccion').html(`Información no suministrada`);
    return
  }

  $('#mi_direccion').html(`${direccionReferencia}, ${localidadReferencia}`);

  //2. utilizamos georeverse para determinar la latitud y longitud de la localizacion dada
  const urlQuery = new URL("https://dev.virtualearth.net/REST/v1/Locations");
  urlQuery.searchParams.append("countryRegion", "Argentina");
  urlQuery.searchParams.append("adminDistrict", "Neuquen");
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
    if(json.statusCode==200 && json.resourceSets.length==1 ){
      localizacionRetorno = json.resourceSets[0]
      coordenadasRetorno = localizacionRetorno.resources[0].point.coordinates
      coordenadasLonLat=[coordenadasRetorno[1],coordenadasRetorno[0]]
      var point = ol.proj.fromLonLat(coordenadasLonLat)
      marcarPunto(point,coordenadasLonLat)
     map.getView().setCenter(ol.proj.transform(coordenadasLonLat, 'EPSG:4326','EPSG:3857'));
      map.getView().setZoom(19);   
    }else{
      //mostrar leyenda de que la direccion no ha podido ser referenciada
    }
  
  })
  
  
  
  
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
      console.log('asd')
      $('#json').html(JSON.stringify(generarInformacionRetorno(feature)));
    }
  }else{
    alert('Debe indicar/marcar en el mapa el punto donde se encuentra ubicado su domicilio')
  }
  
}

function generarInformacionRetorno(feature){  
  return {"Coordenadas":{"Latitud":coordenadasUbicacion[0],"Longitud":coordenadasUbicacion[1]}, "Radios": [{"CueAnexo":"xxxxxxxxx","Nombre":feature.get('ESTABLECIM'),"Nivel":"secundario-tecnica"}]}
}
  
 marcarDireccionInicial() 


})(window, document);

