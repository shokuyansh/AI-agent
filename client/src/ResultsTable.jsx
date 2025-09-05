import React from "react";

const ResultsTable = ({data})=>{
    if(!data||data.length===0){
        return <p>No results to display.</p>;
    }

    const headers = Object.keys(data[0]);
    const formatCellContent = (key, value) => {
    
        if ((key === 'purchased_on' || key === 'due_date' || key === 'spent_on') && typeof value === 'string') {
            try {
               
                return new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(new Date(value));
            } catch (error) {
                return value; 
            }
        }
        return String(value); 
    };
    return(
        <div className="table-container">
        <table className="results-table">
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
                            <td key={header}>{formatCellContent(header, row[header])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}
export default ResultsTable;