function generarInformacionRadiosParaRetorno(latitud,longitud,tipoRadio,radios){

    informacionRadios=[]
    radios.forEach(radio=>{
        
        let nivel=getNivel(radio.id_.toLowerCase())
        let nombre = getNombre(radio.get('RADIO'))
        let radioElem = {
            "CUE":radio.get('CUEANEXO'),
            "Nombre":nombre,
            "Nivel":nivel,
            "TipoRadio":tipoRadio,
        }

        informacionRadios.push(radioElem)
    })

    if(informacionRadios.length>0){
        informacionRadios.push({})
    }
    
   
   let informacionRetorno = {
    "Coordenadas": { 
        "Latitud":latitud,
        "Longitud":longitud,
        "Radios": informacionRadios,         
        }
    } 
    
   // console.log(JSON.stringify(JSON.stringify(informacionRetorno).replace(",{}",",")))
    
    return JSON.stringify(informacionRetorno).replace(",{}",",")
}

function getNivel(nivelReferencia){
    let nivel=''
    if (nivelReferencia.includes("ini")){
        nivel = "I"
    }
    if (nivelReferencia.includes("pri")){
        nivel = "P"
    }
    if (nivelReferencia.includes("sec")){
        nivel = "S"
    }
    if (nivelReferencia.includes("tec")){
        nivel = "ST"
    }

    return nivel
}

function getNombre(nombreReferencia){
   return nombreReferencia.split(" ").slice(1).join(" ")
}