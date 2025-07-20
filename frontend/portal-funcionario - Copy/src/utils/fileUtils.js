
function extraerArchivosFormulario(formulario) {
    let archivos=[];
    for (var atributo in formulario){
        if(Array.isArray(formulario[atributo]) && formulario[atributo][0].hasOwnProperty("storage")){
            archivos.push(formulario[atributo][0]);
            delete formulario[atributo];
        }
    }
    return [formulario, archivos];
}

export default {
    extraerArchivosFormulario
}