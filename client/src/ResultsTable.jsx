import React from "react";

const ResultsTable = ({data})=>{
    if(!data||data.length===0){
        return <p>No results to display.</p>;
    }

    const headers = Object.keys(data[0]);

    return(
        <table>
            <thead>
                <tr>
                    {headers.map((header)=>(
                        <th key={header}>{header.replace(/_/g,' ').toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row,index)=>(
                    <tr key={index}>
                        {headers.map((header)=>(
                            <td key={header}>{String(row[header])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default ResultsTable;