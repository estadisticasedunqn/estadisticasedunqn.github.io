function clearEstablecimientosTabla(){
    $("#establecimientosTable > tbody").empty();
}
function mostrarEstablecimientosTabla(establecimientos){
    clearEstablecimientosTabla()
    establecimientos.forEach( (establecimiento,index) => {
       if(Object.entries(establecimiento).length !== 0){

        chequearHabilitadoPorDisponibilidadEnVacantes(establecimiento.CUE, establecimiento.Nivel,`vacante${index}`)

$('#establecimientosTable > tbody:last-child').append(`
        <tr>
        <td>${establecimiento.CUE}</td>
        <td>${establecimiento.Nombre}</td>
        <td>${getNivelFormateado(establecimiento.Nivel)}</td>
        <td id="vacante${index}" style="text-align:center"></td>
        </tr>`);
       }
        
    });
    
}

function getNivelFormateado(nivelReferencia){
    let nivel=''
    if (nivelReferencia ==="I"){
        nivel = "Inicial"
    }
    if (nivelReferencia==="P"){
        nivel = "Primario"
    }
    if (nivelReferencia==="S"){
        nivel = "Secundario"
    }
    if (nivelReferencia==="ST"){
        nivel = "Secundario Técnico"
    }

    return nivel

}

function chequearHabilitadoPorDisponibilidadEnVacantes(cueanexo, nivelReferencia,referenciaElemTabla){

    let nivel=''
    if (nivelReferencia ==="I"){
        nivel = "1"
    }
    if (nivelReferencia==="P"){
        nivel = "2"
    }
    if (nivelReferencia==="S"){
        nivel = "3"
    }
    if (nivelReferencia==="ST"){
        nivel = "3"
    }

    let xmlhttp = new XMLHttpRequest();
    let sr =`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cer="CertiRegu">
    <soapenv:Header/>
    <soapenv:Body>
       <cer:WSValidaEscuela.Execute>
          <cer:Pcue>${cueanexo}</cer:Pcue>
          <cer:Pescuelanivel>${nivel}</cer:Pescuelanivel>
       </cer:WSValidaEscuela.Execute>
    </soapenv:Body>
 </soapenv:Envelope>`;
 
 xmlhttp.open('POST', 'https://regular.neuquen.gob.ar/Inscripciones/servlet/com.certiregu.awsvalidaescuela'); 

 xmlhttp.onreadystatechange = function () {  
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            xmlDoc = xmlhttp.responseXML;
            habilitado = xmlDoc.getElementsByTagName("Habilitado");    
            valorHabilitado = habilitado[0].childNodes[0].nodeValue
            $(`#${referenciaElemTabla}`).text( +valorHabilitado==1?'SI':'NO')
            
        }else{
            $(`#${referenciaElemTabla}`).text('-')
        }
    }
  }
  // Send the POST request
  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr);

}