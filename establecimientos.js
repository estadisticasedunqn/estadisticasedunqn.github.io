function clearEstablecimientosTabla(){
    $("#establecimientosTable > tbody").empty();
}
function mostrarEstablecimientosTabla(establecimientos){
    clearEstablecimientosTabla()
    establecimientos.forEach(establecimiento => {
       if(Object.entries(establecimiento).length !== 0){
        
$('#establecimientosTable > tbody:last-child').append(`
        <tr>
        <td>${establecimiento.CUE}</td>
        <td>${establecimiento.Nombre}</td>
        <td>${getNivelFormateado(establecimiento.Nivel)}</td>
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