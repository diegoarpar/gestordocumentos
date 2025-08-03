function  TenantServices  () {
   
}
async function tenant(data){
    var headers={};
    return await fetch("/api/tenant",{
        method: 'GET',
        headers: {Authorization: [data]}
    });
}



export default  {tenant
};