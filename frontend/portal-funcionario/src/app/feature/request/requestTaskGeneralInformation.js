import React,{ useState,useEffect } from 'react';
import dynamic from "next/dynamic";
import ProcessFormServies from "@/app/api/processFormServices";
import ProcessInstanceServices from '@/app/api/processInstanceServices';
const RequestTaskGeneralInformation =(props)=>{
    const Formio = dynamic(
        () => import("@formio/react").then((mod) => mod.Form),
        { ssr: false }
        );
    const row=props.row;
    const [components,setComponents]=useState({"type":"form","display":"form","components":[]});
    const [cont, setCont]= useState(0);
    const [data, setData]= useState({"data":{ }});


    useEffect(()=>{
        ProcessFormServies.GetProcessesForm({"processName":row.processName,"activityName":"00_INFOGENERAL_FUNCIONARIO"}).then((rta)=>{
            if(!!rta&&rta.length>0){
                rta[0].type="form";
                rta[0].display="form";
                setComponents(rta[0]);
            }
        });
        ProcessInstanceServices.getHistory({"processInstanceId":row.processInstanceId})
            .then((data)=>{
                setData({"data":data[0]});
        });
    }, [cont]);
    return (
    <div  className="custom-viewer">
        <Formio submission={data} src={components} ></Formio>
    </div>
    );
}

export default RequestTaskGeneralInformation;