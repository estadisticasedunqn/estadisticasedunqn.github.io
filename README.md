# estadisticasedunqn.github.io


## Utilizacion de la app 
### La app tienen dos modos de funcionamiento:
#### Modo Establecimientos
Se cargan en el mapa los establecimientos de la provincia y el usuario puede realizar un filtro por nivel. Modo de funcionamiento

https://estadisticasedunqn.github.io/?modo=establecimientos&direccion=concordia+3381&localidad=neuquen&tipoRadio=D&latitud=-68.10576889318466&longitud=-38.94600331153993&departamento=CONFLUENCIA

La direccion y la localidad son utilizados para centrar el mapa en el punto correspondiente. En caso de no tener dichos valores se muestra la provincia en su totalidad

modo = radios | establecimientos
tipoRadio= D | L (Domicilio,Laboral)

#### Modo Radios
Se carga la capa de radios escolares en el mapa, y de acuerdo al punto de localizacion que se marque en el mapa
se obtienen los radios escolares que pertenezcan a dicho punto. Dicho modo interacciona con el web service provisto por 
la app de inscripcion online. Modo de funcionamiento

https://estadisticasedunqn.github.io/?modo=radios&direccion=concordia+3381&localidad=neuquen&tipoRadio=D&registranteId=26&latitud=-68.10576889318466&longitud=-38.94600331153993&departamento=CONFLUENCIA



modo = radios | establecimientos
tipoRadio= D | L (Domicilio,Laboral)

#### Observacion de Ubicacion inicial en el mapa
En caso de contar con los parametros latitud y longitud se utilizarán los mismos para marcar el punto en el mapa. Si no se utilizaran los campos direccion y localidad.

En caso de no tener dichos valores se muestra la provincia en su totalidad



#### Informacion retorno
cuando el usuario confirme la ubicacion la app enviara un elemento json para su almacenamiento con la siguiente información:
    {
        "Coordenadas":{
        "Latitud":number,
        "Longitud":number,
        "Radios": [
            {
            "CUE":number(9),
            "Nombre":text,
            "Nivel":I|P|S|ST (Inicial|Primaria|Secundaria|Secundaria Tecnica),
            "TipoRadio":D|L (Domicilio|Laboral) 
            },...
        ]
        }
    } 



## Uso en Desarrollo
git clone https://github.com/estadisticasedunqn/estadisticasedunqn.github.io.git


sobre el directorio raiz. Ejecutar los siguientes comandos en consola

1- instalar las dependencias
npm i

2- ejecutar la aplicacion
npm run dev

3- probar la aplicacion
localhost:3000/?modo=radios&direccion=concordia+3381&localidad=neuquen&tipoRadio=D&registranteId=26&latitud=-68.10576889318466&longitud=-38.94600331153993


